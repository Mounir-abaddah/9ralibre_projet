const mongoose = require('mongoose');

const ResultatQuizShema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    wrongAnswers: [
        {
            question:{
                type:String,
                required:true
            },
            correctAnswer:{
                type:String,
            }, 
            userAnswer: {
                type:String,
            }
        }
    ],
    disqualified: {
        type: Boolean,
        default: false
    },
    disqualifiedReason: {
        type: String,
        default: null
    }
},{
    timestamps: true 
});

const ResultatQuizModel = mongoose.model("ResultatQuiz", ResultatQuizShema);

module.exports = ResultatQuizModel