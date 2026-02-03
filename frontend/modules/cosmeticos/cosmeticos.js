// Módulo de Productos Cosméticos para XelleSystem
// Versión 1.0

const CosmeticosModule = {
    // Configuración interna del módulo
    config: {
        name: 'Productos Cosméticos',
        id: 'cosmeticos',
        themeColor: '#E91E63', // Color distintivo (Rosa oscuro/Magenta) para diferenciarlo
        description: 'Gestión de fórmulas, producción y control de calidad cosmética.'
    },

    // Función de inicialización estándar
    init: function() {
        console.log('Inicializando módulo: ' + this.config.name);
        this.renderDashboard();
    },

    // Renderiza el panel principal del módulo
    renderDashboard: function() {
        const contentArea = document.getElementById('app-content');
        if (!contentArea) return;

        // Estructura HTML basada en el diseño de tarjetas (Grid) del sistema actual
        const html = `
            <div class="module-header fade-in" style="border-left: 5px solid ${this.config.themeColor}; padding-left: 15px; margin-bottom: 20px;">
                <h2 class="text-2xl font-bold text-gray-800">${this.config.name}</h2>
                <p class="text-gray-500 text-sm">${this.config.description}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
                
                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-t-4" 
                     style="border-color: ${this.config.themeColor};"
                     onclick="CosmeticosModule.showConstructionAlert('Desarrollo de Fórmulas')">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-lg text-gray-700">Desarrollo (I+D)</h3>
                        <span class="text-2xl">🧪</span>
                    </div>
                    <p class="text-gray-600 text-sm">Creación de nuevas fórmulas, escandallos y pruebas de estabilidad.</p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-t-4" 
                     style="border-color: ${this.config.themeColor};"
                     onclick="CosmeticosModule.showConstructionAlert('Producción')">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-lg text-gray-700">Producción</h3>
                        <span class="text-2xl">🏭</span>
                    </div>
                    <p class="text-gray-600 text-sm">Gestión de lotes, pesadas, mezclado y envasado.</p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-t-4" 
                     style="border-color: ${this.config.themeColor};"
                     onclick="CosmeticosModule.showConstructionAlert('Control de Calidad')">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-lg text-gray-700">Calidad</h3>
                        <span class="text-2xl">🔬</span>
                    </div>
                    <p class="text-gray-600 text-sm">Análisis físico-químicos y microbiológicos de granel y producto terminado.</p>
                </div>

                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-t-4" 
                     style="border-color: ${this.config.themeColor};"
                     onclick="CosmeticosModule.showConstructionAlert('Inventario Cosmético')">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-lg text-gray-700">Inventario MP</h3>
                        <span class="text-2xl">📦</span>
                    </div>
                    <p class="text-gray-600 text-sm">Stock específico de activos, excipientes y envases cosméticos.</p>
                </div>
            </div>

            <div class="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4 fade-in">
                <h4 class="font-bold text-blue-800 text-sm mb-2">ℹ️ Estado del Módulo</h4>
                <p class="text-blue-700 text-xs">
                    El módulo de Cosméticos ha sido inicializado correctamente. Las funcionalidades específicas (Formatos FO-*) se irán integrando progresivamente.
                </p>
            </div>
        `;

        contentArea.innerHTML = html;
    },

    // Helper temporal para funcionalidades en construcción
    showConstructionAlert: function(featureName) {
        // Usa el sistema de notificaciones si existe, sino un alert estándar
        if (typeof showNotification === 'function') {
            showNotification(`La sección ${featureName} está en construcción.`, 'info');
        } else {
            alert(`La funcionalidad [${featureName}] estará disponible próximamente.`);
        }
    }
};

// Hacer el módulo globalmente accesible para el Core
window.CosmeticosModule = CosmeticosModule;