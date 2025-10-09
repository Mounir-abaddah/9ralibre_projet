const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nom:{
        type:String,
        default : ""
    },
    prenom:{
        type:String,
        default : ""
    },
    role:{
        type:String,
        enum:['Non renseigné','Etudiant','Etudiante'],
        default : "Non renseigné"
    },
    email:{
        type:String,
    },
    password:{
        type:String,
        default : ""
    },
    completeProfile:{
        type:Boolean,
        default:false
    },
    accountVerified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

const UserModels = mongoose.model("User", UserSchema)

module.exports = UserModels