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

router.get('/:videoId',authMiddleware,async(req,res)=>{
        const {videoId}=req.params;
        const userId = req.user.userId;
        const videos = await VideoModel.findById(videoId).populate("niveaux").populate("matiere").populate("professeur","nom prenom image followers").populate("comments.user","nom prenom image role").populate("comments.replies.user", "nom prenom role image");;
        if(!videos){
            return res.status(400).send({message:"Aucune video n'a ete trouve",success:false})
        }
        const liked = videos.likes.some(like => like._id.toString() === userId.toString());
        const isFollowed = videos.professeur.followers.includes(userId);
        return res.status(200).json({
            isFollowed,
            FollowCount:videos.professeur.followers.length,
            liked,
            likesCount:videos.likes.length,
            success:true,
            videos
        })

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
            return res.json({ liked: false,likesCount:video.likes.length });
        }
        video.likes.push(userId);
        await video.save();
        return res.status(200).json({success:true,liked:true,likesCount:video.likes.length})
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue pour liker cette videos",success:false,err:err.message})
    }
});


router.post('/views/:viewId', authMiddleware, async (req, res) => {
    try {
        const { viewId } = req.params;
        const userId = req.user.userId;
        const video = await VideoModel.findById(viewId);
        if (!video) return res.status(404).json({ message: "Vidéo non trouvée" });

        if (!video.viewers.includes(userId)) {
            video.views += 1;
            video.viewers.push(userId);
            await video.save();
        }
        res.json({success:true,views: video.views });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});



router.post('/comments/:videoId',authMiddleware,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const {text} = req.body;
        const {videoId} = req.params;

        const video = await VideoModel.findById(videoId).populate("comments.user","nom prenom image role");
        if(!video){
            return res.status(400).send({message:"Aucune video est disponible pour commenter",success:false})
        }
        const CommentVideo = {
            user:userId,
            text:text,
            createdAt:new Date()
        }
        video.comments.unshift(CommentVideo);
        await video.save();

        return res.status(201).send({
            message: "Commentaire ajouté avec succès.",
            success: true,
            comment: CommentVideo
        });
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue pour commenter",success:false,err})
    }
});


router.post('/:videoId/comments/:commentsId/reply',authMiddleware,async(req,res)=>{
    const {videoId,commentsId}=req.params;
    const userId = req.user.userId;
    const {text} = req.body;
    if(!text){
        return res.status(400).json({message:"Réponse vide",success:false})
    }
    const video = await VideoModel.findById(videoId);
    if (!video) {
        return res.status(404).json({ message: "Vidéo non trouvée" });
    }
    const comments = video.comments.find(c => c._id.toString() === commentsId);
    if (!comments) {
    return res.status(404).json({ message: "Commentaire non trouvé" });
    }
    comments.replies.unshift({
        user: userId,
        text: text,
        createdAt: new Date()
    });
    await video.save();
    res.status(200).json({message: "Reply ajoutée ✅",video});
})



module.exports = router