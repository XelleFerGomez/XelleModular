// frontend/modules/celulas/celulas.js

/**
 * Módulo: Banco de Células V1.0 (Advanced)
 * Funcionalidad: 
 * - Inventario de líneas celulares.
 * - Mapa visual de cajas criogénicas (Grid 9x9 o 10x10).
 * - Gestión de Tanques y Niveles de N2.
 */

window.app = window.app || {};

window.app['banco-celulas'] = {

    state: {
        activeTab: 'inventario', // inventario | mapa | tanques
        selectedBox: null,       // Para la vista de mapa
        
        // DATOS QUE LUEGO VENDRÁN DE LA BASE DE DATOS (Backend)
        cells: [
            { id: 'V-1001', line: 'HEK293T', type: 'WCB', passage: 12, date: '2023-11-15', location: 'T01-R01-C01-A1', user: 'F. Gomez', status: 'Vigente' },
            { id: 'V-1002', line: 'HEK293T', type: 'WCB', passage: 12, date: '2023-11-15', location: 'T01-R01-C01-A2', user: 'F. Gomez', status: 'Vigente' },
            { id: 'V-1003', line: 'CHO-K1',  type: 'MCB', passage: 4,  date: '2024-01-10', location: 'T01-R01-C01-B5', user: 'A. Admin', status: 'Cuarentena' },
        ],
        
        // Estructura física (Configuración de hardware)
        tanks: [
            { id: 'T01', name: 'Dewar Principal', capacity_boxes: 10, current_boxes: 4, temp: -196, level: 85 },
            { id: 'T02', name: 'Dewar Cuarentena', capacity_boxes: 5, current_boxes: 1, temp: -190, level: 40 }
        ]
    },

    init: function() {
        console.log('Inicializando Banco de Células Avanzado...');
        const container = document.getElementById('view-module');

        container.innerHTML = `
            <div class="flex flex-col gap-6 animate-fade-in pb-12">
                
                <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <h2 class="text-3xl font-black text-xelle-navy tracking-tight">Banco de Células</h2>
                        <p class="text-slate-500 text-sm mt-1">Gestión de criopreservación, MCB/WCB y ubicación visual.</p>
                    </div>
                    <div class="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                        <button onclick="window.app['banco-celulas'].switchTab('inventario')" id="tab-cel-inventario" class="tab-btn px-6 py-2 rounded-lg text-sm font-bold transition-all">Listado General</button>
                        <button onclick="window.app['banco-celulas'].switchTab('mapa')" id="tab-cel-mapa" class="tab-btn px-6 py-2 rounded-lg text-sm font-bold transition-all">Mapa de Cajas</button>
                        <button onclick="window.app['banco-celulas'].switchTab('tanques')" id="tab-cel-tanques" class="tab-btn px-6 py-2 rounded-lg text-sm font-bold transition-all">Estado Tanques</button>
                    </div>
                </div>

                <div id="celulas-content" class="min-h-[500px]"></div>
            </div>
            
            <div id="celulas-modal-container" class="relative z-[100]"></div>
        `;

        this.switchTab(this.state.activeTab);
    },

    switchTab: function(tabName) {
        this.state.activeTab = tabName;
        
        // Estilos Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => btn.className = 'tab-btn px-6 py-2 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-50');
        document.getElementById(`tab-cel-${tabName}`).className = 'tab-btn px-6 py-2 rounded-lg text-sm font-bold bg-xelle-navy text-white shadow-md';

        const content = document.getElementById('celulas-content');
        if (tabName === 'inventario') this.renderList(content);
        if (tabName === 'mapa') this.renderBoxMapSelector(content);
        if (tabName === 'tanques') this.renderTanks(content);
    },

    // --- VISTA 1: LISTADO GENERAL (Tipo Excel) ---
    renderList: function(container) {
        const cells = this.state.cells;
        
        let html = `
            <div class="flex flex-col gap-4 animate-fade-in">
                <div class="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div class="flex items-center gap-2 w-1/2">
                        <span class="material-symbols-outlined text-slate-400">search</span>
                        <input type="text" placeholder="Buscar por Línea, ID Vial o Ubicación..." class="w-full bg-transparent outline-none text-sm font-bold text-xelle-navy">
                    </div>
                    <button onclick="window.app['banco-celulas'].openEntryModal()" class="bg-primary hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
                        <span class="material-symbols-outlined">add_circle</span> Ingreso Vial
                    </button>
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-slate-50 border-b border-slate-200 text-slate-500">
                            <tr>
                                <th class="px-6 py-4 text-[10px] font-black uppercase">ID Vial</th>
                                <th class="px-6 py-4 text-[10px] font-black uppercase">Línea Celular</th>
                                <th class="px-6 py-4 text-[10px] font-black uppercase text-center">Tipo</th>
                                <th class="px-6 py-4 text-[10px] font-black uppercase text-center">Pasaje</th>
                                <th class="px-6 py-4 text-[10px] font-black uppercase">Ubicación</th>
                                <th class="px-6 py-4 text-[10px] font-black uppercase text-center">Fecha Cong.</th>
                                <th class="px-6 py-4 text-[10px] font-black uppercase text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
        `;

        cells.forEach(c => {
            let typeBadge = c.type === 'MCB' 
                ? `<span class="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-200">MCB</span>`
                : `<span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-200">WCB</span>`;

            html += `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-3 font-mono text-xs font-bold text-xelle-navy">${c.id}</td>
                    <td class="px-6 py-3 font-bold text-sm">${c.line}</td>
                    <td class="px-6 py-3 text-center">${typeBadge}</td>
                    <td class="px-6 py-3 text-center text-xs font-bold">P${c.passage}</td>
                    <td class="px-6 py-3 text-xs font-mono text-slate-500">${c.location}</td>
                    <td class="px-6 py-3 text-center text-xs text-slate-500">${c.date}</td>
                    <td class="px-6 py-3 text-right">
                         <button class="text-slate-400 hover:text-primary"><span class="material-symbols-outlined text-[18px]">visibility</span></button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table></div></div>`;
        container.innerHTML = html;
    },

    // --- VISTA 2: MAPA VISUAL DE CAJAS (GRID) ---
    renderBoxMapSelector: function(container) {
        // Simulación: El usuario selecciona primero el Tanque y la Caja
        container.innerHTML = `
            <div class="flex flex-col lg:flex-row gap-6 animate-fade-in h-[600px]">
                
                <div class="w-full lg:w-1/3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
                    <h3 class="font-bold text-xelle-navy border-b border-slate-100 pb-2">Explorador de Ubicaciones</h3>
                    
                    <div class="space-y-2 overflow-y-auto flex-1">
                        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <div class="flex items-center gap-2 font-bold text-sm text-xelle-navy mb-2">
                                <span class="material-symbols-outlined text-blue-500">kitchen</span> T01: Dewar Principal
                            </div>
                            <div class="pl-6 space-y-1">
                                <button onclick="window.app['banco-celulas'].loadBoxMap('T01-R01-C01')" class="w-full text-left text-xs p-2 hover:bg-white rounded-lg flex items-center gap-2 transition-colors ${this.state.selectedBox === 'T01-R01-C01' ? 'bg-white shadow-sm text-primary font-bold' : 'text-slate-500'}">
                                    <span class="material-symbols-outlined text-[16px]">grid_view</span> Rack 1 - Caja 1 (HEK293)
                                </button>
                                <button class="w-full text-left text-xs p-2 hover:bg-white rounded-lg flex items-center gap-2 transition-colors text-slate-500">
                                    <span class="material-symbols-outlined text-[16px]">grid_view</span> Rack 1 - Caja 2 (CHO)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="w-full lg:w-2/3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col relative">
                    <div id="box-grid-view" class="flex-1 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                        <div class="text-center text-slate-400">
                            <span class="material-symbols-outlined text-4xl mb-2">grid_on</span>
                            <p class="text-sm font-bold">Selecciona una caja para ver su contenido</p>
                        </div>
                    </div>
                    
                    <div class="mt-4 flex gap-4 text-[10px] font-bold uppercase text-slate-500 justify-center">
                        <span class="flex items-center gap-1"><span class="w-3 h-3 bg-slate-200 rounded-sm"></span> Vacío</span>
                        <span class="flex items-center gap-1"><span class="w-3 h-3 bg-purple-500 rounded-sm"></span> MCB</span>
                        <span class="flex items-center gap-1"><span class="w-3 h-3 bg-blue-500 rounded-sm"></span> WCB</span>
                        <span class="flex items-center gap-1"><span class="w-3 h-3 bg-red-500 rounded-sm"></span> Sel.</span>
                    </div>
                </div>
            </div>
        `;
    },

    loadBoxMap: function(boxId) {
        this.state.selectedBox = boxId;
        const container = document.getElementById('box-grid-view');
        
        // Simular Grid 9x9 (81 posiciones)
        let gridHtml = `
            <div class="flex flex-col items-center">
                <h4 class="font-bold text-xelle-navy mb-4">Vista Superior: ${boxId} (9x9)</h4>
                <div class="grid grid-cols-9 gap-1 p-2 bg-slate-800 rounded-lg shadow-inner">`;

        // Generar celdas (Simulación: algunas ocupadas)
        for(let i=0; i<81; i++) {
            const row = String.fromCharCode(65 + Math.floor(i / 9)); // A, B, C...
            const col = (i % 9) + 1; // 1, 2, 3...
            const posCode = `${row}${col}`;
            
            // Simular ocupación aleatoria para visualización
            let cellClass = "bg-slate-200 hover:bg-slate-300 cursor-pointer";
            let tooltip = "Vacío";
            
            // Simular datos ocupados (Esto vendría de la BD real)
            if (i === 0) { cellClass = "bg-blue-500 hover:bg-blue-400 text-white"; tooltip = "WCB: HEK293T"; } // A1
            if (i === 1) { cellClass = "bg-blue-500 hover:bg-blue-400 text-white"; tooltip = "WCB: HEK293T"; } // A2
            if (i === 13) { cellClass = "bg-purple-500 hover:bg-purple-400 text-white"; tooltip = "MCB: CHO-K1"; } // B5

            gridHtml += `
                <div class="w-8 h-8 ${cellClass} rounded-sm flex items-center justify-center text-[8px] font-mono transition-colors relative group" title="${posCode}: ${tooltip}">
                    ${posCode}
                </div>
            `;
        }

        gridHtml += `</div></div>`;
        container.innerHTML = gridHtml;
        container.className = "flex-1 flex items-center justify-center bg-white"; // Quitar el estilo dashed
    },

    // --- VISTA 3: ESTADO DE TANQUES ---
    renderTanks: function(container) {
        const tanks = this.state.tanks;
        
        let html = `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">`;
        
        tanks.forEach(t => {
            // Cálculo de estilos según nivel
            let levelColor = "bg-blue-500";
            if (t.level < 20) levelColor = "bg-red-500 animate-pulse";
            else if (t.level < 50) levelColor = "bg-orange-500";

            html += `
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-64 relative overflow-hidden">
                    <div class="absolute -right-6 -top-6 text-slate-50 opacity-50">
                        <span class="material-symbols-outlined text-9xl">propane_tank</span>
                    </div>

                    <div class="relative z-10">
                        <div class="flex justify-between items-start">
                            <div>
                                <h3 class="text-xl font-black text-xelle-navy">${t.id}</h3>
                                <p class="text-sm font-bold text-slate-500">${t.name}</p>
                            </div>
                            <span class="px-2 py-1 bg-cyan-50 text-cyan-600 rounded-lg text-xs font-black border border-cyan-100 flex items-center gap-1">
                                <span class="material-symbols-outlined text-sm">thermostat</span> ${t.temp}°C
                            </span>
                        </div>
                    </div>

                    <div class="relative z-10 w-full flex items-end gap-6">
                        <div class="w-24 h-32 border-2 border-slate-300 rounded-lg relative bg-slate-100 overflow-hidden flex flex-col-reverse">
                            <div class="${levelColor} w-full transition-all duration-1000 opacity-80" style="height: ${t.level}%"></div>
                            <div class="absolute inset-0 border-t border-slate-300/50" style="top: 25%"></div>
                            <div class="absolute inset-0 border-t border-slate-300/50" style="top: 50%"></div>
                            <div class="absolute inset-0 border-t border-slate-300/50" style="top: 75%"></div>
                        </div>

                        <div class="flex-1 space-y-3 pb-2">
                            <div>
                                <p class="text-xs font-bold text-slate-400 uppercase">Nivel N2 Líquido</p>
                                <p class="text-2xl font-black text-xelle-navy">${t.level}%</p>
                            </div>
                            <div>
                                <p class="text-xs font-bold text-slate-400 uppercase">Ocupación</p>
                                <p class="text-lg font-bold text-slate-700">${t.current_boxes} / ${t.capacity_boxes} Cajas</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        container.innerHTML = html;
    },

    // --- MODAL: INGRESO VIAL (Simulación) ---
    openEntryModal: function() {
        alert("Aquí se abrirá el formulario para ingresar un nuevo vial:\n1. Selección de Línea Celular\n2. Tipo (MCB/WCB)\n3. Selección de Ubicación en el Mapa\n4. Impresión de Etiqueta QR");
    }
};