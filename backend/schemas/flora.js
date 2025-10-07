const mongoose = require('mongoose');

const floraSchema = mongoose.Schema({
    name: { type: String },
    nameIlmiah: {type: String},
    description: { type: String },
    short_description: { type: String },
    category: { type: String },
    no: { type: Number},
    bentuk: { type: String }, 
    akar: { type: String },
    daun: { type: String },
    lainnya: { type: String },
    tipeBiji: { type: String },
    kulitKayu: { type: String },
    ciriKhusus: { type: String },
    bunga: { type: String },
    buah: { type: String },
    kegunaan: { type: String },
    photos: [
        {
            data: Buffer,
            contentType: String
        }
    ]
});

module.exports = mongoose.model('flora', floraSchema);