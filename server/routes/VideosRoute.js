const express = require('express');
const router = express.Router();
const VideosModel = require('../models/VideosModel');
const NiveauxModel = require('../models/NiveauxModel');
const {VideoShema,CommentsShema} = require('../validations/authValidation');
const authMidllewares = require('../middlewares/authMiddleware');


{/*********************** Ajouter La Videos ***********************/}
router.post('/add-videos',authMidllewares,async(req,res)=>{
    try{
        const ValidationVideoShema = VideoShema.parse(req.body)
        const videos = new VideosModel({
            title:ValidationVideoShema.title,
            description:ValidationVideoShema.description,
            videoUrl:ValidationVideoShema.videoUrl,
            thumbnail:ValidationVideoShema.thumbnail,
            niveaux:ValidationVideoShema.niveaux,
            professeur:ValidationVideoShema.professeur,
            matiere:ValidationVideoShema.matiere,
            filiere:ValidationVideoShema.filiere,
        })
        await videos.save();
        return res.status(200).send({success:true,message:"Video a ete bien ajouter"})
    }catch(err){
        if(err.name === "ZodError"){
            return res.status(400).send({
            success: false,
            message: err.issues.map(e => e.message)
        });
        }
        return res.status(500).send({message:"Une erreure est survenue lors de recuperation des videos",success:false,err})
    }
});

{/*********************** Get all videos par le Nom ***********************/}
router.get('/get-all-videos/:nameNiveaux',authMidllewares,async(req,res)=>{
    try{
    const {nameNiveaux} = req.params;
    const niveaux = await NiveauxModel.findOne({nom:nameNiveaux});    
    const videos = await VideosModel.find({niveaux:niveaux._id});
    if(!videos){
        return res.status(404).send({message:"Aucune videos est trouver",success:false})
    }
    res.status(200).json({success:true,videos})
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue lors de recuperation des videos",success:false,err})
    }
});

{/*********************** GET Video par ID de Video ***********************/}
router.get('/get-videos-id/:videoId',authMidllewares,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const {videoId} = req.params;
        const videos = await VideosModel.findById(videoId)
        .populate("professeur","nom prenom email image")
        .populate("niveaux","nom")
        .populate("matiere","nom");
        if(!videos){
            return res.status(404).send({message:"Aucune videos est trouver d'apres ce Id",success:false})
        }
        const likes = videos.likes.some(c => c._id.toString() === userId)        
        return res.status(200).send({
            success:true,
            likesCount:videos.likes.length,
            isLikes:likes,
            viewsCount:videos.views,
            videos
        })
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue lors de recuperation de video",success:false,err})
    }
});

{/*********************** POST LIKE VIDEO ET UNLIKER IT ***********************/}
router.post('/post-videos-like/:videoId',authMidllewares,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const {videoId} = req.params;
        const videos = await VideosModel.findById(videoId);
        if(!videos){
            return res.status(404).send({message:"Aucune videos est trouver d'apres ce Id",success:false})
        }
        if(!videos.likes.includes(userId)){
            videos.likes.push(userId)
        }else{
            videos.likes.pull(userId)
        }
        await videos.save();
        return res.status(200).send({
            success:true,
            likesCount:videos.likes.length,
        })
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue lors de liker la video",success:false,err})
    }
});

{/*********************** POST View  ***********************/}
router.post('/post-videos-view/:videoId',authMidllewares,async(req,res)=>{
    const userId = req.user.userId;
    const {videoId} = req.params;
    const videos = await VideosModel.findById(videoId);
    if(!videos){
        return res.status(404).send({message:"Aucune videos est trouver",success:false})
    }
    if(!videos.viewers.includes(userId)){
        videos.views += 1;
        videos.viewers.push(userId)
    }    
    await videos.save();
    return res.status(200).json({videos})
});

{/*********************** POST COMMENTAIRE   ***********************/}
router.post('/post-videos-commentaires/:videoId',authMidllewares,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const {videoId}= req.params;
        const ValidationCommentsShema = CommentsShema.parse(req.body);
        const videos = await VideosModel.findById(videoId);
        if(!videos){
            return res.status(404).send({message:"Aucune videos est trouver",success:false})
        }
        videos.comments.unshift({
            user:userId,
            text:ValidationCommentsShema.text,
            createdAt:Date.now()
        })
        await videos.save()
        return res.status(200).send({message:"Commentaire publie avec success",success:true,videos})
    }catch(err){
        if(err.name === "ZodError"){
            return res.status(500).send({
                success:false,
                message:err.issues.map(error => error.message)
            })
        }
        return res.status(500).send({message:"Une erreure est survenue lors d'ajouter le commentaire",success:false,err})
    }
});

{/*********************** Patch COMMENTAIRE   ***********************/}
router.patch('/patch-videos-commetaire/:videoId/:commentsId',authMidllewares,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const {videoId,commentsId} = req.params;
        const {text} = req.body;
        const videos = await VideosModel.findById(videoId);
        if(!videos){
            return res.status(404).send({message:"Aucune videos est trouver",success:false})
        }
        const comments = videos.comments.find(c => c._id.toString() === commentsId);
        if(!comments){
            return res.status(404).send({message:"Aucun commentaire est trouver",success:false})
        }
        if(comments.user._id.toString() !== userId){
            return res.status(403).json({
                message: "Vous n'êtes pas autorisé à modifier ce commentaire",
                success: false,
            });
        }
        comments.text = text;
        await videos.save()
        return res.status(200).json({message: "Commentaire modifié avec succès",success: true,comments});
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue lors de modification du commentaire",success:false,err})
    }
    
});

{/*********************** POST LIKE DU COMMENTAIRE   ***********************/}
router.post('/post-videos-likes-commentaire/:videoId/:commentsId',authMidllewares,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const {videoId,commentsId} = req.params;
        const videos = await VideosModel.findById(videoId);
        if(!videos){
            return res.status(404).send({message:"Aucune videos est trouver",success:false})
        }
        const comments = videos.comments.find(c => c._id.toString() === commentsId);
        if(!comments.likes.includes(userId)){
            comments.likes.push(userId)
        }else{
            comments.likes.pull(userId)
        }
        await videos.save();
        res.json({success:true,likesCommentaireCount:comments.likes.length,videos})
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue lors d'ajouter le commentaire",success:false,err})
    }
});

{/*********************** POST REPLY DU COMMENTAIRE   ***********************/}
router.post('/post-videos-reply-commentaires/:videoId/:commentsId',authMidllewares,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const {videoId,commentsId}=req.params;
        const {text} = req.body;
        const videos = await VideosModel.findById(videoId);
        if(!videos){
            return res.status(404).send({message:"Aucune videos est trouver",success:false})
        }
        const comments = videos.comments.find(c => c._id.toString() === commentsId);
        if(!comments){
            return res.status(404).send({message:"Aucun commentaires est trouver",success:false})
        }
        comments.replies.push({
            user:userId,
            text,
            createdAt:Date.now()
        })
        await videos.save();
        res.status(200).send({
            success:true,
            videos
        })
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue lors de repondre a un commentaire",success:false,err})
    }
});

{/*********************** POST LIKE DU REPLY DU COMMENTAIRE   ***********************/}
router.post('/post-videos-likes-reply/:videoId/:replyId/like/reply',authMidllewares,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const {videoId,replyId} = req.params;
        const videos = await VideosModel.findById(videoId);
        if(!videos){
            return res.status(404).send({message:"Aucune videos est disponible",success:false})
        }
        const comments = videos.comments.find(c => c.replies.some(r => r._id.toString() === replyId));        
        if(!comments){
            return res.status(404).send({message:"Aucun commentaire est trouver",success:false})
        }
        const reply = comments.replies.find(c => c._id.toString() === replyId);
        if(!reply.likes.includes(userId)){
            reply.likes.push(userId)
        }else{
            reply.likes.pull(userId)
        }
        await videos.save();
        res.status(200).json({
            success:true,
            ReplylikesCount:reply.likes.length,
            videos
        })
    }catch(err){
        return res.status(500).send({messsage:"Une erreure est survenue lors de liker la videos",success:false,err})
    }
});

{/*********************** PATCH REPLY DU COMMENTAIRE   ***********************/}
router.patch('/patch-videos-reply-comments/:videoId/:replyId',authMidllewares,async(req,res)=>{
    const userId = req.user.userId;
    const {videoId,replyId} = req.params;
    const {text} = req.body;
    const videos = await VideosModel.findById(videoId);
    if(!videos){
        return res.status(404).send({messsage:"Aucune videos est trouver",success:false})
    }
    const comments = videos.comments.find(c => c.replies.some(r => r._id.toString() === replyId));
    if(!comments){
        return res.status(404).send({messsage:"Aucune Commentaire est trouver",success:false})
    }
    const replies = comments.replies.find(c => c._id.toString() === replyId);

    if(replies.user._id.toString() !== userId){
        res.status(403).send({success:false,message: "Vous n'êtes pas autorisé à modifier ce commentaire"})
    }

    replies.text = text
    await videos.save();
    res.status(200).send({success:true,message:"votre commentaire a ete modifer avec success"})
    
});




module.exports = router