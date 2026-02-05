/* frontend/js/config-users.js - Versión Robusta */

// 1. Garantizamos que el objeto global exista
window.SeedData = window.SeedData || {};

// 2. Definimos los usuarios
window.SeedData.users = [
    {
        id: 1,
        username: "Xelle_Fer",
        pass: "123",
        fullName: "Luis Fernando Gómez",
        role: "super_admin",
        moduleAccess: ["all"]
    },
    {
        id: 2,
        username: "calidad",
        pass: "123",
        fullName: "Gerente de Calidad",
        role: "quality_manager",
        moduleAccess: ["lab-calidad"]
    },
    {
        id: 3,
        username: "operador",
        pass: "123",
        fullName: "Operador Producción",
        role: "operator",
        moduleAccess: ["banco-celulas", "incubadoras"]
    }
];

console.log("✅ [System] Base de datos de usuarios cargada correctamente.");