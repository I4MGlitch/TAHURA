const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    username: { type: String },
    description: { type: String },    
});

module.exports = mongoose.model('report', reportSchema);