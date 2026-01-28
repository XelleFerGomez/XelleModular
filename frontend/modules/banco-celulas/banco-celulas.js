// frontend/modules/banco-celulas/banco-celulas.js

/**
 * Módulo: Banco de Células v1.0
 * Funcionalidad: Dashboard Operativo, Gestión de Cultivos, Incubadoras y Recepción (FO-LC-17).
 */

window.app = window.app || {};

window.app['banco-celulas'] = {

    state: {
        activeTab: 'dashboard', 
        
        // --- DATOS SIMULADOS ---
        incubators: [
            { id: 'INC-01', name: 'Incubadora CO2 Principal', temp: 37.0, co2: 5.0, humidity: 95, status: 'OK', capacity: 20, used: 12 },
            { id: 'INC-02', name: 'Incubadora Cuarentena', temp: 37.1, co2: 4.9, humidity: 94, status: 'OK', capacity: 10, used: 2 }
        ],

        activeCultures: [
            { id: 'CULT-24-001', line: 'HEK293T', passage: 12, vessel: 'T-75', location: 'INC-01', lastUpdate: new Date(Date.now() - 2 * 3600 * 1000) },
            { id: 'CULT-24-005', line: 'CHO-K1', passage: 8, vessel: 'Erlenmeyer 125mL', location: 'INC-01', lastUpdate: new Date(Date.now() - 50 * 3600 * 1000) }, // Alerta
            { id: 'CULT-24-008', line: 'Mesenchymal', passage: 4, vessel: 'T-175', location: 'INC-02', lastUpdate: new Date(Date.now() - 5 * 3600 * 1000) }
        ],

        pendingTasks: [
            { id: 1, title: 'Validar Lote Medios', priority: 'Alta', due: 'Hoy' },
            { id: 2, title: 'Descongelar Vial Control', priority: 'Normal', due: 'Mañana' }
        ]
    },

    // --- 1. INICIALIZACIÓN ---
    init: function() {
        console.log('Inicializando Banco de Células V1...');
        const container = document.getElementById('view-module');

        container.innerHTML = `
            <div class="flex flex-col gap-6 animate-fade-in pb-12">
                
                <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <h2 class="text-3xl font-black text-xelle-navy tracking-tight">Banco de Células</h2>
                        <p class="text-slate-500 text-sm mt-1">Gestión integral de cultivos, criopreservación y equipamiento.</p>
                    </div>
                    
                    <div class="relative group">
                        <button onclick="window.app['banco-celulas'].toggleNewMenu()" class="bg-primary hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all">
                            <span class="material-symbols-outlined">add</span> Nuevo Registro
                        </button>
                        
                        <div id="new-record-menu" class="hidden absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-fade-in">
                            <div class="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entradas</div>
                            <button onclick="window.app['banco-celulas'].renderReceptionForm()" class="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-sm font-bold text-xelle-navy flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary">input</span> Recepción (FO-LC-17)
                            </button>
                            <div class="h-px bg-slate-100 my-1"></div>
                            <div class="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Procesos</div>
                            <button onclick="alert('En desarrollo: Pasaje')" class="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-sm font-bold text-xelle-navy flex items-center gap-2">
                                <span class="material-symbols-outlined text-blue-500">autorenew</span> Pasaje / Subcultivo
                            </button>
                            <button onclick="alert('En desarrollo: Congelación')" class="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-lg text-sm font-bold text-xelle-navy flex items-center gap-2">
                                <span class="material-symbols-outlined text-cyan-500">ac_unit</span> Criopreservación
                            </button>
                        </div>
                    </div>
                </div>

                <div id="celulas-content">
                    </div>
            </div>
        `;

        // Cargar vista inicial
        this.switchTab('dashboard');
    },

    // --- 2. CONTROL DE NAVEGACIÓN ---
    switchTab: function(tabName) {
        this.state.activeTab = tabName;
        const container = document.getElementById('celulas-content');
        
        // Actualizar Breadcrumbs
        let crumbs = ['Banco de Células'];
        if (tabName === 'dashboard') crumbs.push('Dashboard Operativo');
        if (tabName === 'recepcion') crumbs.push('Recepción', 'FO-LC-17');

        if(window.app.updateBreadcrumb) {
            window.app.updateBreadcrumb(crumbs);
        }

        // Renderizar contenido
        if (tabName === 'dashboard') {
            this.renderDashboard(container);
        }
        // Nota: 'recepcion' se renderiza directamente desde su función renderReceptionForm
    },

    toggleNewMenu: function() {
        const menu = document.getElementById('new-record-menu');
        if(menu) menu.classList.toggle('hidden');
    },

    // --- 3. VISTA: DASHBOARD OPERATIVO ---
    renderDashboard: function(container) {
        container.innerHTML = `
            <div class="animate-fade-in space-y-6">
                <div id="cell-kpis"></div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 flex flex-col gap-6">
                        
                        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 class="font-bold text-xelle-navy flex items-center gap-2">
                                    <span class="material-symbols-outlined text-orange-500">assignment_late</span> Atención Requerida
                                </h3>
                                <span class="text-xs font-bold text-slate-400">Actualizado: Ahora</span>
                            </div>
                            <div class="p-0">
                                ${this.renderAlertsList()}
                            </div>
                        </div>

                        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                            <h3 class="font-bold text-xelle-navy mb-4 flex items-center gap-2">
                                <span class="material-symbols-outlined text-blue-500">kitchen</span> Estado de Incubadoras
                            </h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${this.renderIncubators()}
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-1">
                        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
                            <div class="p-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 class="font-bold text-xelle-navy flex items-center gap-2">
                                    <span class="material-symbols-outlined text-emerald-600">inventory_2</span> Almacén de Lab.
                                </h3>
                            </div>
                            <div class="p-0 flex-1 overflow-y-auto max-h-[400px]">
                                <table class="w-full text-left">
                                    <tbody class="divide-y divide-slate-50">
                                        ${this.renderLabSupplies()}
                                    </tbody>
                                </table>
                            </div>
                            <div class="p-3 border-t border-slate-100 text-center">
                                <button onclick="window.app.navigateTo('almacen')" class="text-xs font-bold text-primary hover:underline">Ir a Almacén Completo</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.renderKPIs();
    },

    // --- 4. VISTA: RECEPCIÓN DE LÍNEA (WIZARD FO-LC-17) ---
    // --- VISTA: RECEPCIÓN DE LÍNEA (WIZARD FO-LC-17 COMPLETO) ---
    renderReceptionForm: function() {
        const container = document.getElementById('celulas-content');
        const menu = document.getElementById('new-record-menu');
        if(menu) menu.classList.add('hidden');

        if(window.app.updateBreadcrumb) {
            window.app.updateBreadcrumb(['Banco de Células', 'Recepción', 'FO-LC-17 (Clínico)']);
        }

        container.innerHTML = `
            <div class="max-w-5xl mx-auto animate-fade-in pt-4 pb-12">
                
                <div class="bg-white p-6 rounded-t-2xl border border-slate-200 border-b-0 flex justify-between items-start">
                    <div class="flex items-start gap-4">
                        <div class="p-3 bg-red-50 rounded-xl text-red-600">
                            <span class="material-symbols-outlined text-3xl">clinical_notes</span>
                        </div>
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <span class="px-2 py-0.5 bg-xelle-navy text-white text-[10px] font-black uppercase rounded tracking-wider">FO-LC-17</span>
                                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Rev. 04</span>
                            </div>
                            <h2 class="text-2xl font-black text-xelle-navy">Recepción de Muestras y Datos Clínicos</h2>
                            <p class="text-slate-500 text-sm font-medium">Registro de ingreso de muestras biológicas humanas y datos asociados.</p>
                        </div>
                    </div>
                    <button onclick="window.app['banco-celulas'].switchTab('dashboard')" class="text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 p-2 rounded-full">
                        <span class="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                <div class="bg-slate-50 border-y border-slate-200 p-4">
                    <div class="flex justify-center items-center max-w-4xl mx-auto">
                        <div class="flex flex-col items-center gap-2 cursor-pointer" onclick="window.app['banco-celulas'].nextStep(1)">
                            <div id="ind-1" class="w-10 h-10 rounded-full bg-xelle-navy text-white flex items-center justify-center font-bold shadow-lg shadow-xelle-navy/20 transition-all">1</div>
                            <span class="text-[10px] font-bold text-xelle-navy uppercase tracking-wider text-center">Logística<br>& Origen</span>
                        </div>
                        <div class="h-1 flex-1 bg-slate-200 mx-4 rounded-full overflow-hidden"><div id="bar-1" class="h-full bg-slate-200 w-0 transition-all duration-500"></div></div>
                        
                        <div class="flex flex-col items-center gap-2 cursor-pointer" onclick="window.app['banco-celulas'].nextStep(2)">
                            <div id="ind-2" class="w-10 h-10 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center font-bold transition-all">2</div>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Datos<br>Paciente</span>
                        </div>
                        <div class="h-1 flex-1 bg-slate-200 mx-4 rounded-full overflow-hidden"><div id="bar-2" class="h-full bg-slate-200 w-0 transition-all duration-500"></div></div>

                        <div class="flex flex-col items-center gap-2 cursor-pointer" onclick="window.app['banco-celulas'].nextStep(3)">
                            <div id="ind-3" class="w-10 h-10 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center font-bold transition-all">3</div>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Muestra &<br>Recolección</span>
                        </div>
                        <div class="h-1 flex-1 bg-slate-200 mx-4 rounded-full overflow-hidden"><div id="bar-3" class="h-full bg-slate-200 w-0 transition-all duration-500"></div></div>

                        <div class="flex flex-col items-center gap-2 cursor-pointer" onclick="window.app['banco-celulas'].nextStep(4)">
                            <div id="ind-4" class="w-10 h-10 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center font-bold transition-all">4</div>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Criterios<br>Aceptación</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-b-2xl border border-slate-200 border-t-0 shadow-sm min-h-[500px]">
                    <form id="form-fo-lc-17">
                        
                        <div id="step-1" class="space-y-8 animate-fade-in">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                
                                <div class="col-span-full pb-2 mb-2 border-b border-slate-100">
                                    <h4 class="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                        <span class="material-symbols-outlined text-lg">local_shipping</span> Datos de Recepción
                                    </h4>
                                </div>

                                <div>
                                    <label class="form-label">Fecha y Hora de Arribo</label>
                                    <input type="datetime-local" class="form-input" value="${new Date().toISOString().slice(0, 16)}">
                                </div>
                                <div>
                                    <label class="form-label">Institución / Clínica de Origen</label>
                                    <input type="text" class="form-input" placeholder="Ej. Hospital Ángeles, Clínica X...">
                                </div>
                                <div>
                                    <label class="form-label">Médico Responsable / Investigador</label>
                                    <input type="text" class="form-input" placeholder="Dr. Juan Pérez">
                                </div>
                                <div>
                                    <label class="form-label">Mensajería / Transportista</label>
                                    <input type="text" class="form-input" placeholder="Nombre de quien entrega">
                                </div>
                                
                                <div class="col-span-full pb-2 mb-2 mt-4 border-b border-slate-100">
                                    <h4 class="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                        <span class="material-symbols-outlined text-lg">folder_shared</span> Proyecto / Protocolo
                                    </h4>
                                </div>

                                <div class="col-span-full">
                                    <label class="form-label">Nombre del Protocolo / Proyecto</label>
                                    <input type="text" class="form-input" placeholder="Ej. Ensayo Clínico Fase II - MSCs">
                                </div>
                                <div>
                                    <label class="form-label">Código de Protocolo (IRB/Comité)</label>
                                    <input type="text" class="form-input font-mono" placeholder="PROT-2024-001">
                                </div>
                                <div>
                                    <label class="form-label">Recibido por (Personal Xelle)</label>
                                    <input type="text" class="form-input bg-slate-50 text-slate-500" value="Xelle_Fer" disabled>
                                </div>
                            </div>
                            
                            <div class="flex justify-end pt-6 border-t border-slate-50">
                                <button type="button" onclick="window.app['banco-celulas'].nextStep(2)" class="btn-primary">
                                    Siguiente Paso <span class="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </div>

                        <div id="step-2" class="hidden space-y-8 animate-fade-in">
                            
                            <div class="bg-orange-50 p-4 rounded-xl border border-orange-100 flex gap-3">
                                <span class="material-symbols-outlined text-orange-600">lock</span>
                                <div>
                                    <p class="text-xs text-orange-900 font-bold uppercase">Datos Confidenciales</p>
                                    <p class="text-xs text-orange-800 font-medium">
                                        Manejo de datos bajo normativa de protección de datos personales. Asegure la anonimización si el protocolo lo requiere.
                                    </p>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div>
                                    <label class="form-label">ID Paciente / Donante (Código)</label>
                                    <input type="text" class="form-input font-mono text-xelle-navy font-bold" placeholder="DON-XXXX-001">
                                </div>
                                <div>
                                    <label class="form-label">Iniciales del Paciente</label>
                                    <input type="text" class="form-input uppercase" placeholder="A.B.C.">
                                </div>
                                <div>
                                    <label class="form-label">Fecha de Nacimiento</label>
                                    <input type="date" class="form-input">
                                </div>
                                <div>
                                    <label class="form-label">Edad (Años)</label>
                                    <input type="number" class="form-input" placeholder="00">
                                </div>
                                <div>
                                    <label class="form-label">Sexo Biológico</label>
                                    <select class="form-input">
                                        <option>Femenino</option>
                                        <option>Masculino</option>
                                    </select>
                                </div>
                                
                                <div class="col-span-full">
                                    <label class="form-label">Diagnóstico / Condición Clínica</label>
                                    <textarea class="form-input" rows="2" placeholder="Ej. Osteoartritis grado 3 rodilla derecha..."></textarea>
                                </div>

                                <div class="col-span-full bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <label class="form-label mb-2">Medicamentos Relevantes / Alergias</label>
                                    <input type="text" class="form-input" placeholder="Ej. Penicilina (Alergia), Anticoagulantes...">
                                </div>
                            </div>

                            <div class="flex justify-between pt-6 border-t border-slate-50">
                                <button type="button" onclick="window.app['banco-celulas'].nextStep(1)" class="btn-secondary">Atrás</button>
                                <button type="button" onclick="window.app['banco-celulas'].nextStep(3)" class="btn-primary">Siguiente Paso</button>
                            </div>
                        </div>

                        <div id="step-3" class="hidden space-y-8 animate-fade-in">
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div class="col-span-full border-b border-slate-100 pb-2 mb-2">
                                    <h4 class="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                        <span class="material-symbols-outlined text-lg">biotech</span> Características de la Muestra
                                    </h4>
                                </div>

                                <div>
                                    <label class="form-label">Tipo de Muestra</label>
                                    <select class="form-input font-bold text-xelle-navy">
                                        <option value="">Seleccione...</option>
                                        <option>Sangre Periférica</option>
                                        <option>Médula Ósea</option>
                                        <option>Tejido Adiposo (Lipoaspirado)</option>
                                        <option>Cordón Umbilical (Tejido)</option>
                                        <option>Sangre de Cordón</option>
                                        <option>Pieza Dental</option>
                                        <option>Biopsia de Piel</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label">Sitio Anatómico de Toma</label>
                                    <input type="text" class="form-input" placeholder="Ej. Abdomen, Cresta ilíaca...">
                                </div>
                                
                                <div>
                                    <label class="form-label">Fecha y Hora de Recolección</label>
                                    <input type="datetime-local" class="form-input">
                                </div>
                                <div>
                                    <label class="form-label">Tiempo Transcurrido (Horas)</label>
                                    <input type="number" class="form-input bg-slate-50" placeholder="Auto-cálculo" disabled>
                                </div>

                                <div>
                                    <label class="form-label">Volumen / Peso Recibido</label>
                                    <div class="flex gap-2">
                                        <input type="number" class="form-input" placeholder="0.00">
                                        <select class="form-input w-24">
                                            <option>mL</option>
                                            <option>g</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label class="form-label">Número de Contenedores (Tubos/Frascos)</label>
                                    <input type="number" class="form-input" placeholder="1">
                                </div>

                                <div class="col-span-full">
                                    <label class="form-label">Medio de Transporte / Aditivos</label>
                                    <input type="text" class="form-input" placeholder="Ej. Solución Salina + Antibiótico, Tubo EDTA, Tubo Heparina...">
                                </div>
                            </div>

                            <div class="flex justify-between pt-6 border-t border-slate-50">
                                <button type="button" onclick="window.app['banco-celulas'].nextStep(2)" class="btn-secondary">Atrás</button>
                                <button type="button" onclick="window.app['banco-celulas'].nextStep(4)" class="btn-primary">Siguiente Paso</button>
                            </div>
                        </div>

                        <div id="step-4" class="hidden space-y-8 animate-fade-in">
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-4">
                                    <h5 class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Inspección Física y Documental</h5>
                                    
                                    <label class="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                                        <span class="text-sm font-bold text-slate-700">Envase Íntegro (Sin fugas/roturas)</span>
                                        <input type="checkbox" class="w-5 h-5 accent-emerald-600">
                                    </label>
                                    <label class="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                                        <span class="text-sm font-bold text-slate-700">Etiquetado Correcto e Identificable</span>
                                        <input type="checkbox" class="w-5 h-5 accent-emerald-600">
                                    </label>
                                    <label class="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                                        <span class="text-sm font-bold text-slate-700">Temperatura Adecuada de Transporte</span>
                                        <input type="checkbox" class="w-5 h-5 accent-emerald-600">
                                    </label>
                                    <label class="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                                        <span class="text-sm font-bold text-slate-700">Consentimiento Informado Firmado</span>
                                        <input type="checkbox" class="w-5 h-5 accent-emerald-600">
                                    </label>
                                    <label class="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
                                        <span class="text-sm font-bold text-slate-700">Historia Clínica / Serologías Adjuntas</span>
                                        <input type="checkbox" class="w-5 h-5 accent-emerald-600">
                                    </label>
                                </div>

                                <div class="space-y-4">
                                    <h5 class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Dictamen de Recepción</h5>
                                    
                                    <div>
                                        <label class="form-label">Temperatura de Arribo (°C)</label>
                                        <input type="number" class="form-input font-bold" placeholder="Ej. 4.0">
                                    </div>

                                    <div class="pt-2">
                                        <label class="form-label mb-2">Decisión Final</label>
                                        <div class="flex gap-4">
                                            <label class="flex-1">
                                                <input type="radio" name="decision" class="peer sr-only" checked>
                                                <div class="p-3 text-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold peer-checked:bg-emerald-600 peer-checked:text-white cursor-pointer transition-all">
                                                    ACEPTAR
                                                </div>
                                            </label>
                                            <label class="flex-1">
                                                <input type="radio" name="decision" class="peer sr-only">
                                                <div class="p-3 text-center rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold peer-checked:bg-red-600 peer-checked:text-white cursor-pointer transition-all">
                                                    RECHAZAR
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label class="form-label">Comentarios / Desviaciones</label>
                                        <textarea class="form-input" rows="3" placeholder="Si rechaza, especifique la razón..."></textarea>
                                    </div>
                                </div>
                            </div>

                            <div class="flex justify-between pt-6 border-t border-slate-50">
                                <button type="button" onclick="window.app['banco-celulas'].nextStep(3)" class="btn-secondary">Atrás</button>
                                <button type="button" onclick="window.app['banco-celulas'].saveReception()" class="bg-xelle-navy hover:bg-blue-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all transform hover:scale-[1.02]">
                                    <span class="material-symbols-outlined">save</span> Generar Registro
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
                
                <style>
                    .form-label { display: block; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: #1E3A5F; margin-bottom: 0.25rem; letter-spacing: 0.05em; }
                    .form-input { width: 100%; padding: 0.75rem 1rem; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 0.75rem; font-size: 0.875rem; outline: none; transition: all 0.2s; color: #334155; font-weight: 500; }
                    .form-input:focus { border-color: #2FA583; box-shadow: 0 0 0 3px rgba(47, 165, 131, 0.1); background-color: #FFFFFF; }
                    .btn-primary { background-color: #1E3A5F; color: white; padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 700; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem; box-shadow: 0 4px 6px -1px rgba(30, 58, 95, 0.2); transition: all 0.2s; }
                    .btn-primary:hover { background-color: #152a45; transform: translateY(-1px); }
                    .btn-secondary { color: #64748B; background-color: white; border: 1px solid #E2E8F0; padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 700; font-size: 0.875rem; transition: all 0.2s; }
                    .btn-secondary:hover { background-color: #F1F5F9; color: #1E3A5F; }
                </style>
            </div>
        `;
    },

    nextStep: function(step) {
        // Ocultar todos
        [1, 2, 3, 4].forEach(i => document.getElementById(`step-${i}`).classList.add('hidden'));
        // Mostrar actual
        document.getElementById(`step-${step}`).classList.remove('hidden');

        // Actualizar barra de progreso visual
        for(let i=1; i<=4; i++) {
            const ind = document.getElementById(`ind-${i}`);
            const bar = document.getElementById(`bar-${i-1}`); // Barra previa
            
            if(i <= step) {
                // Activo / Pasado
                ind.className = "w-10 h-10 rounded-full bg-xelle-navy text-white flex items-center justify-center font-bold shadow-lg shadow-xelle-navy/20 transition-all scale-110";
                if(bar) { bar.className = "h-full bg-xelle-navy w-full transition-all duration-500"; }
            } else {
                // Futuro
                ind.className = "w-10 h-10 rounded-full bg-white border-2 border-slate-300 text-slate-400 flex items-center justify-center font-bold transition-all";
                if(bar) { bar.className = "h-full bg-slate-200 w-full transition-all duration-500"; }
            }
        }
    },

    saveReception: function() {
        alert("¡Recepción Completada!\n\nSe ha generado el registro: FO-LC-17-2024-001\nUbicación: Tanque T-02 (Cuarentena)\n\nEl sistema ha notificado a Calidad para la liberación.");
        this.switchTab('dashboard');
    },

    // --- HELPERS DE RENDERIZADO (KPIs, Tablas) ---

    renderKPIs: function() {
        const container = document.getElementById('cell-kpis');
        if(!container) return;

        const activeLinesCount = new Set(this.state.activeCultures.map(c => c.line)).size;
        const totalVessels = this.state.activeCultures.length;
        const activeIncubators = this.state.incubators.filter(i => i.status === 'OK').length;
        const totalVials = 462; 

        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all">
                    <div>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Líneas en Cultivo</p>
                        <p class="text-3xl font-black text-xelle-navy mt-1">${activeLinesCount}</p>
                    </div>
                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span class="material-symbols-outlined">category</span>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all">
                    <div>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Incubadoras OK</p>
                        <p class="text-3xl font-black text-xelle-navy mt-1">${activeIncubators} <span class="text-sm text-slate-400 font-bold">/ ${this.state.incubators.length}</span></p>
                    </div>
                    <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span class="material-symbols-outlined">kitchen</span>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all">
                    <div>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recipientes</p>
                        <p class="text-3xl font-black text-xelle-navy mt-1">${totalVessels}</p>
                    </div>
                    <div class="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span class="material-symbols-outlined">biotech</span>
                    </div>
                </div>

                 <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all overflow-hidden">
                    <div class="flex-1 min-w-0"> 
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">Total Viales</p>
                        <p class="text-3xl font-black text-xelle-navy mt-1 truncate">${totalVials}</p>
                    </div>
                    <div class="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ml-2">
                        <span class="material-symbols-outlined text-[24px]">snowflake</span>
                    </div>
                </div>
            </div>
        `;
    },

    renderAlertsList: function() {
        let html = '';
        const now = new Date();
        this.state.activeCultures.forEach(c => {
            const diffHours = (now - c.lastUpdate) / (1000 * 60 * 60);
            if(diffHours > 48) {
                html += `
                    <div class="flex items-center gap-4 p-4 border-b border-slate-50 hover:bg-red-50/30 transition-colors border-l-4 border-l-red-500">
                        <div class="p-2 bg-red-100 text-red-600 rounded-lg">
                            <span class="material-symbols-outlined text-lg">history_toggle_off</span>
                        </div>
                        <div class="flex-1">
                            <p class="text-sm font-bold text-xelle-navy">Bitácora desactualizada: ${c.line}</p>
                            <p class="text-xs text-slate-500">ID: ${c.id} • Hace ${Math.floor(diffHours)}h</p>
                        </div>
                        <button class="px-3 py-1 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50">Actualizar</button>
                    </div>
                `;
            }
        });
        this.state.pendingTasks.forEach(t => {
            let priorityClass = t.priority === 'Alta' ? 'text-orange-600 bg-orange-50 border-orange-100' : 'text-slate-500 bg-slate-50 border-slate-200';
            html += `
                <div class="flex items-center gap-4 p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors border-l-4 border-l-transparent">
                    <div class="p-2 bg-slate-100 text-slate-500 rounded-lg">
                        <span class="material-symbols-outlined text-lg">task</span>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-bold text-xelle-navy">${t.title}</p>
                        <p class="text-xs text-slate-500">Vence: ${t.due}</p>
                    </div>
                    <span class="px-2 py-1 rounded text-[10px] font-bold border ${priorityClass}">${t.priority}</span>
                </div>
            `;
        });
        return html || '<div class="p-6 text-center text-slate-400 text-sm">Todo al día.</div>';
    },

    renderLabSupplies: function() {
        const allItems = window.app.almacen ? window.app.almacen.state.inventory : [];
        const labItems = allItems.length > 0 ? allItems.filter(i => i.line === 'MPLAB') : [
            { name: 'DMEM High Glucose', stock: 12, min: 10, unit: 'Botellas' },
            { name: 'Suero Fetal Bovino', stock: 2, min: 5, unit: 'Botellas' },
            { name: 'Tripsina-EDTA', stock: 8, min: 4, unit: 'Viales' }
        ];

        let html = '';
        labItems.forEach(item => {
            const isLow = item.stock <= item.min;
            const stockColor = isLow ? 'text-red-500 font-bold' : 'text-slate-600';
            const icon = isLow ? 'warning' : 'check_circle';
            const iconColor = isLow ? 'text-red-500' : 'text-emerald-500';

            html += `
                <tr class="hover:bg-slate-50">
                    <td class="p-3">
                        <div class="flex items-start gap-2">
                            <span class="material-symbols-outlined ${iconColor} text-[16px] mt-0.5">${icon}</span>
                            <div>
                                <p class="text-xs font-bold text-xelle-navy line-clamp-1">${item.name}</p>
                                <p class="text-[10px] ${stockColor}">${item.stock} ${item.unit} (Mín: ${item.min})</p>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });
        return html;
    },

    renderIncubators: function() {
        return this.state.incubators.map(inc => {
            return `
                <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-2">
                    <div class="flex justify-between items-start">
                        <span class="text-xs font-bold text-xelle-navy uppercase">${inc.id}</span>
                        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <div class="flex justify-between items-end">
                        <div>
                            <span class="text-2xl font-black text-xelle-navy">${inc.temp}°</span>
                            <span class="text-[10px] text-slate-500">CO2: ${inc.co2}%</span>
                        </div>
                        <span class="text-xs font-bold text-blue-600">${inc.humidity}% HR</span>
                    </div>
                    <div class="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                        <div class="bg-primary h-full rounded-full" style="width: ${(inc.used/inc.capacity)*100}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }
};