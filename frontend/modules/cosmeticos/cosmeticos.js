// Módulo de Productos Cosméticos para XelleSystem
// Versión 2.0 - Con sistema de inventarios y producción

const CosmeticosModule = {
    // Configuración interna del módulo
    config: {
        name: 'Productos Cosméticos',
        id: 'cosmeticos',
        themeColor: '#E91E63', // Color distintivo (Rosa oscuro/Magenta)
        description: 'Gestión de fórmulas, producción y control de calidad cosmética.'
    },

    // Datos de inventario (almacenados localmente)
    inventario: {
        materiasPrimas: JSON.parse(localStorage.getItem('cosmeticos_materias_primas')) || [
            { id: 1, nombre: 'Agua Destilada', unidad: 'L', stock: 50, minimo: 10, precio: 2.5 },
            { id: 2, nombre: 'Glicerina', unidad: 'kg', stock: 15, minimo: 5, precio: 8.0 },
            { id: 3, nombre: 'Aceite de Coco', unidad: 'kg', stock: 8, minimo: 3, precio: 12.0 },
            { id: 4, nombre: 'Vitamina E', unidad: 'kg', stock: 2, minimo: 1, precio: 35.0 },
            { id: 5, nombre: 'Conservante Natural', unidad: 'kg', stock: 3, minimo: 2, precio: 20.0 }
        ],
        produccion: JSON.parse(localStorage.getItem('cosmeticos_produccion')) || [],
        salidas: JSON.parse(localStorage.getItem('cosmeticos_salidas')) || [],
        formulas: JSON.parse(localStorage.getItem('cosmeticos_formulas')) || [
            {
                id: 1,
                nombre: 'Crema Hidratante Base',
                descripcion: 'Fórmula de crema multiusos con activos naturales',
                ingredientes: [
                    { nombre: 'Agua Destilada', porcentaje: 60 },
                    { nombre: 'Glicerina', porcentaje: 15 },
                    { nombre: 'Aceite de Coco', porcentaje: 20 },
                    { nombre: 'Vitamina E', porcentaje: 5 }
                ]
            },
            {
                id: 2,
                nombre: 'Sérum Antioxidante',
                descripcion: 'Sérum concentrado con vitaminas',
                ingredientes: [
                    { nombre: 'Agua Destilada', porcentaje: 50 },
                    { nombre: 'Vitamina E', porcentaje: 30 },
                    { nombre: 'Conservante Natural', porcentaje: 20 }
                ]
            }
        ],
        logs: JSON.parse(localStorage.getItem('cosmeticos_logs')) || []
    },

    // Función de inicialización estándar
    init: function() {
        console.log('Inicializando módulo: ' + this.config.name);
        this.renderDashboard();
    },

    // Renderiza el panel principal del módulo
    renderDashboard: function() {
        const contentArea = document.getElementById('view-module');
        if (!contentArea) return;

        const html = `
            <div class="module-header fade-in" style="border-left: 5px solid ${this.config.themeColor}; padding-left: 15px; margin-bottom: 20px;">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">${this.config.name}</h2>
                        <p class="text-gray-500 text-sm">${this.config.description}</p>
                    </div>
                    <button onclick="document.getElementById('view-dashboard').classList.remove('hidden'); document.getElementById('view-module').classList.add('hidden');" 
                            class="bg-slate-100 hover:bg-slate-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                        ← Volver
                    </button>
                </div>
            </div>

            <div class="tabs-container mb-6">
                <div class="flex gap-2 border-b border-gray-200 overflow-x-auto">
                    <button onclick="CosmeticosModule.switchTab('inventario')" class="tab-button active px-6 py-3 font-semibold text-gray-700 border-b-2 border-pink-500 whitespace-nowrap" style="border-color: ${this.config.themeColor};">
                        📦 Inventario MP
                    </button>
                    <button onclick="CosmeticosModule.switchTab('salidas')" class="tab-button px-6 py-3 font-semibold text-gray-700 hover:text-gray-900 whitespace-nowrap">
                        ↗️ Salidas
                    </button>
                    <button onclick="CosmeticosModule.switchTab('produccion')" class="tab-button px-6 py-3 font-semibold text-gray-700 hover:text-gray-900 whitespace-nowrap">
                        🏭 Producción
                    </button>
                    <button onclick="CosmeticosModule.switchTab('formulas')" class="tab-button px-6 py-3 font-semibold text-gray-700 hover:text-gray-900 whitespace-nowrap">
                        🧪 Fórmulas
                    </button>
                    <button onclick="CosmeticosModule.switchTab('historial')" class="tab-button px-6 py-3 font-semibold text-gray-700 hover:text-gray-900 whitespace-nowrap">
                        📋 Historial
                    </button>
                </div>
            </div>

            <div id="tab-inventario" class="tab-content">
                ${this.renderInventario()}
            </div>

            <div id="tab-salidas" class="tab-content hidden">
                ${this.renderSalidas()}
            </div>

            <div id="tab-produccion" class="tab-content hidden">
                ${this.renderProduccion()}
            </div>

            <div id="tab-formulas" class="tab-content hidden">
                ${this.renderFormulas()}
            </div>

            <div id="tab-historial" class="tab-content hidden">
                ${this.renderHistorial()}
            </div>
        `;

        contentArea.innerHTML = html;
        this.setupEventListeners();
    },

    // Tab de Inventario de Materias Primas
    renderInventario: function() {
        const materias = this.inventario.materiasPrimas;
        const totalValor = materias.reduce((sum, m) => sum + (m.stock * m.precio), 0);
        
        return `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                        <h4 class="text-gray-700 font-semibold text-sm">Total Materias Primas</h4>
                        <p class="text-3xl font-bold text-blue-600">${materias.length}</p>
                    </div>
                    <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                        <h4 class="text-gray-700 font-semibold text-sm">Valor Total Stock</h4>
                        <p class="text-3xl font-bold text-green-600">$${totalValor.toFixed(2)}</p>
                    </div>
                    <div class="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
                        <h4 class="text-gray-700 font-semibold text-sm">Bajo Stock</h4>
                        <p class="text-3xl font-bold text-red-600">${materias.filter(m => m.stock <= m.minimo).length}</p>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-bold text-gray-800">Materias Primas</h3>
                        <button onclick="CosmeticosModule.showAgregarMateria()" class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors">
                            + Agregar Materia Prima
                        </button>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock Actual</th>
                                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock Mínimo</th>
                                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio Unitario</th>
                                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Valor Total</th>
                                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                                    <th class="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${materias.map(materia => {
                                    const estado = materia.stock > materia.minimo ? 
                                        '<span class="bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-semibold">Disponible</span>' :
                                        '<span class="bg-red-100 text-red-800 px-3 py-1 rounded text-xs font-semibold">⚠️ Bajo Stock</span>';
                                    return `
                                        <tr class="border-b hover:bg-gray-50">
                                            <td class="px-6 py-4 text-sm text-gray-700">${materia.nombre}</td>
                                            <td class="px-6 py-4 text-sm font-semibold">${materia.stock} ${materia.unidad}</td>
                                            <td class="px-6 py-4 text-sm text-gray-600">${materia.minimo} ${materia.unidad}</td>
                                            <td class="px-6 py-4 text-sm">$${materia.precio.toFixed(2)}</td>
                                            <td class="px-6 py-4 text-sm font-semibold text-green-600">$${(materia.stock * materia.precio).toFixed(2)}</td>
                                            <td class="px-6 py-4">${estado}</td>
                                            <td class="px-6 py-4 text-center space-x-2">
                                                <button onclick="CosmeticosModule.editarMateria(${materia.id})" class="text-blue-600 hover:text-blue-800 text-sm font-semibold">✏️</button>
                                                <button onclick="CosmeticosModule.eliminarMateria(${materia.id})" class="text-red-600 hover:text-red-800 text-sm font-semibold">🗑️</button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    // Tab de Salidas
    renderSalidas: function() {
        const salidas = this.inventario.salidas;
        const totalSalidas = salidas.reduce((sum, s) => sum + s.cantidad, 0);
        
        return `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
                        <h4 class="text-gray-700 font-semibold text-sm">Salidas Registradas</h4>
                        <p class="text-3xl font-bold text-orange-600">${salidas.length}</p>
                    </div>
                    <div class="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg">
                        <h4 class="text-gray-700 font-semibold text-sm">Total Descargado</h4>
                        <p class="text-3xl font-bold text-red-600">${totalSalidas} kg</p>
                    </div>
                    <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg">
                        <h4 class="text-gray-700 font-semibold text-sm">Últimas 7 Días</h4>
                        <p class="text-3xl font-bold text-yellow-600">${salidas.filter(s => {
                            const fecha = new Date(s.fecha);
                            const hace7dias = new Date();
                            hace7dias.setDate(hace7dias.getDate() - 7);
                            return fecha >= hace7dias;
                        }).length}</p>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-bold text-gray-800">Registro de Salidas</h3>
                        <button onclick="CosmeticosModule.mostrarModalSalida()" class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors">
                            ↗️ Registrar Salida
                        </button>
                    </div>

                    ${salidas.length === 0 ? 
                        `<p class="text-center text-gray-500 py-8">No hay registros de salidas</p>` :
                        `<div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-gray-100">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Materia Prima</th>
                                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cantidad</th>
                                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Responsable</th>
                                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Motivo</th>
                                        <th class="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${salidas.map((salida, idx) => `
                                        <tr class="border-b hover:bg-gray-50">
                                            <td class="px-6 py-4 text-sm text-gray-700">${salida.fecha}</td>
                                            <td class="px-6 py-4 text-sm font-semibold">${salida.materia}</td>
                                            <td class="px-6 py-4 text-sm text-red-600 font-bold">-${salida.cantidad}</td>
                                            <td class="px-6 py-4 text-sm text-gray-600">${salida.responsable}</td>
                                            <td class="px-6 py-4 text-sm text-gray-600">${salida.motivo}</td>
                                            <td class="px-6 py-4 text-center">
                                                <button onclick="CosmeticosModule.eliminarSalida(${idx})" class="text-red-600 hover:text-red-800 text-sm font-semibold">🗑️</button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>`
                    }
                </div>
            </div>
        `;
    },

    // Tab de Producción
    renderProduccion: function() {
        const produccion = this.inventario.produccion;
        const totalProducido = produccion.reduce((sum, p) => sum + p.cantidad, 0);
        
        return `
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                        <h4 class="text-gray-700 font-semibold text-sm">Lotes Registrados</h4>
                        <p class="text-3xl font-bold text-purple-600">${produccion.length}</p>
                    </div>
                    <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg">
                        <h4 class="text-gray-700 font-semibold text-sm">Total Producido</h4>
                        <p class="text-3xl font-bold text-indigo-600">${totalProducido} kg</p>
                    </div>
                    <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
                        <h4 class="text-gray-700 font-semibold text-sm">En Proceso</h4>
                        <p class="text-3xl font-bold text-orange-600">${produccion.filter(p => p.estado === 'Proceso').length}</p>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-bold text-gray-800">Registro de Producción</h3>
                        <button onclick="CosmeticosModule.showRegistrarProduccion()" class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors">
                            + Registrar Lote
                        </button>
                    </div>

                    ${produccion.length === 0 ? 
                        `<p class="text-center text-gray-500 py-8">No hay registros de producción. ¡Comienza a registrar!</p>` :
                        `<div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-gray-100">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Lote</th>
                                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Producto</th>
                                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cantidad</th>
                                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                                        <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                                        <th class="px-6 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${produccion.map((lote, idx) => {
                                        const estadoColor = lote.estado === 'Completado' ? 'bg-green-100 text-green-800' : 
                                                           lote.estado === 'Proceso' ? 'bg-yellow-100 text-yellow-800' : 
                                                           'bg-gray-100 text-gray-800';
                                        return `
                                            <tr class="border-b hover:bg-gray-50">
                                                <td class="px-6 py-4 text-sm font-semibold text-gray-700">LOT-${String(idx + 1).padStart(4, '0')}</td>
                                                <td class="px-6 py-4 text-sm text-gray-700">${lote.producto}</td>
                                                <td class="px-6 py-4 text-sm font-semibold">${lote.cantidad} kg</td>
                                                <td class="px-6 py-4 text-sm text-gray-600">${lote.fecha}</td>
                                                <td class="px-6 py-4"><span class="px-3 py-1 rounded text-xs font-semibold ${estadoColor}">${lote.estado}</span></td>
                                                <td class="px-6 py-4 text-center">
                                                    <button onclick="CosmeticosModule.editarProduccion(${idx})" class="text-blue-600 hover:text-blue-800 text-sm font-semibold mr-3">✏️</button>
                                                    <button onclick="CosmeticosModule.eliminarProduccion(${idx})" class="text-red-600 hover:text-red-800 text-sm font-semibold">🗑️</button>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>`
                    }
                </div>
            </div>
        `;
    },

    // Tab de Historial/Logs
    renderHistorial: function() {
        const logs = this.inventario.logs;
        
        return `
            <div class="space-y-6">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800">📋 Historial de Movimientos</h3>
                            <p class="text-sm text-gray-600 mt-1">Total de registros: <span class="font-bold">${logs.length}</span></p>
                        </div>
                        <button onclick="CosmeticosModule.limpiarHistorial()" class="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">🗑️ Limpiar</button>
                    </div>

                    ${logs.length === 0 ? 
                        `<p class="text-center text-gray-500 py-12">📭 No hay registros en el historial</p>` :
                        `<div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-gray-100 sticky top-0">
                                    <tr>
                                        <th class="px-4 py-3 text-left font-semibold text-gray-700">Fecha/Hora</th>
                                        <th class="px-4 py-3 text-left font-semibold text-gray-700">Tipo</th>
                                        <th class="px-4 py-3 text-left font-semibold text-gray-700">Descripción</th>
                                        <th class="px-4 py-3 text-left font-semibold text-gray-700">Detalles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${logs.slice().reverse().map(log => {
                                        const tipoColor = 
                                            log.tipo === 'AGREGAR' ? 'bg-green-50' :
                                            log.tipo === 'ELIMINAR' ? 'bg-red-50' :
                                            log.tipo === 'EDITAR' ? 'bg-blue-50' :
                                            log.tipo === 'PRODUCIR' ? 'bg-purple-50' :
                                            log.tipo === 'AGREGAR_FORMULA' ? 'bg-yellow-50' :
                                            'bg-gray-50';
                                        
                                        const tipoIcon = 
                                            log.tipo === 'AGREGAR' ? '➕' :
                                            log.tipo === 'ELIMINAR' ? '➖' :
                                            log.tipo === 'EDITAR' ? '✏️' :
                                            log.tipo === 'PRODUCIR' ? '🏭' :
                                            log.tipo === 'AGREGAR_FORMULA' ? '🧪' :
                                            '📝';
                                        
                                        return `
                                            <tr class="border-b hover:bg-gray-50 ${tipoColor}">
                                                <td class="px-4 py-3 text-xs font-mono text-gray-600">${log.fecha}</td>
                                                <td class="px-4 py-3"><span class="text-lg">${tipoIcon} ${log.tipo}</span></td>
                                                <td class="px-4 py-3 font-semibold text-gray-800">${log.descripcion}</td>
                                                <td class="px-4 py-3 text-gray-600 text-xs">${log.detalles}</td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>`
                    }
                </div>
            </div>
        `;
    },

    // Tab de Fórmulas
    renderFormulas: function() {
        const formulas = this.inventario.formulas;
        return `
            <div class="space-y-6">
                <div class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-bold text-gray-800">Fórmulas Cosméticas (${formulas.length})</h3>
                        <button onclick="CosmeticosModule.showCrearFormula()" class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors">
                            + Nueva Fórmula
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${formulas.map(f => `
                            <div class="border-l-4 border-pink-500 pl-6 py-4 bg-pink-50 rounded">
                                <h4 class="font-bold text-gray-800 mb-2">${f.nombre}</h4>
                                <p class="text-sm text-gray-600 mb-3">${f.descripcion}</p>
                                <div class="space-y-1 text-xs text-gray-700">
                                    ${f.ingredientes.map(i => `<p>• ${i.nombre}: ${i.porcentaje}%</p>`).join('')}
                                </div>
                                <button onclick="CosmeticosModule.mostrarModalProducirFormula(${f.id})" class="mt-4 text-pink-600 hover:text-pink-800 text-sm font-semibold">🏭 Producir →</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    // Cambiar de tab
    switchTab: function(tabName) {
        // Ocultar todos los tabs
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        
        // Mostrar el tab seleccionado
        document.getElementById('tab-' + tabName).classList.remove('hidden');
        event.target.classList.add('active');
    },

    // Agregar Materia Prima
    showAgregarMateria: function() {
        this.currentModalMode = 'agregar';
        this.mostrarModalMateria();
    },

    // Editar Materia Prima
    editarMateria: function(id) {
        const materia = this.inventario.materiasPrimas.find(m => m.id === id);
        if (!materia) return;
        this.materiaEditando = materia;
        this.currentModalMode = 'editar';
        this.mostrarModalMateria();
    },

    // Modal para Agregar/Editar Materia Prima
    mostrarModalMateria: function() {
        const isEditar = this.currentModalMode === 'editar';
        const materia = this.materiaEditando || { nombre: '', unidad: '', stock: 0, minimo: 0, precio: 0 };
        
        const html = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="modalOverlay">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-scale-in">
                    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800">${isEditar ? '✏️ Modificar Materia Prima' : '📦 Agregar Nueva Materia Prima'}</h3>
                            <p class="text-xs text-gray-500 mt-1">${isEditar ? 'Actualiza los datos' : 'Ingresa los datos de la nueva materia prima'}</p>
                        </div>
                        <button onclick="CosmeticosModule.cerrarModal()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                    </div>
                    
                    <div class="px-6 py-6 space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre de Materia Prima</label>
                            <input type="text" id="mp-nombre" value="${materia.nombre}" placeholder="Ej: Agua Destilada" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Unidad</label>
                                <input type="text" id="mp-unidad" value="${materia.unidad}" placeholder="L, kg, mg, etc" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Stock Inicial</label>
                                <input type="number" id="mp-stock" value="${materia.stock}" placeholder="0" step="0.1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Stock Mínimo</label>
                                <input type="number" id="mp-minimo" value="${materia.minimo}" placeholder="0" step="0.1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Precio Unitario ($)</label>
                                <input type="number" id="mp-precio" value="${materia.precio}" placeholder="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                            </div>
                        </div>
                    </div>
                    
                    <div class="px-6 py-4 border-t border-gray-200 flex gap-3">
                        <button onclick="CosmeticosModule.cerrarModal()" class="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors">Cancelar</button>
                        <button onclick="CosmeticosModule.guardarMateria()" class="flex-1 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-colors">Guardar</button>
                    </div>
                </div>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.innerHTML = html;
        document.body.appendChild(overlay.firstElementChild);
    },

    // Guardar Materia Prima
    guardarMateria: function() {
        const nombre = document.getElementById('mp-nombre').value.trim();
        const unidad = document.getElementById('mp-unidad').value.trim();
        const stock = parseFloat(document.getElementById('mp-stock').value) || 0;
        const minimo = parseFloat(document.getElementById('mp-minimo').value) || 0;
        const precio = parseFloat(document.getElementById('mp-precio').value) || 0;

        if (!nombre || !unidad) {
            alert('Por favor completa los campos requeridos');
            return;
        }

        if (this.currentModalMode === 'agregar') {
            const nuevoId = Math.max(...this.inventario.materiasPrimas.map(m => m.id || 0), 0) + 1;
            this.inventario.materiasPrimas.push({ id: nuevoId, nombre, unidad, stock, minimo, precio });
            this.registrarLog('AGREGAR', 'Materia Prima: ' + nombre, 'Unidad: ' + unidad + ', Stock: ' + stock + ', Mínimo: ' + minimo + ', Precio: $' + precio);
        } else {
            const stockAnterior = this.materiaEditando.stock;
            const cambioStock = stock - stockAnterior;
            this.materiaEditando.nombre = nombre;
            this.materiaEditando.unidad = unidad;
            this.materiaEditando.stock = stock;
            this.materiaEditando.minimo = minimo;
            this.materiaEditando.precio = precio;
            this.registrarLog('EDITAR', 'Materia Prima: ' + nombre, 'Stock anterior: ' + stockAnterior + ', Nuevo stock: ' + stock + ' (' + (cambioStock > 0 ? '+' : '') + cambioStock + ')');
            this.materiaEditando = null;
        }

        this.guardarInventario();
        this.cerrarModal();
        this.renderDashboard();
    },

    // Registrar Producción
    showRegistrarProduccion: function() {
        this.currentModalMode = 'agregar';
        this.mostrarModalProduccion();
    },

    // Editar Producción
    editarProduccion: function(idx) {
        this.loteEditando = { idx: idx, lote: this.inventario.produccion[idx] };
        this.currentModalMode = 'editar';
        this.mostrarModalProduccion();
    },

    // Eliminar Orden de Producción (Reversión)
    eliminarProduccion: function(idx) {
        const lote = this.inventario.produccion[idx];
        if (!lote) return;

        if (confirm('¿Deshacer orden de producción de ' + lote.cantidad + 'kg de ' + lote.producto + '?\n\nSe repondrán los materientes usados.')) {
            // Si fue desde fórmula, reponer ingredientes
            if (lote.formulaId) {
                const formula = this.inventario.formulas.find(f => f.id === lote.formulaId);
                if (formula) {
                    formula.ingredientes.forEach(ingrediente => {
                        const materia = this.inventario.materiasPrimas.find(m => m.nombre === ingrediente.nombre);
                        if (materia) {
                            const requerido = (ingrediente.porcentaje / 100) * lote.cantidad;
                            materia.stock += requerido;
                        }
                    });
                }
            }

            // Eliminar registro
            this.inventario.produccion.splice(idx, 1);
            this.registrarLog('REVERTIR_PRODUCCION', 'Producción cancelada: ' + lote.producto, 'Cantidad: ' + lote.cantidad + 'kg, Materiales repuestos');
            this.guardarInventario();
            this.renderDashboard();
            this.switchTab('produccion');
            alert('✅ Orden de producción cancelada y materiales repuestos');
        }
    },

    // Modal para Registrar/Editar Producción
    mostrarModalProduccion: function() {
        const isEditar = this.currentModalMode === 'editar';
        const lote = isEditar ? this.loteEditando.lote : { producto: '', cantidad: 0, estado: 'Proceso', fecha: new Date().toISOString().split('T')[0] };
        const estados = ['Proceso', 'Completado', 'Rechazado'];

        const html = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="modalOverlay">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-scale-in">
                    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800">${isEditar ? '✏️ Actualizar Lote' : '🏭 Registrar Nuevo Lote'}</h3>
                            <p class="text-xs text-gray-500 mt-1">${isEditar ? 'Modifica el estado' : 'Registra un nuevo lote de producción'}</p>
                        </div>
                        <button onclick="CosmeticosModule.cerrarModal()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                    </div>
                    
                    <div class="px-6 py-6 space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre del Producto</label>
                            <input type="text" id="prod-nombre" value="${lote.producto}" placeholder="Ej: Crema Hidratante" ${isEditar ? 'disabled' : ''} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Cantidad (kg)</label>
                                <input type="number" id="prod-cantidad" value="${lote.cantidad}" placeholder="0" step="0.1" ${isEditar ? 'disabled' : ''} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
                                <input type="date" id="prod-fecha" value="${lote.fecha}" ${isEditar ? 'disabled' : ''} class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                            <select id="prod-estado" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                                ${estados.map(e => `<option value="${e}" ${e === lote.estado ? 'selected' : ''}>${e}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="px-6 py-4 border-t border-gray-200 flex gap-3">
                        <button onclick="CosmeticosModule.cerrarModal()" class="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors">Cancelar</button>
                        <button onclick="CosmeticosModule.guardarProduccion()" class="flex-1 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-colors">Guardar</button>
                    </div>
                </div>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.innerHTML = html;
        document.body.appendChild(overlay.firstElementChild);
    },

    // Guardar Producción
    guardarProduccion: function() {
        const isEditar = this.currentModalMode === 'editar';
        const producto = document.getElementById('prod-nombre').value.trim();
        const cantidad = parseFloat(document.getElementById('prod-cantidad').value) || 0;
        const fecha = document.getElementById('prod-fecha').value;
        const estado = document.getElementById('prod-estado').value;

        if (isEditar) {
            const estadoAnterior = this.loteEditando.lote.estado;
            this.loteEditando.lote.estado = estado;
            this.registrarLog('EDITAR', 'Producción: ' + producto, 'Estado: ' + estadoAnterior + ' -> ' + estado);
        } else {
            if (!producto || !cantidad) {
                alert('Por favor completa los campos requeridos');
                return;
            }
            this.inventario.produccion.push({ producto, cantidad, estado, fecha });
            this.registrarLog('AGREGAR', 'Lote de Producción: ' + producto, 'Cantidad: ' + cantidad + 'kg, Estado: ' + estado + ', Fecha: ' + fecha);
        }

        this.guardarInventario();
        this.cerrarModal();
        this.renderDashboard();
    },

    // Crear Fórmula (Modal)
    showCrearFormula: function() {
        this.currentModalMode = 'agregar';
        this.mostrarModalFormula();
    },

    // Modal para Crear Fórmula
    mostrarModalFormula: function() {
        const html = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="modalOverlay">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 animate-scale-in">
                    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800">🧪 Nueva Fórmula Cosmética</h3>
                            <p class="text-xs text-gray-500 mt-1">Crea una nueva fórmula con los ingredientes disponibles</p>
                        </div>
                        <button onclick="CosmeticosModule.cerrarModal()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                    </div>
                    
                    <div class="px-6 py-6 space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre de la Fórmula</label>
                            <input type="text" id="form-nombre" placeholder="Ej: Crema Anti-Envejecimiento" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                            <textarea id="form-descripcion" placeholder="Describe los beneficios..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent" rows="3"></textarea>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-3">Ingredientes (5 máximo)</label>
                            <div id="ingredientes-container" class="space-y-3">
                                <div class="flex gap-3 items-end">
                                    <select class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                                        <option>Seleccionar ingrediente...</option>
                                        ${this.inventario.materiasPrimas.map(m => `<option value="${m.nombre}">${m.nombre}</option>`).join('')}
                                    </select>
                                    <input type="number" placeholder="%" min="1" max="100" step="1" class="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                                </div>
                            </div>
                            <button onclick="CosmeticosModule.agregarIngrediente()" class="mt-3 text-sm text-pink-600 hover:text-pink-800 font-semibold">+ Agregar ingrediente</button>
                        </div>
                    </div>
                    
                    <div class="px-6 py-4 border-t border-gray-200 flex gap-3">
                        <button onclick="CosmeticosModule.cerrarModal()" class="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors">Cancelar</button>
                        <button onclick="CosmeticosModule.guardarFormula()" class="flex-1 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-colors">Crear Fórmula</button>
                    </div>
                </div>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.innerHTML = html;
        document.body.appendChild(overlay.firstElementChild);
    },

    // Modal para Registrar Salida
    mostrarModalSalida: function() {
        const html = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="modalOverlay">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-scale-in">
                    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800">↗️ Registrar Salida</h3>
                            <p class="text-xs text-gray-500 mt-1">Ingresa datos de la salida de materia prima</p>
                        </div>
                        <button onclick="CosmeticosModule.cerrarModal()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                    </div>
                    
                    <div class="px-6 py-6 space-y-4">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Materia Prima</label>
                            <select id="salida-materia" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                                <option>Seleccionar...</option>
                                ${this.inventario.materiasPrimas.map(m => `<option>${m.nombre}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Cantidad a Descargar</label>
                            <input type="number" id="salida-cantidad" placeholder="0" step="0.1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Motivo</label>
                            <select id="salida-motivo" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                                <option>Descargo a producción</option>
                                <option>Devolución a proveedor</option>
                                <option>Pérdida/Daño</option>
                                <option>Ajuste de inventario</option>
                                <option>Otro</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Responsable</label>
                            <input type="text" id="salida-responsable" placeholder="Tu nombre" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Fecha</label>
                            <input type="date" id="salida-fecha" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        </div>
                    </div>
                    
                    <div class="px-6 py-4 border-t border-gray-200 flex gap-3">
                        <button onclick="CosmeticosModule.cerrarModal()" class="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors">Cancelar</button>
                        <button onclick="CosmeticosModule.guardarSalida()" class="flex-1 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-colors">Guardar</button>
                    </div>
                </div>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.innerHTML = html;
        document.body.appendChild(overlay.firstElementChild);
        
        // Precargar fecha de hoy
        const hoy = new Date().toISOString().split('T')[0];
        const fechaInput = document.getElementById('salida-fecha');
        if (fechaInput) fechaInput.value = hoy;
    },

    // Guardar Salida
    guardarSalida: function() {
        const materia = document.getElementById('salida-materia').value;
        const cantidad = parseFloat(document.getElementById('salida-cantidad').value) || 0;
        const motivo = document.getElementById('salida-motivo').value;
        const responsable = document.getElementById('salida-responsable').value.trim();
        const fecha = document.getElementById('salida-fecha').value;

        if (!materia || materia === 'Seleccionar...' || !cantidad || !responsable) {
            alert('Por favor completa todos los campos');
            return;
        }

        // Validar que existe la materia prima
        const mp = this.inventario.materiasPrimas.find(m => m.nombre === materia);
        if (!mp) {
            alert('Materia prima no encontrada');
            return;
        }

        // Validar cantidad disponible
        if (mp.stock < cantidad) {
            alert('Cantidad insuficiente. Stock disponible: ' + mp.stock);
            return;
        }

        // Descontar del stock
        mp.stock -= cantidad;

        // Registrar salida
        this.inventario.salidas.push({
            fecha: fecha,
            materia: materia,
            cantidad: cantidad,
            motivo: motivo,
            responsable: responsable
        });

        this.registrarLog('SALIDA', 'Salida de: ' + materia, 'Cantidad: ' + cantidad + ', Motivo: ' + motivo + ', Responsable: ' + responsable);
        this.guardarInventario();
        this.cerrarModal();
        this.renderDashboard();
        this.switchTab('salidas');
        alert('✅ Salida registrada exitosamente');
    },

    // Eliminar Salida
    eliminarSalida: function(idx) {
        const salida = this.inventario.salidas[idx];
        if (!salida) return;

        if (confirm('¿Deshacer salida de ' + salida.cantidad + ' ' + salida.materia + '?\n\nEl stock será repuesto.')) {
            // Reponer stocks
            const mp = this.inventario.materiasPrimas.find(m => m.nombre === salida.materia);
            if (mp) {
                mp.stock += salida.cantidad;
            }

            // Eliminar salida
            this.inventario.salidas.splice(idx, 1);
            this.registrarLog('ELIMINAR_SALIDA', 'Salida deshecha: ' + salida.materia, 'Cantidad repuesta: ' + salida.cantidad);
            this.guardarInventario();
            this.renderDashboard();
            alert('✅ Salida deshecha y stock repuesto');
        }
    },

    // Agregar Ingrediente en Modal
    agregarIngrediente: function() {
        const container = document.getElementById('ingredientes-container');
        const count = container.children.length;
        if (count >= 5) {
            alert('Máximo 5 ingredientes por fórmula');
            return;
        }
        
        const html = `
            <div class="flex gap-3 items-end">
                <select class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                    <option>Seleccionar ingrediente...</option>
                    ${this.inventario.materiasPrimas.map(m => `<option value="${m.nombre}">${m.nombre}</option>`).join('')}
                </select>
                <input type="number" placeholder="%" min="1" max="100" step="1" class="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                <button onclick="this.parentElement.remove()" class="text-red-600 hover:text-red-800 text-xl font-bold pb-1">−</button>
            </div>
        `;
        
        const newIngredient = document.createElement('div');
        newIngredient.innerHTML = html;
        container.appendChild(newIngredient.firstElementChild);
    },

    // Guardar Fórmula
    guardarFormula: function() {
        const nombre = document.getElementById('form-nombre').value.trim();
        const descripcion = document.getElementById('form-descripcion').value.trim();
        
        if (!nombre || !descripcion) {
            alert('Por favor completa los campos requeridos');
            return;
        }
        
        const detallesIngredientes = {};
        document.querySelectorAll('#ingredientes-container > div').forEach(row => {
            const select = row.querySelector('select');
            const input = row.querySelector('input');
            if (select && input && select.value !== 'Seleccionar ingrediente...') {
                detallesIngredientes[select.value] = input.value + '%';
            }
        });
        
        const detallesStr = Object.entries(detallesIngredientes).map(([ing, porc]) => ing + ': ' + porc).join(', ');
        
        this.inventario.formulas.push({
            id: (Math.max(...this.inventario.formulas.map(f => f.id), 0) + 1),
            nombre: nombre,
            descripcion: descripcion,
            ingredientes: Object.entries(detallesIngredientes).map(([ing, porc]) => ({
                nombre: ing,
                porcentaje: parseInt(porc)
            }))
        });
        
        this.registrarLog('AGREGAR_FORMULA', 'Nueva formula: ' + nombre, 'Ingredientes: ' + detallesStr);
        this.guardarInventario();
        alert('Fórmula "' + nombre + '" guardada exitosamente. ¡Puedes usarla para producción!');
        this.cerrarModal();
    },

    // Modal para Producir Fórmula
    mostrarModalProducirFormula: function(formulaId) {
        const formula = this.inventario.formulas.find(f => f.id === formulaId);
        if (!formula) return;

        // Calcular desglose de ingredientes por unidad
        const desglose = formula.ingredientes.map(ing => {
            const materia = this.inventario.materiasPrimas.find(m => m.nombre === ing.nombre);
            const cantidadPorUnidad = ing.porcentaje / 100;
            return {
                nombre: ing.nombre,
                porcentaje: ing.porcentaje,
                cantidadPorUnidad: cantidadPorUnidad,
                unidad: materia ? materia.unidad : 'kg',
                stockActual: materia ? materia.stock : 0,
                suficiente: materia ? (materia.stock > 0) : false
            };
        });

        const html = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="modalOverlay">
                <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 animate-scale-in max-h-96 overflow-y-auto">
                    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
                        <div>
                            <h3 class="text-xl font-bold text-gray-800">🏭 Producir: ${formula.nombre}</h3>
                            <p class="text-xs text-gray-500 mt-1">Ingresa cantidad a producir</p>
                        </div>
                        <button onclick="CosmeticosModule.cerrarModal()" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                    </div>
                    
                    <div class="px-6 py-6 space-y-6">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Cantidad a Producir (kg)</label>
                            <input type="number" id="prod-cantidad" value="1" placeholder="1" min="0.1" step="0.1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg">
                        </div>

                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h4 class="text-sm font-bold text-gray-800 mb-4">Desglose de Ingredientes Necesarios</h4>
                            <div class="space-y-3">
                                ${desglose.map(d => {
                                    const cantRequerida = (d.cantidadPorUnidad).toFixed(3);
                                    const color = d.suficiente ? 'bg-green-50' : 'bg-red-50';
                                    const textColor = d.suficiente ? 'text-green-700' : 'text-red-700';
                                    return `
                                        <div class="flex justify-between items-center p-3 rounded border ${d.suficiente ? 'border-green-200' : 'border-red-200'} ${color}">
                                            <div>
                                                <p class="font-semibold text-gray-800">${d.nombre}</p>
                                                <p class="text-xs text-gray-600">Stock: ${d.stockActual} ${d.unidad}</p>
                                            </div>
                                            <div class="text-right">
                                                <p class="font-bold text-lg ${textColor}">${d.porcentaje}%</p>
                                                <p class="text-xs text-gray-600" id="calc-${d.nombre}">1 kg = ${cantRequerida} ${d.unidad}</p>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>

                        <div class="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                            <p class="text-sm text-blue-800"><strong>📌 Nota:</strong> Al producir se descontará automáticamente del inventario de materias primas.</p>
                        </div>
                    </div>
                    
                    <div class="px-6 py-4 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-white">
                        <button onclick="CosmeticosModule.cerrarModal()" class="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors">Cancelar</button>
                        <button onclick="CosmeticosModule.guardarProduccionDesdeFórmula(${formulaId})" class="flex-1 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-colors">Confirmar Producción</button>
                    </div>
                </div>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.innerHTML = html;
        document.body.appendChild(overlay.firstElementChild);

        // Event listener para actualizar el desglose dinámicamente
        const cantidadInput = document.getElementById('prod-cantidad');
        if (cantidadInput) {
            cantidadInput.addEventListener('input', function() {
                const cantidad = parseFloat(this.value) || 0;
                desglose.forEach(d => {
                    const cantRequerida = (d.cantidadPorUnidad * cantidad).toFixed(3);
                    const elem = document.getElementById(`calc-${d.nombre}`);
                    if (elem) elem.textContent = `${cantidad} kg = ${cantRequerida} ${d.unidad}`;
                });
            });
        }
    },

    // Guardar Producción desde Fórmula
    guardarProduccionDesdeFórmula: function(formulaId) {
        const cantidad = parseFloat(document.getElementById('prod-cantidad').value);
        const formula = this.inventario.formulas.find(f => f.id === formulaId);

        if (!formula || !cantidad || cantidad <= 0) {
            alert('Por favor ingresa una cantidad válida');
            return;
        }

        // Validar que hay suficientes materias primas
        for (const ingrediente of formula.ingredientes) {
            const materia = this.inventario.materiasPrimas.find(m => m.nombre === ingrediente.nombre);
            const requerido = (ingrediente.porcentaje / 100) * cantidad;
            
            if (!materia || materia.stock < requerido) {
                alert(`❌ No hay suficiente ${ingrediente.nombre}. Requerido: ${requerido.toFixed(2)}, Disponible: ${materia ? materia.stock : 0}`);
                return;
            }
        }

        // Descontar del inventario
        formula.ingredientes.forEach(ingrediente => {
            const materia = this.inventario.materiasPrimas.find(m => m.nombre === ingrediente.nombre);
            if (materia) {
                const requerido = (ingrediente.porcentaje / 100) * cantidad;
                materia.stock = Math.max(0, materia.stock - requerido);
            }
        });

        // Crear registro de producción
        const hoy = new Date().toISOString().split('T')[0];
        const nuevoLote = {
            producto: formula.nombre,
            cantidad: cantidad,
            fecha: hoy,
            estado: 'Completado',
            formulaId: formulaId
        };
        
        const detallesIngredientes = formula.ingredientes.map(i => i.nombre + ' (' + i.porcentaje + '%)').join(', ');
        this.registrarLog('PRODUCIR', 'Producción de: ' + formula.nombre, 'Cantidad: ' + cantidad + 'kg, Ingredientes: ' + detallesIngredientes);
        this.inventario.produccion.push(nuevoLote);
        this.guardarInventario();
        this.cerrarModal();
        this.renderDashboard();
        this.switchTab('produccion');
        alert(`✅ ¡Producción de ${cantidad}kg de "${formula.nombre}" registrada exitosamente!\n\nLote: LOT-${String(this.inventario.produccion.length).padStart(4, '0')}`);
    },

    // Cerrar Modal
    cerrarModal: function() {
        const modal = document.getElementById('modalOverlay');
        if (modal) modal.remove();
    },

    // Eliminar Materia Prima
    eliminarMateria: function(id) {
        const materia = this.inventario.materiasPrimas.find(m => m.id === id);
        if (!materia) return;

        const html = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" id="modalOverlay">
                <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                    <div class="px-6 py-6 text-center">
                        <div class="text-5xl mb-4">⚠️</div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Confirmar Eliminación</h3>
                        <p class="text-gray-600 mb-6">¿Deseas eliminar la materia prima <strong>"${materia.nombre}"</strong>? Esta acción no se puede deshacer.</p>
                    </div>
                    
                    <div class="px-6 py-4 border-t border-gray-200 flex gap-3">
                        <button onclick="CosmeticosModule.cerrarModal()" class="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors">Cancelar</button>
                        <button onclick="CosmeticosModule.confirmarEliminarMateria(${id})" class="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        
        const overlay = document.createElement('div');
        overlay.innerHTML = html;
        document.body.appendChild(overlay.firstElementChild);
    },

    // Confirmar Eliminación
    confirmarEliminarMateria: function(id) {
        const materia = this.inventario.materiasPrimas.find(m => m.id === id);
        if (materia) {
            this.registrarLog('ELIMINAR', 'Materia Prima: ' + materia.nombre, 'Stock: ' + materia.stock + ' ' + materia.unidad + ', Precio: $' + materia.precio);
        }
        this.inventario.materiasPrimas = this.inventario.materiasPrimas.filter(m => m.id !== id);
        this.guardarInventario();
        this.cerrarModal();
        this.renderDashboard();
    },

    // Registrar Log de Movimiento
    registrarLog: function(tipo, descripcion, detalles) {
        detalles = detalles || '';
        const ahora = new Date();
        const fecha = ahora.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const log = {
            ID: this.inventario.logs.length + 1,
            fecha: fecha,
            tipo: tipo,
            descripcion: descripcion,
            detalles: detalles,
            timestamp: ahora.getTime()
        };
        
        this.inventario.logs.push(log);
        console.log('[LOG] ' + tipo + ': ' + descripcion);
    },

    // Limpiar Historial
    limpiarHistorial: function() {
        if (confirm('¿Estás seguro de que deseas limpiar todo el historial de movimientos? Esta acción no se puede deshacer.')) {
            this.inventario.logs = [];
            this.guardarInventario();
            this.renderDashboard();
            this.switchTab('historial');
            alert('✅ Historial limpiado exitosamente');
        }
    },

    // Guardar datos en localStorage
    guardarInventario: function() {
        localStorage.setItem('cosmeticos_materias_primas', JSON.stringify(this.inventario.materiasPrimas));
        localStorage.setItem('cosmeticos_produccion', JSON.stringify(this.inventario.produccion));
        localStorage.setItem('cosmeticos_salidas', JSON.stringify(this.inventario.salidas));
        localStorage.setItem('cosmeticos_formulas', JSON.stringify(this.inventario.formulas));
        localStorage.setItem('cosmeticos_logs', JSON.stringify(this.inventario.logs));
    },

    // Setup Event Listeners
    setupEventListeners: function() {
        // Los listeners se manejan directamente en los botones inline
    }
};

// Hacer el módulo globalmente accesible para el Core
window.app = window.app || {};
window.app.cosmeticos = CosmeticosModule;
window.CosmeticosModule = CosmeticosModule;