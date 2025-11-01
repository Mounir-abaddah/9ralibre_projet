const mongoose = require('mongoose');
const MatiereSchema = new mongoose.Schema({
    nom:{
        type:String,
        required:true
    },
    niveaux:{
        type:mongoose.Schema.Types.ObjectId,ref:"Niveaux"
    }
})

const MatiereModel = mongoose.model("matiere", MatiereSchema,"matiere")


module.exports = MatiereModel