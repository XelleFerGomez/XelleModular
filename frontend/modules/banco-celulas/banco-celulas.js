// frontend/modules/banco-celulas/banco-celulas.js

/**
 * MÓDULO: BANCO DE CÉLULAS (CONTROLLER)
 * Arquitectura: MVC (Model-View-Controller)
 * Prepara el terreno para la integración con Spring Boot.
 */

window.app = window.app || {};

// Objeto Principal del Módulo
window.app.bancoCelulas = {

    // --- 1. CARGA DE DEPENDENCIAS ---
    init: function() {
        console.log('Inicializando Banco de Células (MVC Pattern)...');
        
        // Cargar Scripts de Servicio y Vista dinámicamente
        // Esto evita tener que editar index.html manualmente
        this.loadScript('modules/banco-celulas/services.js')
            .then(() => this.loadScript('modules/banco-celulas/views.js'))
            .then(() => {
                this.startApp();
            })
            .catch(err => console.error('Error cargando dependencias del módulo:', err));
    },

    loadScript: function(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve(); // Ya existe
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    // --- 2. ARRANQUE DE LA APLICACIÓN ---
    startApp: async function() {
        const container = document.getElementById('view-module');
        
        // Generar Menú Lateral
        const menuItems = [
            { id: 'dashboard', icon: 'dashboard', label: 'Panel de Control' },
            { id: 'recepcion', icon: 'input', label: 'Recepción (LC-17)' },
            { id: 'cultivos', icon: 'microbiology', label: 'Cultivos Activos' },
            { id: 'incubadoras', icon: 'kitchen', label: 'Incubadoras' },
            { id: 'criobanco', icon: 'ac_unit', label: 'Criobanco (LC-22)' }
        ];
        
        const menuHtml = menuItems.map(item => 
            window.app.views.bancoCelulas.components.navBtn(item.id, item.icon, item.label)
        ).join('');

        // Renderizar Layout Base
        container.innerHTML = window.app.views.bancoCelulas.layout(menuHtml);

        // Navegar al Dashboard por defecto
        this.navigateTo('dashboard');
    },

    // --- 3. NAVEGACIÓN Y LÓGICA ---
    navigateTo: async function(viewId) {
        const main = document.getElementById('bc-main-content');
        this.updateActiveMenu(viewId);

        // Renderizado Dinámico
        switch(viewId) {
            case 'dashboard':
                // 1. Obtener Datos (Simulación Backend)
                const stats = await window.app.services.bancoCelulas.getDashboardStats();
                const alerts = await window.app.services.bancoCelulas.getAlerts();
                const alertsHtml = alerts.map(a => window.app.views.bancoCelulas.components.alertRow(a)).join('');
                
                // 2. Renderizar Vista con Datos
                main.innerHTML = window.app.views.bancoCelulas.dashboard(stats, alertsHtml);
                break;

            case 'recepcion':
                // Aquí cargaremos la vista de Recepción en el siguiente paso
                main.innerHTML = `<div class="p-10 text-center"><h2 class="text-xl font-bold">Módulo Recepción</h2><p>Cargando formulario FO-LC-17...</p></div>`;
                break;
                
            default:
                main.innerHTML = `<div class="p-10 text-center">Vista [${viewId}] en construcción modular.</div>`;
        }
    },

    updateActiveMenu: function(activeId) {
        document.querySelectorAll('aside nav button').forEach(btn => {
            // Resetear estilos
            btn.className = 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full text-left group text-slate-500 hover:bg-slate-50 hover:text-xelle-navy';
            const icon = btn.querySelector('span');
            if(icon) icon.className = 'material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform text-slate-400';
        });

        // Activar botón actual
        const activeBtn = document.getElementById(`nav-btn-${activeId}`);
        if(activeBtn) {
            activeBtn.className = 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full text-left group bg-xelle-navy text-white shadow-md shadow-xelle-navy/30';
            const icon = activeBtn.querySelector('span');
            if(icon) icon.className = 'material-symbols-outlined text-[20px] text-primary';
        }
    }
};