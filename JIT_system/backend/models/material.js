const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
    line: { type: String, required: true },
    workOrderNumber: { type: String, required: true },
    materialPartNumber: { type: String, required: true },
    quantity: { type: Number, default: '-' },
    description: { type: String, default: '-' },
    movedQuantity: { type: Number, default: 0 }, // Updated default
    status: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Material', materialSchema);