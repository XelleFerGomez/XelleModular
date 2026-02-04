/**
 * SERVICIO DE DATOS (DATA LAYER)
 * Conecta con el Backend Spring Boot (Puerto 8080)
 */

window.app = window.app || {};
window.app.services = window.app.services || {};

// URL Base de tu API Java
const API_BASE_URL = 'http://localhost:8080/api';

window.app.services.bancoCelulas = {
    
    // --- 1. RECEPCIÓN (CONEXIÓN REAL) ---
    saveReception: async function(loteData) {
        console.log("📡 Enviando datos a Spring Boot:", loteData);
        
        try {
            const response = await fetch(`${API_BASE_URL}/lotes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loteData)
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Guardado en PostgreSQL:", data);
            return data;
            
        } catch (error) {
            console.error("❌ Error de conexión:", error);
            throw error;
        }
    },

    // --- 2. DATOS SIMULADOS (MOCK) ---
    // (Estos se conectarán en el siguiente Sprint, por ahora simulamos para que no se rompa el dashboard)
    
    getDashboardStats: async function() {
        return {
            activeCultures: 124,
            quarantine: 8,
            totalVials: 4520,
            incubatorUsage: 72
        };
    },

    getAlerts: async function() {
        return [
            { type: 'critical', msg: 'Temp. Incubadora 4 fuera de rango (+0.5°C)', time: '10 min' },
            { type: 'warning', msg: 'Lote TPL-DG-09 requiere cambio de medio', time: '2 h' },
            { type: 'info', msg: 'Nuevo ingreso de tejido pendiente de validación', time: '4 h' }
        ];
    },

    getCultures: async function() {
        return [
            { id: 'CULT-24-081', line: 'MSC-Wharton', pass: 'P3', location: 'INC-01', confluency: 85, status: 'Optimal' },
            { id: 'CULT-24-082', line: 'Fibroblastos', pass: 'P5', location: 'INC-02', confluency: 95, status: 'Harvest Ready' }
        ];
    },

    getIncubators: async function() {
        return [
            { id: 'INC-01', temp: 37.0, co2: 5.0, hum: 95, status: 'ok' },
            { id: 'INC-02', temp: 37.1, co2: 4.9, hum: 94, status: 'warning' },
            { id: 'INC-03', temp: 36.9, co2: 5.0, hum: 95, status: 'ok' },
            { id: 'INC-04', temp: 37.5, co2: 5.2, hum: 90, status: 'error' }
        ];
    }
};