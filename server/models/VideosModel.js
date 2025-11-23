const mongoose = require("mongoose");

const VideosShema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:""
    },
    videoUrl:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        default:""
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
    filière: { 
        type: String,
        required: true 
    },
    professeur: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    likes: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    views: {
        type: Number,
        default: 0
    },
    comments: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ]
},{
    timestamps:true
})

const VideosModel = mongoose.model("Video",VideosShema,"videos");

module.exports = VideosModel