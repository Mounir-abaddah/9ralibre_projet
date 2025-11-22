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
});

router.get('/likes/:videoId',authMiddleware,async(req,res)=>{
    try{
        const {videoId} = req.params;

        const video = await VideoModel.findById(videoId).populate("likes","nom prenom");
        if(!video){
            return res.status(404).send({message:"aucune video est liker",success:false,err:err.message})
        }

        return res.status(200).json({success:true,likesCount:video.likes.length,likes:video.likes})
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue pour get les videos",success:false,err:err.message})
    }
})

router.post('/likes/:videoId',authMiddleware,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const {videoId} = req.params;

        const video = await VideoModel.findById(videoId);
        if(!video){
            return res.status(404).send({message:"aucune video est liker",success:false,err:err.message})
        }
        if(video.likes.includes(userId)){
            video.likes.pull(userId);
            await video.save();
            return res.json({ liked: false, likes: video.likes.length });
        }
        video.likes.push(userId);
        await video.save();
        return res.status(200).json({likes:video.likes.length,success:true})
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue pour liker cette videos",success:false,err:err.message})
    }
});

router.post('/views/:viewId',authMiddleware,async(req,res)=>{
    try{
        const {viewId} = req.params;
        const video = await VideoModel.findById(viewId);
        if(!video){
            return res.status(404).json({ message: "Vidéo non trouvée" });
        }
        video.views += 1;
        await video.save();
        res.json({ views: video.views });
    }catch(err){
        res.status(500).json({ err: err.message });
    }
})


module.exports = router