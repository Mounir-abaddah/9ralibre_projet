const mongoose = require('mongoose');

const CoursShema = new mongoose.Schema({
    matiere:{
        type:mongoose.Schema.Types.ObjectId , ref:"matiere"
    },
    semestre:{
        type:String,
        enum:["Premier Semestre", "Deuxième Semestre"],
        required:true
    },
    type:{
        type:String, 
        enum: ["Cours", "Exercice", "Examen National", "Examen Régional"], 
        required: true 
    },
    filière:{
        type:String, 
        required: true 
    },
    professeur:{
        type:String,
        required: true,
        default:""
    },
    title:{ 
        type:String, 
        required:true 
    },
    pdfUrl:{ 
        type: String, 
        required: true
    },
},{
    timestamps:true
})

const CoursModels = mongoose.model("Cours", CoursShema)


module.exports = CoursModels