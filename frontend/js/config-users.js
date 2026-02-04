/* config-users.js - V2.0 CON ROLES Y PERMISOS */

window.SeedData = {
    // NUEVA ESTRUCTURA DE USUARIOS
    users: [
        {
            id: 1,
            username: "Xelle_Fer",
            pass: "123", // En producción esto debe ir hasheado
            fullName: "Luis Fernando Gómez",
            role: "super_admin",
            moduleAccess: ["all"] // Acceso total
        },
        {
            id: 2,
            username: "calidad",
            pass: "123",
            fullName: "Gerente de Calidad",
            role: "quality_manager",
            moduleAccess: ["lab-calidad", "documentacion"]
        },
        {
            id: 3,
            username: "ventas",
            pass: "123",
            fullName: "Ejecutivo Comercial",
            role: "sales",
            moduleAccess: ["comercial"]
        }
    ],

    // Mapeo de áreas para permisos (IDs que usas en dashboard y lims-core)
    permissionsMap: {
        "banco": "lab-calidad",    // El banco suele ser parte técnica
        "calidad": "lab-calidad",
        "documentacion": "sgc",
        "comercial": "almacen"     // Mapeamos ventas/comercial a almacén/logística
    },

    // 2. LISTADO MAESTRO (Sin cambios, se mantiene tu lista de formatos)
    formats: [
        // ... (MANTÉN TU LISTA DE FORMATOS ACTUAL AQUÍ) ...
        // Asegúrate de que config-users.js siga teniendo la lista 'formats'
        // que me pasaste en la Parte 2 y 5.
    ]
};