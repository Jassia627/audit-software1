const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const path = require('path');

exports.startScan = async (req, res) => {
    const { targetUrl } = req.body;
    const scanId = `scan-${Date.now()}`;
    const outputFile = path.join(__dirname, `../results/${scanId}.json`);

    try {
        exec(`docker run --rm -v nikto_results:/results arminc/nikto -h ${targetUrl} -o /results/${scanId}.json -Format json`, (error, stdout, stderr) => {
            if (error) {
                res.status(400).json({ success: false, message: error.message });
                return;
            }
            res.status(201).json({ success: true, scanId });
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getScanResults = async (req, res) => {
    const { scanId } = req.params;
    const resultFilePath = path.join(__dirname, `../results/${scanId}.json`);

    try {
        res.sendFile(resultFilePath);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


exports.getRiskSummary = async (req, res) => {
    const { scanId } = req.params;
    const resultFilePath = path.join(__dirname, `../results/${scanId}.json`);

    try {
        const data = fs.readFileSync(resultFilePath, 'utf8');
        const results = JSON.parse(data);

        // Procesar resultados para generar un resumen de riesgo
        const riskSummary = processRiskSummary(results);

        res.status(200).json({ success: true, riskSummary });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const processRiskSummary = (results) => {
    // Lógica para procesar los resultados y generar el resumen de riesgo
    const highRisk = results.findings.filter(f => f.risk_factor === 'High').length;
    const mediumRisk = results.findings.filter(f => f.risk_factor === 'Medium').length;
    const lowRisk = results.findings.filter(f => f.risk_factor === 'Low').length;

    return {
        highRisk,
        mediumRisk,
        lowRisk,
    };
};
