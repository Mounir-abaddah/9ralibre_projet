const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')
const VideoModel = require('../models/VideosModel');
const NiveauxModel = require('../models/NiveauxModel');



router.get('/get-videos/:niveauxNom',async(req,res)=>{
    try{
        const {niveauxNom} = req.params;
        const niveaux = await NiveauxModel.findOne({ nom: niveauxNom });
        if(!niveaux){
            return res.status(404).json({message:"Niveau non trouvé",success:false})
        }
        const videos = await VideoModel.find({niveaux:niveaux._id})
        .populate("matiere","nom")
        .populate("niveaux","nom")
        .populate("professeur","nom prenom image");

        return res.status(200).json({success:true,videos})
    }catch(err){
        return res.status(500).send({message:"Une erreure pour recevoir videos",success:false,err})
    }
})


router.post('/add-videos',authMiddleware,async(req,res)=>{
    try{
        const {
            title,
            description,
            videoUrl,
            thumbnail,
            matiere,
            niveaux,
            filière,
            professeur
        } = req.body;

        const newVideo = await VideoModel.create({
            title,
            description,
            videoUrl,
            thumbnail,
            matiere,
            niveaux,
            filière,
            professeur
        });

        return res.json({
            success: true,
            message: "Vidéo ajoutée avec succès",
            video: newVideo
        });
    }catch(err){
        return res.status(500).send({message:"Une erreure pour ajouter videos",success:false,err})
    }
})


module.exports = router