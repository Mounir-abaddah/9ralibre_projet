const mongoose = require('mongoose');

const niveauxShema = new mongoose.Schema({
    nom:{
        type:String,
        required:true
    }
})

const niveauxModel = mongoose.model("Niveaux", niveauxShema,"niveaux")


module.exports = niveauxModel