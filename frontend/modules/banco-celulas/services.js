// frontend/modules/banco-celulas/services.js

/**
 * SERVICIO DE DATOS (DATA LAYER)
 * Simula las llamadas al Backend (Spring Boot).
 * Aquí es donde conectaremos la API REST en el futuro.
 */

window.app = window.app || {};
window.app.services = window.app.services || {};

window.app.services.bancoCelulas = {
    
    // Obtener KPIs del Dashboard
    getDashboardStats: async function() {
        // En futuro: return await fetch('/api/dashboard/stats');
        return {
            activeCultures: 124,
            quarantine: 8,
            totalVials: 4520,
            incubatorUsage: 72
        };
    },

    // Obtener Alertas
    getAlerts: async function() {
        return [
            { type: 'critical', msg: 'Temp. Incubadora 4 fuera de rango (+0.5°C)', time: '10 min' },
            { type: 'warning', msg: 'Lote TPL-DG-09 requiere cambio de medio', time: '2 h' },
            { type: 'info', msg: 'Nuevo ingreso de tejido pendiente de validación', time: '4 h' }
        ];
    },

    // Obtener Lista de Cultivos
    getCultures: async function() {
        return [
            { id: 'CULT-24-081', line: 'MSC-Wharton', pass: 'P3', location: 'INC-01', confluency: 85, status: 'Optimal' },
            { id: 'CULT-24-082', line: 'Fibroblastos', pass: 'P5', location: 'INC-02', confluency: 95, status: 'Harvest Ready' },
            { id: 'CULT-24-085', line: 'MSC-Adiposo', pass: 'P1', location: 'INC-01', confluency: 40, status: 'Slow Growth' }
        ];
    },

    // Obtener Estado de Incubadoras
    getIncubators: async function() {
        return [
            { id: 'INC-01', temp: 37.0, co2: 5.0, hum: 95, status: 'ok' },
            { id: 'INC-02', temp: 37.1, co2: 4.9, hum: 94, status: 'warning' },
            { id: 'INC-03', temp: 36.9, co2: 5.0, hum: 95, status: 'ok' },
            { id: 'INC-04', temp: 37.5, co2: 5.2, hum: 90, status: 'error' }
        ];
    }
};