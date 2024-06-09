// models/scanModel.js
const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    target: { type: String, required: true },
    status: { type: String, required: true },
    result: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

const Scan = mongoose.model('Scan', scanSchema);

module.exports = { Scan };
