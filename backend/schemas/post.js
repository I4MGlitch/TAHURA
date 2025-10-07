const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    username: { type: String },
    date: {type: Date, default: Date.now},
    description: { type: String },
    like: [
        {
            username: String
        }
    ],    
    dislike: [
        {
            username: String
        }
    ],
    photos: [
        {
            data: Buffer,
            contentType: String
        }
    ],
    comments: [
        {
            username: String,
            comment: String,
        }
    ],
});

module.exports = mongoose.model('post', postSchema);