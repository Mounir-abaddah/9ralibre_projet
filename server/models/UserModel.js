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
    image:{
        type:String,
        default:""
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    niveaux:{
        type:String,
        enum:["Non renseigné","1AC","2AC","3AC","TC","1BAC","2BAC"],
        default:"Non renseigné"
    },
    completeProfile:{
        type:Boolean,
        default:false
    },
    accountVerified:{
        type:Boolean,
        default:false
    },
    events:[{
        Date:{
            type:Date,
            required:true
        },
        type:{
            type:Array,
            required:true
        },
        titre:{
            type:String,
            required:true
        },
        Description:{
            type:String,
            required:false
        }
        
    }]
},{
    timestamps:true
})

const UserModels = mongoose.model("User", UserSchema)


module.exports = UserModels