const mongoose = require('mongoose');

const learningModulesSchema = mongoose.Schema({
    title: { type: String },
    description: { type: String },
    category: { type: String, enum: ['article', 'video', 'infographic']},
    url: { type: String },
    tags: { type: String},
    date: { type: String },
    photos: [
        {
            data: Buffer,
            contentType: String
        }
    ],   
});

module.exports = mongoose.model('learningModule', learningModulesSchema);