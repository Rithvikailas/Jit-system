const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for storing Excel data
const excelDataSchema = new Schema({
    data: {
        type: Object,
        required: true
    }
});

module.exports = mongoose.model('ExcelData', excelDataSchema);
