const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    note: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    createdBy: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('event', eventSchema);
