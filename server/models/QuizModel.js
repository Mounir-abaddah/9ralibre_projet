const mongoose = require('mongoose');

const QuizShema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    questions:[{
        question:{
            type:String,
            required:true
        },
        options:[{
            type:String,
            required:true
        }],
        correctAnswer:{
            type:Number,
            required:true
        }
    }],
    professeur:{
        type:mongoose.Schema.Types.ObjectId, ref:"User"
    },
    filiere:{
        type:String, 
        required: false 
    },
    matiere: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "matiere", 
        required: true 
    },
    niveaux: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Niveaux", 
        required: true 
    },
},{
    timestamps:true
})

const QuizModel = mongoose.model("Quiz",QuizShema,"quiz");

module.exports = QuizModel