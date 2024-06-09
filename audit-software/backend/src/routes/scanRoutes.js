const express = require('express');
const router = express.Router();
const { Scan } = require('../models/scanModel');
const zapScan = require('../services/zapScan');

async function waitForScanToComplete(scanId) {
    let status = await zapScan.getScanStatus(scanId);
    while (status !== '100') {
        await new Promise(resolve => setTimeout(resolve, 100000)); // Esperar 5 segundos
        status = await zapScan.getScanStatus(scanId);
        console.log(`Current scan status: ${status}`);
    }
    return status;
}

// Start a new scan
router.get('/start', async (req, res) => {
    const target = req.query.target;
    if (!target) {
        return res.status(400).json({ error: 'Target URL is required' });
    }

    try {
        const scan = new Scan({ target, status: 'running' });
        await scan.save();

        // Iniciar escaneo usando la API de ZAP
        console.log(`Starting scan for target: ${target}`);
        const scanId = await zapScan.startScan(target);
        console.log(`Started scan with ID: ${scanId}`);

        // Esperar a que el escaneo termine
        await waitForScanToComplete(scanId);

        // Obtener alertas
        const alerts = await zapScan.getScanAlerts(target);
        console.log(`Alerts: ${JSON.stringify(alerts)}`);

        scan.status = 'complete';
        scan.result = { alerts: alerts };
        await scan.save();

        res.json({ scan: scan._id });
    } catch (error) {
        console.error('Error starting scan:', error);
        res.status(500).json({ error: 'Failed to start scan' });
    }
});
// Get scan status and results
router.get('/status/:scanId', async (req, res) => {
    try {
        const scan = await Scan.findById(req.params.scanId);
        if (!scan) {
            return res.status(404).json({ error: 'Scan not found' });
        }
        res.json(scan);
    } catch (error) {
        console.error('Error getting scan status:', error);
        res.status(500).json({ error: 'Failed to get scan status' });
    }
});

module.exports = router;
