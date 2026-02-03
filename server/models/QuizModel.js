const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: { 
        type: String, 
        required: true 
    },
    options: [
        { 
            type: String, 
            required: true 
        }
    ],
    correctAnswer: { 
        type: Number, 
        required: true 
    },
}, {
    _id: true
});

const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    matiere: { type: mongoose.Schema.Types.ObjectId, ref: "matiere", required: true },
    niveaux: { type: mongoose.Schema.Types.ObjectId, ref: "Niveaux", required: true },
    filiere: { type: String, required: true },
    professeur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questions: [QuestionSchema],
    type: {type: String,enum: ["exercice", "examen"],required: true
},
    totalQuestions: { type: Number, default: 0 },
}, {
    timestamps: true
});

const QuizModel = mongoose.model("Quiz", QuizSchema, "quizzes");

module.exports = QuizModel;
