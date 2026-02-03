// frontend/modules/banco-celulas/views.js

/**
 * VISTAS (PRESENTATION LAYER)
 * Solo HTML y diseño visual. No maneja datos.
 */

window.app = window.app || {};
window.app.views = window.app.views || {};

window.app.views.bancoCelulas = {

    // Layout Principal
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

    // Dashboard
    dashboard: (stats, alertsHtml) => `
        <header class="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
            <div><h2 class="text-xl font-black text-xelle-navy">Panel de Control</h2></div>
            <button onclick="window.app.bancoCelulas.navigateTo('recepcion')" class="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-bold text-xs flex gap-2 shadow-lg shadow-primary/20"><span class="material-symbols-outlined text-sm">add_circle</span> NUEVO INGRESO</button>
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
                            <h3 class="font-bold text-xelle-navy text-sm flex gap-2"><span class="material-symbols-outlined text-orange-500 text-lg">notifications_active</span> Alertas</h3>
                        </div>
                        <div class="divide-y divide-slate-50">${alertsHtml}</div>
                    </div>
                </div>
            </div>
        </div>
    `,

    // Componentes Reutilizables (Micro-vistas)
    components: {
        navBtn: (id, icon, label) => `
            <button id="nav-btn-${id}" onclick="window.app.bancoCelulas.navigateTo('${id}')" 
                class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full text-left group text-slate-500 hover:bg-slate-50 hover:text-xelle-navy">
                <span class="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">${icon}</span>
                <span class="text-xs font-bold tracking-wide">${label}</span>
            </button>
        `,
        kpiCard: (icon, title, value, sub, colorClass) => {
            const isTextPrimary = colorClass === 'primary';
            const textColor = isTextPrimary ? 'text-primary' : `text-${colorClass}`;
            const bgClass = isTextPrimary ? 'bg-primary' : `bg-${colorClass}`;
            return `
                <div class="glass-panel bg-white p-5 rounded-2xl border border-slate-100 relative overflow-hidden group hover:border-slate-300 transition-all">
                    <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><span class="material-symbols-outlined text-6xl text-xelle-navy">${icon}</span></div>
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">${title}</p>
                    <div class="flex items-baseline gap-2 mt-2">
                        <p class="text-3xl font-black text-xelle-navy">${value}</p>
                        <span class="text-[10px] font-bold ${textColor} bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">${sub}</span>
                    </div>
                    <div class="mt-3 w-full bg-slate-100 h-1 rounded-full overflow-hidden"><div class="${bgClass} h-full rounded-full" style="width: 70%"></div></div>
                </div>
            `;
        },
        alertRow: (a) => {
            let icon = 'info', color = 'text-blue-500 bg-blue-50';
            if (a.type === 'critical') { icon = 'error'; color = 'text-red-500 bg-red-50'; }
            if (a.type === 'warning') { icon = 'warning'; color = 'text-orange-500 bg-orange-50'; }
            return `
                <div class="px-6 py-4 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-default">
                    <div class="w-8 h-8 rounded-lg ${color} flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-lg">${icon}</span></div>
                    <div class="flex-1"><p class="text-sm font-bold text-slate-700 leading-tight">${a.msg}</p><p class="text-[10px] font-bold text-slate-400 uppercase mt-1">Hace ${a.time}</p></div>
                </div>
            `;
        }
    }
};