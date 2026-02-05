/**
 * main.js - Núcleo del Sistema Xelle
 * Maneja la sesión, navegación y carga de módulos.
 */

window.app = window.app || {};

// 1. VERIFICACIÓN DE SEGURIDAD (El "Cadenero")
// Esto se ejecuta inmediatamente antes de cargar nada más.
(function checkSession() {
    const userSession = localStorage.getItem('xelle_user');
    
    // Si no hay sesión guardada, mandar al login
    if (!userSession) {
        console.warn("⛔ No hay sesión activa. Redirigiendo al Login...");
        window.location.href = 'login.html';
        return; // Detener ejecución
    }

    // Si hay sesión, cargar datos del usuario en memoria
    try {
        window.currentUser = JSON.parse(userSession);
        console.log("✅ Sesión validada para:", window.currentUser.fullName);
    } catch (e) {
        console.error("Error leyendo sesión:", e);
        localStorage.removeItem('xelle_user'); // Borrar sesión corrupta
        window.location.href = 'login.html';
    }
})();

// 2. INICIALIZACIÓN DEL SISTEMA
document.addEventListener('DOMContentLoaded', () => {
    
    // A. Mostrar nombre del usuario en la interfaz
    updateUserInterface();

    // B. Manejo de Navegación (Sidebar)
    setupNavigation();

    // C. Cargar Dashboard por defecto
    // Si tenemos el módulo de banco de células, lo iniciamos si se pide
    // (Por defecto mostramos el dashboard principal)
});

function updateUserInterface() {
    // Buscar elementos del DOM donde va el nombre del usuario
    const userNameElement = document.getElementById('user-name-display');
    const userRoleElement = document.getElementById('user-role-display');

    if (window.currentUser) {
        if (userNameElement) userNameElement.innerText = window.currentUser.fullName;
        if (userRoleElement) userRoleElement.innerText = formatRole(window.currentUser.role);
    }
}

function formatRole(role) {
    const roles = {
        'super_admin': 'Administrador General',
        'quality_manager': 'Gerente de Calidad',
        'operator': 'Operador de Producción'
    };
    return roles[role] || role;
}

function setupNavigation() {
    // Lógica para cerrar sesión
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if(confirm("¿Estás seguro de cerrar sesión?")) {
                localStorage.removeItem('xelle_user');
                window.location.href = 'login.html';
            }
        });
    }
}

// Función global de navegación (Compatibilidad)
window.app.navigateTo = function(moduleId) {
    console.log("Navegando a:", moduleId);
    
    const dashboardView = document.getElementById('view-dashboard');
    const moduleView = document.getElementById('view-module');

    if (moduleId === 'dashboard') {
        dashboardView.classList.remove('hidden');
        moduleView.classList.add('hidden');
        moduleView.innerHTML = ''; // Limpiar módulo anterior
    } else {
        // Ocultar dashboard principal
        dashboardView.classList.add('hidden');
        moduleView.classList.remove('hidden');

        // Aquí se cargaría el módulo específico si no fuera el Banco de Células
        // (El Banco de Células tiene su propio init en el index.html)
    }
};