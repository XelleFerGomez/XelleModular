/**
 * MÓDULO: BANCO DE CÉLULAS (CONTROLLER)
 * Versión: 1.1 (Carga Estática)
 */

window.app = window.app || {};

window.app.bancoCelulas = {

    init: function() {
        console.log('🚀 Inicializando Banco de Células...');
        if (!window.app.services.bancoCelulas || !window.app.views.bancoCelulas) {
            console.error("❌ ERROR CRÍTICO: Faltan dependencias.");
            document.getElementById('view-module').innerHTML = '<div class="p-10 text-red-500 font-bold">Error: Faltan scripts.</div>';
            return;
        }
        this.startApp();
    },

    startApp: function() {
        const container = document.getElementById('view-module');
        const menuItems = [
            { id: 'dashboard', icon: 'dashboard', label: 'Panel de Control' },
            { id: 'recepcion', icon: 'input', label: 'Recepción (LC-17)' },
            { id: 'cultivos', icon: 'microbiology', label: 'Cultivos Activos' },
            { id: 'incubadoras', icon: 'kitchen', label: 'Incubadoras' },
            { id: 'criobanco', icon: 'ac_unit', label: 'Criobanco (LC-22)' }
        ];
        const menuHtml = menuItems.map(item => window.app.views.bancoCelulas.components.navBtn(item.id, item.icon, item.label)).join('');
        container.innerHTML = window.app.views.bancoCelulas.layout(menuHtml);
        this.navigateTo('dashboard');
    },

    navigateTo: async function(viewId) {
        const main = document.getElementById('bc-main-content');
        main.innerHTML = '<div class="flex h-full items-center justify-center"><div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>';
        this.updateActiveMenu(viewId);

        try {
            switch(viewId) {
                case 'dashboard':
                    let stats, alerts;
                    try {
                        stats = await window.app.services.bancoCelulas.getDashboardStats();
                        alerts = await window.app.services.bancoCelulas.getAlerts();
                    } catch (e) {
                        stats = { activeCultures: 0, quarantine: 0, totalVials: 0, incubatorUsage: 0 };
                        alerts = [{ type: 'warning', msg: 'Sin conexión Backend', time: 'Ahora' }];
                    }
                    const alertsHtml = alerts.map(a => window.app.views.bancoCelulas.components.alertRow(a)).join('');
                    main.innerHTML = window.app.views.bancoCelulas.dashboard(stats, alertsHtml);
                    break;
                case 'recepcion':
                    main.innerHTML = window.app.views.bancoCelulas.recepcion();
                    break;
                case 'cultivos':
                    try {
                        const cultures = await window.app.services.bancoCelulas.getCultures();
                        main.innerHTML = window.app.views.bancoCelulas.cultivos(cultures);
                    } catch (e) {
                        main.innerHTML = `<div class="p-8 text-center text-slate-500">Error cargando cultivos.</div>`;
                    }
                    break;
                case 'incubadoras':
                    const incubators = await window.app.services.bancoCelulas.getIncubators();
                    main.innerHTML = window.app.views.bancoCelulas.incubadoras(incubators);
                    break;
                case 'criobanco':
                    main.innerHTML = window.app.views.bancoCelulas.criobanco();
                    this.Logic.initCryoGrid();
                    break;
                default:
                    main.innerHTML = window.app.views.bancoCelulas.components.construction(viewId);
            }
        } catch (error) {
            main.innerHTML = `<div class="p-10 text-red-500">Error: ${error.message}</div>`;
        }
    },

    updateActiveMenu: function(activeId) {
        document.querySelectorAll('aside nav button').forEach(btn => {
            btn.className = 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full text-left group text-slate-500 hover:bg-slate-50 hover:text-xelle-navy';
            const icon = btn.querySelector('span');
            if(icon) icon.className = 'material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform text-slate-400';
        });
        const activeBtn = document.getElementById(`nav-btn-${activeId}`);
        if(activeBtn) {
            activeBtn.className = 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full text-left group bg-xelle-navy text-white shadow-md shadow-xelle-navy/30';
            activeBtn.querySelector('span').className = 'material-symbols-outlined text-[20px] text-primary';
        }
    },

    Logic: {
        initCryoGrid: function() {
            const container = document.getElementById('cryo-grid-container');
            if(!container) return;
            for(let i=0; i<100; i++) {
                const cell = document.createElement('div');
                cell.className = `w-full h-full rounded-md bg-white border border-slate-200 hover:border-primary cursor-pointer`;
                container.appendChild(cell);
            }
        },

        saveForm: async function() {
            const loteData = {
                nombreDonante: document.getElementById('nombreDonante').value,
                fechaNacimiento: document.getElementById('fechaNacimiento').value,
                idPasaporte: document.getElementById('idPasaporte').value,
                tipoTejido: document.getElementById('tipoTejido').value,
                fechaColecta: document.getElementById('fechaColecta').value,
                temperaturaRecepcion: parseFloat(document.getElementById('temperaturaRecepcion').value)
            };
            if(!loteData.nombreDonante || !loteData.idPasaporte) {
                alert("⚠️ Datos incompletos."); return;
            }
            try {
                const resultado = await window.app.services.bancoCelulas.saveReception(loteData);
                alert(`✅ Guardado: ID ${resultado.id}`);
                window.app.bancoCelulas.navigateTo('dashboard');
            } catch (error) {
                alert("❌ Error Backend.");
            }
        }, // <--- ¡AQUÍ FALTABA LA COMA!

        promptNuevoCultivo: async function() {
            const linea = prompt("Línea Celular:", "MSC-Wharton");
            if(!linea) return;
            const pase = prompt("Pase:", "0");
            const incubadora = prompt("Ubicación:", "INC-01");

            const nuevoCultivo = {
                lineaCelular: linea,
                pasajeActual: parseInt(pase),
                incubadoraUbicacion: incubadora,
                confluenciaActual: 10,
                estado: "En Proceso",
                loteOrigenId: "MANUAL"
            };

            try {
                await window.app.services.bancoCelulas.saveCulture(nuevoCultivo);
                alert("✅ Cultivo iniciado");
                window.app.bancoCelulas.navigateTo('cultivos');
            } catch (e) {
                alert("Error guardando cultivo");
            }
        }
    }
};