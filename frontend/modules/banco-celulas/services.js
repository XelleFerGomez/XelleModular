/**
 * SERVICIO DE DATOS (DATA LAYER)
 * Conecta con el Backend Spring Boot (Puerto 8080)
 */

window.app = window.app || {};
window.app.services = window.app.services || {};

const API_BASE_URL = 'http://localhost:8080/api';

window.app.services.bancoCelulas = {
    
    // --- 1. RECEPCIÓN ---
    saveReception: async function(loteData) {
        console.log("📡 Enviando recepción a Backend:", loteData);
        try {
            const response = await fetch(`${API_BASE_URL}/lotes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loteData)
            });
            if (!response.ok) throw new Error(`Error BD: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("❌ Error saveReception:", error);
            throw error;
        }
    },

    // --- 2. CULTIVOS ---
    getCultures: async function() {
        try {
            const response = await fetch(`${API_BASE_URL}/cultivos`);
            if (!response.ok) return []; 
            return await response.json();
        } catch (error) {
            console.warn("⚠️ Backend desconectado (cultivos), retornando vacío.");
            return []; 
        }
    },
    
    saveCulture: async function(cultureData) {
        const response = await fetch(`${API_BASE_URL}/cultivos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cultureData)
        });
        return await response.json();
    },

    // --- 3. INCUBADORAS (AHORA REAL) ---
    getIncubators: async function() {
        try {
            const response = await fetch(`${API_BASE_URL}/incubadoras`);
            if (!response.ok) throw new Error("Error fetching incubadoras");
            return await response.json();
        } catch (error) {
            console.warn("⚠️ Backend desconectado (incubadoras), usando Mock de respaldo.");
            // Respaldo visual por si el backend está apagado
            return [
                { id: 'OFFLINE-1', temperaturaActual: 0, co2Actual: 0, humedadActual: 0, estado: 'error' }
            ];
        }
    },

    // --- 4. DASHBOARD & ALERTAS (MOCK - Próximo Sprint) ---
    getDashboardStats: async function() {
        return { activeCultures: 124, quarantine: 8, totalVials: 4520, incubatorUsage: 72 };
    },

    getAlerts: async function() {
        return [
            { type: 'critical', msg: 'Temp. Incubadora 4 fuera de rango', time: '10 min' },
            { type: 'warning', msg: 'Lote TPL-DG-09 requiere cambio de medio', time: '2 h' }
        ];
    }
};