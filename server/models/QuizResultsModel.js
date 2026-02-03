const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    answers: [
        {
            questionId: mongoose.Schema.Types.ObjectId,
            selectedAnswer: Number,
            correctAnswer: Number,
            isCorrect: Boolean
        }
    ],
    score: {
        type:Number,
    },
    totalQuestions:{
        type:Number,
    },
    passedAt: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('QuizResult', QuizResultSchema);
