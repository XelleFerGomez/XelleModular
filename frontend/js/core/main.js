// frontend/js/core/main.js

// 1. Verificar Sesión al inicio
(function checkAuth() {
    const session = localStorage.getItem('lims_user_session');
    if (!session) {
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    } else {
        const sessionData = JSON.parse(session);
        const now = new Date().getTime();
        if (now - sessionData.timestamp > (24 * 60 * 60 * 1000)) {
            logout();
        }
    }
})();

window.app = window.app || {};
window.app.state = {
    currentModule: null,
    loadedScripts: []
};

document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
});

function loadUserInfo() {
    const session = JSON.parse(localStorage.getItem('lims_user_session'));
    if (session) {
        const elName = document.getElementById('userNameDisplay');
        const elRole = document.getElementById('userRoleDisplay');
        if(elName) elName.textContent = session.name;
        if(elRole) elRole.textContent = session.role.toUpperCase().replace('_', ' ');
    }
}

window.logout = function() {
    localStorage.removeItem('lims_user_session');
    window.location.href = 'login.html';
};

// --- NAVEGACIÓN Y BREADCRUMBS ---

window.app.navigateTo = function(moduleName) {
    console.log(`Navegando a: ${moduleName}`);
    
    // UI: Cambiar vistas
    document.getElementById('view-dashboard').classList.add('hidden');
    document.getElementById('view-module').classList.remove('hidden');
    
    // UI: Iniciar Breadcrumb base
    window.app.updateBreadcrumb([formatModuleName(moduleName)]);

    // Cargar script
    if (!window.app.state.loadedScripts.includes(moduleName)) {
        loadModuleScript(moduleName);
    } else {
        if (window.app[moduleName] && typeof window.app[moduleName].init === 'function') {
            window.app[moduleName].init();
        }
    }
};

window.app.goHome = function() {
    document.getElementById('view-module').classList.add('hidden');
    document.getElementById('view-module').innerHTML = ''; 
    document.getElementById('view-dashboard').classList.remove('hidden');
    
    // Ocultar Breadcrumb en Home
    document.getElementById('breadcrumb').classList.add('hidden');
    window.app.state.currentModule = null;
};

// --- FUNCIÓN NUEVA: ACTUALIZAR RUTA DE NAVEGACIÓN ---
window.app.updateBreadcrumb = function(steps) {
    const breadcrumbContainer = document.getElementById('breadcrumb');
    
    if (!steps || steps.length === 0) {
        breadcrumbContainer.classList.add('hidden');
        return;
    }

    breadcrumbContainer.classList.remove('hidden');
    breadcrumbContainer.innerHTML = ''; // Limpiar

    // Icono de Casa (Inicio) siempre al principio
    let html = `
        <span class="material-symbols-outlined text-[18px] text-slate-400 cursor-pointer hover:text-white transition-colors" onclick="app.goHome()">home</span>
    `;

    steps.forEach((step, index) => {
        // Separador
        html += `<span class="material-symbols-outlined text-[16px] text-slate-500">chevron_right</span>`;
        
        // El último elemento es el activo (Color Sky), los anteriores son links (Gris)
        if (index === steps.length - 1) {
            html += `<span class="font-bold text-xelle-sky text-sm tracking-wide">${step}</span>`;
        } else {
            // Aquí podríamos agregar lógica para hacer clic en niveles anteriores si fuera necesario
            html += `<span class="text-slate-400 text-sm font-medium hover:text-white transition-colors cursor-default">${step}</span>`;
        }
    });

    breadcrumbContainer.innerHTML = html;
};

function loadModuleScript(moduleName) {
    const script = document.createElement('script');
    // Mapeo especial para nombres de carpeta vs nombre de módulo
    let pathName = moduleName;
    if (moduleName === 'banco-celulas') pathName = 'banco-celulas'; // Asegurar coincidencia

    script.src = `modules/${pathName}/${pathName}.js`;
    script.onload = () => {
        window.app.state.loadedScripts.push(moduleName);
        if (window.app[moduleName] && typeof window.app[moduleName].init === 'function') {
            window.app[moduleName].init();
        }
    };
    script.onerror = () => {
        console.error(`Error cargando ${moduleName}`);
        // Intentar ruta alternativa si falla (por si acaso el nombre carpeta/archivo difiere)
        if(moduleName === 'banco-celulas') {
             // Fallback logic removed for clarity, stick to standard structure
             alert(`No se pudo cargar el módulo: ${moduleName}`);
             window.app.goHome();
        }
    };
    document.body.appendChild(script);
}

function formatModuleName(name) {
    const names = {
        'comercial': 'Comercial',
        'lab-calidad': 'Calidad',
        'almacen': 'Almacén',
        'banco-celulas': 'Banco de Células',
        'sgc': 'Biblioteca SGC',
        'admin': 'Administración',
        'configuracion': 'Configuración'
    };
    return names[name] || name;
}