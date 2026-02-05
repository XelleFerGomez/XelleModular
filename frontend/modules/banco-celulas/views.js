/**
 * VISTAS (PRESENTATION LAYER)
 * Renderiza el HTML basado en datos del Backend
 */

window.app = window.app || {};
window.app.views = window.app.views || {};

window.app.views.bancoCelulas = {

    // --- LAYOUT PRINCIPAL ---
    layout: (menuHtml) => `
        <div class="flex h-[calc(100vh-80px)] overflow-hidden font-display bg-bg-light animate-fade-in">
            <aside class="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 hidden md:flex z-10 shadow-sm relative">
                <div class="p-6">
                    <div class="flex items-center gap-3 mb-8">
                        <div class="w-10 h-10 rounded-xl bg-xelle-navy flex items-center justify-center shadow-lg shadow-xelle-navy/20">
                            <span class="material-symbols-outlined text-white text-xl">biotech</span>
                        </div>
                        <div>
                            <h1 class="text-xelle-navy text-sm font-black leading-tight tracking-tight">BANCO DE<br>CÉLULAS</h1>
                            <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">Producción</p>
                        </div>
                    </div>
                    <nav class="flex flex-col gap-1 space-y-1">${menuHtml}</nav>
                </div>
                <div class="mt-auto p-4 border-t border-slate-100 bg-slate-50">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">OP</div>
                        <div class="overflow-hidden">
                            <p class="text-xs font-bold text-xelle-navy truncate">Modo Operador</p>
                            <p class="text-[9px] text-slate-500 uppercase flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online</p>
                        </div>
                    </div>
                </div>
            </aside>
            <main id="bc-main-content" class="flex-1 flex flex-col overflow-y-auto bg-bg-light relative scroll-smooth p-0"></main>
        </div>
    `,

    // --- DASHBOARD ---
    dashboard: (stats, alertsHtml) => `
        <header class="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
            <div><h2 class="text-xl font-black text-xelle-navy tracking-tight">Panel de Control</h2><p class="text-xs text-slate-500 font-medium">Resumen operativo del laboratorio</p></div>
            <button onclick="window.app.bancoCelulas.navigateTo('recepcion')" class="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"><span class="material-symbols-outlined text-sm">add_circle</span> NUEVO INGRESO</button>
        </header>
        <div class="p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6 animate-fade-in">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${window.app.views.bancoCelulas.components.kpiCard('microbiology', 'Cultivos Activos', stats.activeCultures, '+5', 'primary')}
                ${window.app.views.bancoCelulas.components.kpiCard('warning', 'Cuarentena', stats.quarantine, 'Acción Req.', 'orange-500')}
                ${window.app.views.bancoCelulas.components.kpiCard('kitchen', 'Ocupación Equipos', stats.incubatorUsage + '%', 'Capacidad', 'xelle-sky')}
                ${window.app.views.bancoCelulas.components.kpiCard('ac_unit', 'Stock Viales', stats.totalVials.toLocaleString(), 'Unidades', 'xelle-navy')}
            </div>
            <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div class="xl:col-span-2 flex flex-col gap-6">
                    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 class="font-bold text-xelle-navy text-sm flex gap-2"><span class="material-symbols-outlined text-orange-500 text-lg">notifications_active</span> Alertas del Sistema</h3>
                        </div>
                        <div class="divide-y divide-slate-50">${alertsHtml}</div>
                    </div>
                </div>
            </div>
        </div>
    `,

    // --- RECEPCIÓN (FO-LC-17) ---
    recepcion: () => `
        <div class="flex flex-col h-full animate-fade-in">
            <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-20">
                <div>
                    <div class="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5"><span class="cursor-pointer hover:text-primary" onclick="window.app.bancoCelulas.navigateTo('dashboard')">Dashboard</span><span class="material-symbols-outlined text-[10px]">chevron_right</span><span class="text-primary">Nueva Recepción</span></div>
                    <h2 class="text-xl font-black text-xelle-navy tracking-tight">Registro de Línea Celular (FO-LC-17)</h2>
                </div>
                <div class="flex gap-3">
                    <button onclick="window.app.bancoCelulas.navigateTo('dashboard')" class="px-4 py-2 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors">Cancelar</button>
                    <button onclick="window.app.bancoCelulas.Logic.saveForm()" class="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20"><span class="material-symbols-outlined text-sm">save</span> GUARDAR</button>
                </div>
            </header>
            <div class="flex-1 overflow-y-auto p-8">
                <div class="max-w-5xl mx-auto space-y-6">
                    <form id="form-recepcion">
                        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 class="font-bold text-sm text-xelle-navy uppercase tracking-wide mb-4 border-b pb-2 flex gap-2"><span class="material-symbols-outlined text-primary">person</span> 1. Información del Donante</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-1">
                                    <label class="text-[10px] font-bold text-slate-500 uppercase">Nombre Completo</label>
                                    <input type="text" id="nombreDonante" class="w-full border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-primary" placeholder="Ej. María González">
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-bold text-slate-500 uppercase">Fecha Nacimiento</label>
                                    <input type="date" id="fechaNacimiento" class="w-full border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-primary">
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-bold text-slate-500 uppercase">ID Pasaporte / Identificación</label>
                                    <input type="text" id="idPasaporte" class="w-full border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-primary" placeholder="A12345678">
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mt-6">
                            <h3 class="font-bold text-sm text-xelle-navy uppercase tracking-wide mb-4 border-b pb-2 flex gap-2"><span class="material-symbols-outlined text-blue-500">biotech</span> 2. Datos de la Muestra</h3>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div class="space-y-1">
                                    <label class="text-[10px] font-bold text-slate-500 uppercase">Tipo de Tejido</label>
                                    <select id="tipoTejido" class="w-full border-slate-200 rounded-lg text-sm font-bold text-xelle-navy focus:border-primary focus:ring-primary">
                                        <option value="Cordon Umbilical">Cordón Umbilical</option>
                                        <option value="Placenta">Placenta</option>
                                        <option value="Tejido Adiposo">Tejido Adiposo</option>
                                        <option value="Medula Osea">Médula Ósea</option>
                                    </select>
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-bold text-slate-500 uppercase">Fecha Colecta</label>
                                    <input type="date" id="fechaColecta" class="w-full border-slate-200 rounded-lg text-sm focus:border-primary focus:ring-primary">
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-bold text-slate-500 uppercase">Temp. Recepción (°C)</label>
                                    <input type="number" id="temperaturaRecepcion" step="0.1" class="w-full border-slate-200 rounded-lg text-sm pl-4 focus:border-primary focus:ring-primary" placeholder="0.0">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,

    // --- CULTIVOS ACTIVOS ---
    cultivos: (cultures) => `
        <div class="flex flex-col h-full animate-fade-in">
            <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                <h2 class="text-xl font-black text-xelle-navy tracking-tight">Gestión de Cultivos Activos</h2>
                <button onclick="window.app.bancoCelulas.Logic.promptNuevoCultivo()" class="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg shadow-primary/20">
                    <span class="material-symbols-outlined text-sm">add</span> Registrar Inicio / Pase
                </button>
            </header>
            
            <div class="p-8 overflow-y-auto">
                <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">ID</th>
                                <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">Línea</th>
                                <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">Pase</th>
                                <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">Ubicación</th>
                                <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">Confluencia</th>
                                <th class="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">Estado</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${cultures.length > 0 ? cultures.map(c => `
                            <tr class="hover:bg-slate-50/50 group transition-colors">
                                <td class="px-6 py-4 font-mono text-xs font-bold text-xelle-navy">#${c.id}</td>
                                <td class="px-6 py-4 text-sm font-bold text-slate-700">${c.lineaCelular || 'N/A'}</td>
                                <td class="px-6 py-4"><span class="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100">P${c.pasajeActual}</span></td>
                                <td class="px-6 py-4 text-xs font-bold text-slate-500">${c.incubadoraUbicacion}</td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <div class="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden"><div class="bg-primary h-full rounded-full" style="width: ${c.confluenciaActual}%"></div></div>
                                        <span class="text-xs font-bold">${c.confluenciaActual}%</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4"><span class="text-[10px] font-bold uppercase ${c.estado === 'Listo' ? 'text-purple-600 bg-purple-50' : 'text-emerald-600 bg-emerald-50'} px-2 py-1 rounded">${c.estado}</span></td>
                            </tr>`).join('') : `<tr><td colspan="6" class="px-6 py-8 text-center text-slate-400 text-sm">No hay cultivos activos registrados.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,

    // --- INCUBADORAS (CONECTADO A BACKEND) ---
    incubadoras: (incubators) => `
        <div class="p-8 h-full flex flex-col animate-fade-in">
            <h2 class="text-2xl font-black text-xelle-navy mb-6">Flota de Incubadoras (Tiempo Real)</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                ${incubators.map(inc => {
                    // AJUSTE DE COLORES SEGÚN ESTADO
                    let borderColor = "border-slate-200";
                    let iconColor = "text-slate-400";
                    let statusColor = "bg-slate-100 text-slate-500";
                    
                    if (inc.estado === 'ok') { borderColor = "border-emerald-200"; iconColor = "text-emerald-500"; statusColor = "bg-emerald-100 text-emerald-700"; }
                    if (inc.estado === 'warning') { borderColor = "border-orange-200"; iconColor = "text-orange-500"; statusColor = "bg-orange-100 text-orange-700"; }
                    if (inc.estado === 'error') { borderColor = "border-red-200"; iconColor = "text-red-500"; statusColor = "bg-red-100 text-red-700"; }

                    // AJUSTE DE VARIABLES (temperaturaActual, co2Actual)
                    return `
                    <div class="bg-white rounded-2xl border ${borderColor} shadow-sm p-5 relative overflow-hidden group hover:shadow-md transition-all">
                        <div class="flex justify-between items-start mb-4">
                            <h4 class="font-black text-xelle-navy text-lg">${inc.id}</h4>
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColor}">${inc.estado}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-slate-50 rounded-lg p-3 text-center">
                                <p class="text-[10px] font-bold text-slate-400 uppercase">Temp</p>
                                <p class="text-2xl font-black text-slate-700">${inc.temperaturaActual}°C</p>
                            </div>
                            <div class="bg-slate-50 rounded-lg p-3 text-center">
                                <p class="text-[10px] font-bold text-slate-400 uppercase">CO2</p>
                                <p class="text-2xl font-black text-slate-700">${inc.co2Actual}%</p>
                            </div>
                        </div>
                        <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                            <span class="text-[10px] font-bold text-slate-400">Humedad: ${inc.humedadActual}%</span>
                            <span class="material-symbols-outlined ${iconColor}">thermostat</span>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>
    `,

    // --- CRIOBANCO ---
    criobanco: () => `
        <div class="flex flex-col h-full animate-fade-in">
            <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
                <h2 class="text-xl font-black text-xelle-navy">Visualizador Criobanco (FO-LC-22)</h2>
            </header>
            <div class="flex-1 p-8 flex gap-8 justify-center overflow-y-auto">
                <div class="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 max-w-2xl">
                    <div id="cryo-grid-container" class="grid grid-cols-10 gap-2 aspect-square bg-slate-50 p-2 rounded-xl"></div>
                </div>
            </div>
        </div>
    `,

    // --- COMPONENTES REUTILIZABLES ---
    components: {
        navBtn: (id, icon, label) => `<button id="nav-btn-${id}" onclick="window.app.bancoCelulas.navigateTo('${id}')" class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full text-left group text-slate-500 hover:bg-slate-50 hover:text-xelle-navy"><span class="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">${icon}</span><span class="text-xs font-bold tracking-wide">${label}</span></button>`,
        kpiCard: (icon, title, value, sub, color) => {
            const txt = color==='primary'?'text-primary':`text-${color}`; 
            const bg = color==='primary'?'bg-primary':`bg-${color}`;
            return `<div class="glass-panel bg-white p-5 rounded-2xl border border-slate-100 relative overflow-hidden group hover:border-slate-300 transition-all"><div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><span class="material-symbols-outlined text-6xl text-xelle-navy">${icon}</span></div><p class="text-xs font-bold text-slate-400 uppercase tracking-wider">${title}</p><div class="flex items-baseline gap-2 mt-2"><p class="text-3xl font-black text-xelle-navy">${value}</p><span class="text-[10px] font-bold ${txt} bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">${sub}</span></div><div class="mt-3 w-full bg-slate-100 h-1 rounded-full overflow-hidden"><div class="${bg} h-full rounded-full" style="width: 70%"></div></div></div>`;
        },
        alertRow: (a) => {
            let icon = 'info', color = 'text-blue-500 bg-blue-50';
            if (a.type === 'critical') { icon = 'error'; color = 'text-red-500 bg-red-50'; }
            if (a.type === 'warning') { icon = 'warning'; color = 'text-orange-500 bg-orange-50'; }
            return `<div class="px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-default"><div class="w-8 h-8 rounded-lg ${color} flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-lg">${icon}</span></div><div class="flex-1"><p class="text-sm font-bold text-slate-700 leading-tight">${a.msg}</p><p class="text-[10px] font-bold text-slate-400 uppercase mt-1">Hace ${a.time}</p></div></div>`;
        },
        construction: (id) => `<div class="flex flex-col items-center justify-center h-full p-10 text-center"><span class="material-symbols-outlined text-6xl text-slate-200 mb-4">construction</span><h2 class="text-2xl font-bold text-xelle-navy">En Desarrollo</h2><p class="text-slate-500 mt-2">Vista [${id}] en construcción modular.</p><button onclick="window.app.bancoCelulas.navigateTo('dashboard')" class="mt-6 text-primary font-bold hover:underline">Volver</button></div>`
    }
};