// frontend/modules/sgc/sgc.js

/**
 * Módulo: Biblioteca SGC (Sistema de Gestión de Calidad)
 * Funcionalidad: Visualización y búsqueda de documentos controlados vigentes.
 */

window.app = window.app || {};

window.app.sgc = {

    state: {
        searchTerm: '',
        filterArea: 'TODOS'
    },

    init: function() {
        console.log('Inicializando Biblioteca SGC...');
        const container = document.getElementById('view-module');

        container.innerHTML = `
            <div class="flex flex-col gap-6 animate-fade-in pb-12">
                
                <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <h2 class="text-3xl font-black text-xelle-navy tracking-tight">Biblioteca Digital SGC</h2>
                        <p class="text-slate-500 text-sm mt-1">Acceso a documentos normativos, procedimientos y manuales vigentes.</p>
                    </div>
                    <div class="flex items-center gap-2">
                         <span class="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm">verified</span>
                            Control Documental Activo
                        </span>
                    </div>
                </div>

                <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    
                    <div class="relative w-full md:w-96">
                        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input type="text" placeholder="Buscar documento (Código, Título)..." 
                            onkeyup="window.app.sgc.search(this.value)"
                            class="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-xelle-navy text-sm font-semibold outline-none transition-all">
                    </div>

                    <div class="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        <button onclick="window.app.sgc.filter('TODOS')" id="filter-sgc-TODOS" class="sgc-filter-btn px-4 py-2 rounded-lg text-xs font-bold bg-xelle-navy text-white shadow-md transition-all">TODOS</button>
                        <button onclick="window.app.sgc.filter('Laboratorio')" id="filter-sgc-Laboratorio" class="sgc-filter-btn px-4 py-2 rounded-lg text-xs font-bold bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all">LABORATORIO</button>
                        <button onclick="window.app.sgc.filter('Calidad')" id="filter-sgc-Calidad" class="sgc-filter-btn px-4 py-2 rounded-lg text-xs font-bold bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all">CALIDAD</button>
                        <button onclick="window.app.sgc.filter('Almacén')" id="filter-sgc-Almacén" class="sgc-filter-btn px-4 py-2 rounded-lg text-xs font-bold bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all">ALMACÉN</button>
                    </div>
                </div>

                <div id="sgc-docs-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    </div>

            </div>
        `;

        this.renderDocuments();
    },

    search: function(val) {
        this.state.searchTerm = val.toLowerCase();
        this.renderDocuments();
    },

    filter: function(area) {
        this.state.filterArea = area;
        
        // Actualizar UI botones
        document.querySelectorAll('.sgc-filter-btn').forEach(btn => {
            btn.className = 'sgc-filter-btn px-4 py-2 rounded-lg text-xs font-bold bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all';
        });
        document.getElementById(`filter-sgc-${area}`).className = 'sgc-filter-btn px-4 py-2 rounded-lg text-xs font-bold bg-xelle-navy text-white shadow-md transition-all';

        this.renderDocuments();
    },

    renderDocuments: function() {
        const container = document.getElementById('sgc-docs-grid');
        const term = this.state.searchTerm;
        const areaFilter = this.state.filterArea;

        // Obtener datos globales (cargados en main o configuracion)
        // Aseguramos que existan, si no, usamos vacíos
        const allDocs = window.SeedData.formats || [];

        // Filtramos: Solo VIGENTES + Búsqueda + Área
        const filtered = allDocs.filter(d => {
            // Solo mostrar documentos vigentes en la biblioteca pública
            // Si quieres mostrar todos, quita la condición de status
            const isVigente = d.status === 'Vigente'; 
            
            const matchSearch = d.title.toLowerCase().includes(term) || d.code.toLowerCase().includes(term);
            const matchArea = areaFilter === 'TODOS' || d.area === areaFilter;

            return isVigente && matchSearch && matchArea;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center p-12 text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
                    <span class="material-symbols-outlined text-4xl mb-2">folder_off</span>
                    <p class="text-sm font-bold">No se encontraron documentos vigentes con estos criterios.</p>
                </div>
            `;
            return;
        }

        let html = '';
        filtered.forEach(doc => {
            // Icono según tipo de documento (inferido por código o simple default)
            let icon = 'description';
            let colorClass = 'text-primary';
            let bgClass = 'bg-primary/5';

            if (doc.code.startsWith('SOP')) { icon = 'list_alt'; colorClass = 'text-blue-600'; bgClass = 'bg-blue-50'; }
            if (doc.code.startsWith('MAN')) { icon = 'menu_book'; colorClass = 'text-purple-600'; bgClass = 'bg-purple-50'; }

            html += `
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer" onclick="window.app.sgc.openDocument('${doc.code}')">
                    <div class="flex justify-between items-start mb-4">
                        <div class="w-12 h-12 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span class="material-symbols-outlined text-2xl">${icon}</span>
                        </div>
                        <span class="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wide">${doc.area || 'General'}</span>
                    </div>
                    
                    <h3 class="text-lg font-bold text-xelle-navy leading-tight mb-2 group-hover:text-primary transition-colors">${doc.title}</h3>
                    
                    <div class="flex items-center gap-3 text-xs text-slate-400 font-mono border-t border-slate-50 pt-3 mt-3">
                        <span class="font-bold text-slate-500">${doc.code}</span>
                        <span>•</span>
                        <span>Ver. ${doc.version}</span>
                        <span class="ml-auto flex items-center gap-1 text-emerald-600 font-bold">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Vigente
                        </span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    openDocument: function(code) {
        // Simulación de apertura de PDF
        alert(`Abriendo visor de documentos para: ${code}\n\n(Aquí se cargaría el PDF generado o subido)`);
    }
};