const mongoose = require('mongoose');

const beritaSchema = mongoose.Schema({
    title: { type: String },
    description: { type: String },
    short_description: { type: String },
    date: { type: String },
    no: { type: Number},
    photos: [
        {
            data: Buffer,
            contentType: String
        }
    ]
});

module.exports = mongoose.model('berita', beritaSchema);