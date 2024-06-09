const axios = require('axios');

const ZAP_BASE_URL = 'http://127.0.0.1:8080'; // Asegúrate de que ZAP está corriendo en este puerto
const ZAP_API_KEY = '50g3fmcad7eu1hccskohjh7la2'; // Reemplaza esto con tu API key de ZAP

async function startScan(target) {
    try {
        const scanResponse = await axios.get(`${ZAP_BASE_URL}/JSON/ascan/action/scan/`, {
            params: {
                url: target,
                apikey: ZAP_API_KEY
            }
        });
        return scanResponse.data.scan;
    } catch (error) {
        console.error('Error in startScan:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function getScanStatus(scanId) {
    try {
        const statusResponse = await axios.get(`${ZAP_BASE_URL}/JSON/ascan/view/status/`, {
            params: {
                scanId,
                apikey: ZAP_API_KEY
            }
        });
        return statusResponse.data.status;
    } catch (error) {
        console.error('Error in getScanStatus:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function getScanAlerts(targetUrl) {
    try {
        const alertsResponse = await axios.get(`${ZAP_BASE_URL}/JSON/core/view/alerts/`, {
            params: {
                baseurl: targetUrl,
                apikey: ZAP_API_KEY
            }
        });
        return alertsResponse.data.alerts;
    } catch (error) {
        console.error('Error in getScanAlerts:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = {
    startScan,
    getScanStatus,
    getScanAlerts
};
