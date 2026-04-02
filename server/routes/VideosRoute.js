const express = require('express');
const router = express.Router();
const VideosModel = require('../models/VideosModel');
const NiveauxModel = require('../models/NiveauxModel');
const MatiereModel = require('../models/MatiereModel');
const UserModel = require('../models/UserModel');
const {VideoShema,CommentsShema} = require('../validations/authValidation');
const authMidllewares = require('../middlewares/authMiddleware');
const {repliesCommentaire,likeCommentaire} = require('../services/emailServices')


{/*********************** Get all videos par le Nom ***********************/}
router.get('/get-all-videos/:nameNiveaux',authMidllewares,async(req,res)=>{
    try{
    const {nameNiveaux} = req.params;
    let { page = 1, limit = 15, matiere, title, filiere , search } = req.query;
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1)* limit;
    const niveaux = await NiveauxModel.findOne({nom:nameNiveaux});
    if(!niveaux){
        return res.status(400).send({message:"aucune niveaux est disponible",success:false})
    }
    const objectSearch = {
        niveaux:niveaux._id,
        visibility: 'Public'
    };

    // Si on fournit un filtre `matiere` (nom ou portion), on recherche les IDs correspondants
    if (matiere){
        const matieresFound = await MatiereModel.find({ nom: new RegExp(matiere, 'i') }).select('_id');
        const matieresIds = matieresFound.map(m => m._id);
        objectSearch.matiere = { $in: matieresIds };
    }

    if (title) objectSearch.title = new RegExp(title, 'i');
    if (filiere) objectSearch.filiere = new RegExp(filiere, 'i');

    // `search` : on cherche dans le title / filiere et aussi dans le nom de la matiere
    if (search){
        const matieresMatch = await MatiereModel.find({ nom: new RegExp(search, 'i') }).select('_id');
        const matieresMatchIds = matieresMatch.map(m => m._id);
        objectSearch.$or = [
            { title: new RegExp(search, 'i') },
            { filiere: new RegExp(search, 'i') },
        ];
        if (matieresMatchIds.length) objectSearch.$or.push({ matiere: { $in: matieresMatchIds } });
    }
    const [videos,totalVideos] = await Promise.all([
        VideosModel.find(objectSearch)
        .populate("matiere")
        .populate("professeur","nom prenom image")
        .select("title thumbnail professeur views createdAt filiere matiere")
        .skip(skip)
        .limit(limit).sort({createdAt:-1}),
        VideosModel.countDocuments(objectSearch)
    ])
    res.status(200).json({
        success:true,
        page,
        limit,
        totalVideos,
        totalPages:Math.ceil(totalVideos / limit),
        videos
    })
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
        .populate("professeur","nom prenom email image following followers")
        .populate("niveaux","nom")
        .populate("matiere","nom")
        .populate("comments.user","nom prenom role image")
        .populate("comments.replies.user","nom prenom role image")
        if(!videos){
            return res.status(404).send({message:"Aucune videos est trouver d'apres ce Id",success:false})
        }
        const user = await UserModel.findById(userId);
        const likes = videos.likes.some(c => c._id.toString() === userId);
        const isFollowProfesseur = videos.professeur.followers.some(c => c._id.toString() === userId);
        const isSaved = user.savedVideos.some(id => id.toString() === videoId);
        return res.status(200).send({
            success:true,
            likesCount:videos.likes.length,
            isLikes:likes,
            isSaved,
            isFollowProfesseur,
            viewsCount:videos.views,
            videos
        })
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue lors de recuperation de video",success:false,err})
    }
});

{/*********************** GET RELATED VIDEOS***********************/}
router.get('/related/:videoId',async(req,res)=>{
    const {videoId} = req.params
    const videos = await VideosModel.findById(videoId);
    if(!videos){
        return res.status(400).send({message:"Aucune videos est disponible",success:false})
    }
    const relatedVideos = await VideosModel.find({
        /************ Prends toutes les vidéos SAUF celle dont l’id est videoId*************** */
        _id: { $ne: videoId },
        niveaux: videos.niveaux,
        matiere: videos.matiere,
    }).populate("professeur", "nom prenom image")
    .populate("matiere", "nom")
    .select("title thumbnail professeur views createdAt filiere matiere");

    res.status(200).json({success: true,videos: relatedVideos});
})

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

{/*********************** POST SAVE VIDEO ET UNSAVE IT ***********************/}
router.post('/post-videos-save/:videoId',authMidllewares,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const {videoId} = req.params;
        const user = await UserModel.findById(userId);
        if(!user){
            return res.status(404).send({message:"Utilisateur non trouvé",success:false})
        }
        
        // Vérifier si la vidéo est déjà sauvegardée
        const isSaved = user.savedVideos.some(id => id.toString() === videoId);
        
        if(!isSaved){
            user.savedVideos.push(videoId);
        }else{
            user.savedVideos = user.savedVideos.filter(id => id.toString() !== videoId);
        }
        
        await user.save();
        
        // Vérifier le nouvel état après sauvegarde
        const newIsSaved = user.savedVideos.some(id => id.toString() === videoId);
        
        return res.status(200).send({
            success:true,
            isSaved: newIsSaved,
            message: newIsSaved ? "Vidéo enregistrée" : "Vidéo supprimée des enregistrements"
        })
    }catch(err){
        console.error("Erreur save video:", err);
        return res.status(500).send({message:"Une erreur est survenue lors de l'enregistrement de la vidéo",success:false,err})
    }
});

{/*********************** GET ALL SAVED VIDEOS***********************/}
router.get('/get-saved-videos',authMidllewares,async(req,res)=>{
    try{
        const userId = req.user.userId;
        let { page = 1, limit = 12 } = req.query;
        page = Number(page);
        limit = Number(limit);
        const skip = (page - 1) * limit;
        
        const user = await UserModel.findById(userId);
        
        if(!user){
            return res.status(404).send({message:"Utilisateur non trouvé",success:false})
        }

        const totalSaved = user.savedVideos.length;
        
        // Récupérer les IDs avec pagination
        const savedVideoIds = user.savedVideos.slice(skip, skip + limit);
        
        // Ensuite, populate les détails des vidéos
        const populatedUser = await UserModel.findById(userId).populate({
            path: 'savedVideos',
            match: { _id: { $in: savedVideoIds } },
            populate: [
                { path: 'professeur', select: 'nom prenom image' },
                { path: 'matiere', select: 'nom' }
            ]
        });
        
        return res.status(200).send({
            success:true,
            page,
            limit,
            totalSaved,
            totalPages: Math.ceil(totalSaved / limit),
            savedVideos: populatedUser.savedVideos
        })
    }catch(err){
        console.error("Erreur get saved videos:", err);
        return res.status(500).send({message:"Une erreur est survenue lors de la récupération des vidéos enregistrées",success:false,err})
    }
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

{/*********************** Delete COMMENTAIRE   ***********************/}
router.delete('/delete-videos-commentaire/:videoId/:commentsId',authMidllewares,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const {videoId,commentsId} = req.params;
        const videos = await VideosModel.findById(videoId);
        if(!videos){
            return res.status(404).send({message:"Aucune videos est trouver",success:false})
        }
        const comments = videos.comments.id(commentsId)    
        if(!comments){
            return res.status(404).send({message:"Aucun Commentaire est trouver",success:false})
        }
        if(comments.user.toString() !== userId){
            return res.status(404).send({message:"Vous n'êtes pas autorisé à modifier ce commentaire",success:false})
        }
        videos.comments = videos.comments.filter(c => c._id.toString() !== commentsId);
        await videos.save();
        return res.status(200).send({message:"Commentaire suprimer avec success",success:true})
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue lors de suprimation du commentaire",success:false,err})
    }
})

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
            if(comments.user._id.toString() !== userId){
                const commentsOwner = await UserModel.findById(comments.user._id);
                const user = await UserModel.findById(userId);
                await likeCommentaire(commentsOwner,user,videos.title,comments.text,videos.videoUrl)
            }
            comments.likes.push(userId)
        }else{
            comments.likes.pull(userId)
        }
        await videos.save();
        res.json({success:true,likesCommentaireCount:comments.likes.length,isLiked:comments.likes.includes(userId),videos})
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue lors d'ajouter le commentaire",success:false,err})
    }
});

{/*********************** POST REPLY DU COMMENTAIRE   ***********************/}
router.post('/post-videos-reply-commentaires/:videoId/:commentsId',authMidllewares,async(req,res)=>{
    try{    
        const userId = req.user.userId;
        const {videoId,commentsId}=req.params;
        const {text} = CommentsShema.parse(req.body);
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
        });
        await videos.save()
        if(comments.user._id.toString() !== userId){
            const user = await UserModel.findById(userId);
            const commentsOwner = await UserModel.findById(comments.user._id);
            const replies = comments.replies[comments.replies.length - 1];
            console.log(replies);
            await repliesCommentaire(user,commentsOwner,videos.title,comments.text,replies.text,videos.videoUrl)
        }
        res.status(200).send({
            success:true,
            videos
        })
    }catch(err){
    return res.status(500).send({
        success: false,
        message: "Erreur lors de la réponse au commentaire",
        err
    });
}});

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
    try{
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
            return res.status(403).send({success:false,message: "Vous n'êtes pas autorisé à modifier ce commentaire"})
        }

        replies.text = text
        await videos.save();
        return  res.status(200).send({success:true,message:"votre commentaire a ete modifer avec success"})
    }catch(err){
        return  res.status(500).send({success:false,message:"Une erreure est survenue lors de modifier le reply du commentaires",err})
    }
    
    
});

{/*********************** DELETE REPLY DU COMMENTAIRE   ***********************/}
router.delete('/delete-videos-reply-comments/:videoId/:replyId',authMidllewares,async(req,res)=>{
    const userId = req.user.userId;
    const {videoId,replyId} = req.params;
    const videos = await VideosModel.findById(videoId);
    if(!videos){
        return res.status(404).send({message:"Aucune videos est disponible",success:false})
    }
    const comments = videos.comments.find(c=> c.replies.some(r => r._id.toString() === replyId));
    if (!comments) {
        return res.status(404).send({success:false, message:"Commentaire non trouvé"});
    }
    const reply = comments.replies.find(c => c._id.toString() === replyId);
    if(reply.user.toString() !== userId){
        return res.status(403).send({success:false,message: "Vous n'êtes pas autorisé à modifier ce commentaire"})
    }
    comments.replies = comments.replies.filter(c => c._id.toString() !== replyId)
    await videos.save();
    return res.status(200).send({message:"reply a ete supprimer avec success",success:true})
})




module.exports = router