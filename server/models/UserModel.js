const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nom:{
        type:String,
        required:true
    },
    prenom:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true,
        enum:['Etudiant','Etudiante']
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
},{
    timestamps:true
})

const UserModels = mongoose.model("User", UserSchema)

module.exports = UserModels