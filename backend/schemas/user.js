const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: { type: String },
    username: { type: String },
    password: { type: String },    
    photos: [
        {
            data: Buffer,
            contentType: String
        }
    ]
});

module.exports = mongoose.model('user', userSchema);