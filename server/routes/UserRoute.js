const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs')
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const fs = require('fs');
const path = require('path')
const {completeProfileShema , EventsShema} = require('../validations/authValidation');

router.get('/profile',authMiddleware,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const user = await User.findById(userId)
        if(!user){
            return res.status(400).json({message:"Échec de l'opération",success:false})
        }
        const saveViewUser = {
            id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            role: user.role,
            niveaux:user.niveaux,
            provider:user.provider,
            image:user.image,
            accountVerified: user.accountVerified,
            completeProfile:user.completeProfile
        }
        return res.status(200).json({user:saveViewUser,success:true});
    }catch(err){
        return res.status(500).json({ message: "Une erreur est survenue", success: false, err });
    }
})


const storage =  multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.user.userId; 
        const uploadPath = path.join('./uploads/images/',userId.toString());
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({ storage: storage });

router.post('/uploadImage',authMiddleware,upload.single('avatar'),async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).send({message:"Aucun fichier n’a été téléchargé",sucess:false})
        }
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).send({message:"Échec de l'opération",success:false})
        }
        user.image = req.file.originalname;
        await user.save();
        return res.status(200).send({message:"Image importée avec succès",image:user.image,success:true})
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue",success:false,err})
    }
})


router.get('/importImage',authMiddleware,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).send({message:"Échec de l'opération",success:false})
        }
        if(!user.image){
            return res.status(200).send({message:"Aucune image à importer",success:false})
        }
        return res.status(200).json({image:user.image,message:"Image importée avec succès",success:true})
    }catch(err){
        return res.status(500).send({message:"Une erreur est survenue lors de l’import de l’image",success:false,err})
    }
})

router.delete('/deleteImage',authMiddleware,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).send({message:"Échec de l'opération",success:false})
        }
        if (!user.image) {
            return res.status(400).send({ message: "Aucune image à supprimer", success: false });
        }
        const imagePath = path.join(`./uploads/images/${userId.toString()}`,user.image);
        
        fs.unlink(imagePath,(err)=>{
            if(err){
                return res.status(500).send({ message: "Erreur lors de la suppression du fichier", success: false,err });
            }
        })
        user.image = "";
        await user.save();
        return res.status(200).send({ message: "Image supprimée avec succès", success: true });
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue",success:false,err})
    }
})



router.patch('/completeProfile',authMiddleware,upload.single('avatar'),async(req,res)=>{
    try{
        const userId = req.user.userId;
        const completeProfile = completeProfileShema.parse(req.body);
        const { nom, prenom, role, password,niveaux} = completeProfile; 
        const user = await User.findById(userId);        
        if(!user || !user.accountVerified){
            return res.status(400).send({message:"Échec de l'opération",success:false})
        }
        if(user.completeProfile){
            return res.status(400).send({message: "Le profil a déjà été complété.",success:false})
        }
        if (nom) user.nom = nom;
        if (prenom) user.prenom = prenom;
        if (role) user.role = role;
        if(niveaux) user.niveaux = niveaux;
        if(user.provider === "google"){
            if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        }
        if (req.file) {
            user.image = req.file.filename;
        }
        user.completeProfile = true
        await user.save();
        return res.status(200).send({ message: "Profil complété avec succès",user:{niveaux:user.niveaux}, success: true });
    }catch(err){
        if (req.file) {
            const imagePath = path.join(`./uploads/images/${req.user.userId}`, req.file.filename);
            fs.unlink(imagePath, (err) => {
                if (err) console.log("Erreur suppression fichier:", err);
            });
        }
        if (err.name === "ZodError") {
        return res.status(400).send({
            success: false,
            message: err.issues.map(e => e.message)
        });
        }
        return res.status(500).send({ message: "Une erreur est survenue", success: false });
    }
})


router.get('/getEvenements',authMiddleware,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).send({message:"Impossible de récupérer les événements pour cet utilisateur.",success:false})
        }
        return res.status(200).send({events:user.events,success:true})
    }catch(err){
        return res.status(500).send({message:"Une erreur interne est survenue. Veuillez réessayer plus tard",success:false,err})
    }
})

router.post('/postEvents',authMiddleware,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const EventsShemaValidation = EventsShema.parse(req.body)
        const user = await User.findByIdAndUpdate(userId,{
            $push:{
                events:{
                    Date: EventsShemaValidation.Date,
                    type: EventsShemaValidation.type,
                    titre: EventsShemaValidation.titre,
                    Description: EventsShemaValidation.Description
                }
            }
        },{
            new:true,
            runValidators:true
        })
        if(!user){
            return res.status(400).send({message:"Impossible d'ajouter l'événement. Veuillez réessayer.",success:false})
        }
        await user.save();
        return res.status(200).send({message:"Événement ajouté avec succès.",success:true})
    }catch(err){
        if (err.name === "ZodError") {
        return res.status(400).send({
            success: false,
            message: err.issues.map(e => e.message)
        });
        }
        return res.status(500).send({message:"Une erreur est survenue",success:false,err})
    }
})

router.delete('/deleteEvents/:eventId',authMiddleware,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const eventId = req.params.eventId;
        const user = await User.findByIdAndUpdate(userId,{$pull:{events:{_id:eventId}}},{new:true})
        if(!user){
            return res.status(400).send({message:"Impossible de supprimer l'événement. Veuillez réessayer.",success:false})
        }
        return res.status(200).send({message:"Événement supprimé avec succès.",success:true})
    }catch(err){
        return res.status(500).send({message:"Une erreur interne est survenue lors de la suppression de l'événement.",success:false,err})
    }
})

module.exports = router