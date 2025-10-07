const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    questions: [
        {
            text: {
                type: String,
                required: true
            },
            options: [
                {
                    label: {
                        type: String,
                        required: true
                    },
                    text: {
                        type: String,
                        required: true
                    }
                }
            ],
            correctAnswer: {
                type: String,
                required: true
            }
        }
    ],
    result: [
        {
            username: {
                type: String,
            },
            score: {
                type: Number,
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("quiz", QuizSchema);
