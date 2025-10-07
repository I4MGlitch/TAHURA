const mongoose = require('mongoose');

const faunaSchema = mongoose.Schema({
    name: { type: String },
    nameIlmiah: {type: String},
    description: { type: String },
    short_description: { type: String },
    category: { type: String },
    habitat: { type: String },
    panjang: { type: String },
    lebar: { type: String },
    warna: { type: String },
    makanan: { type: String },
    reproduksi: { type: String },
    adaptasi: { type: String },
    gerakan: { type: String },
    alatGerak: { type: String},
    bentukTubuh: { type: String },
    no: { type: Number},
    photos: [
        {
            data: Buffer,
            contentType: String
        }
    ]
});

module.exports = mongoose.model('fauna', faunaSchema);