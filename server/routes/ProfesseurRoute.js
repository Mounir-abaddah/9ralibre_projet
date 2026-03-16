const express = require('express');
const router = express.Router();
const authMiddlewares = require('../middlewares/authMiddleware');
const profMiddleware = require('../middlewares/profMiddleware');
const Cours = require("../models/CoursModel");
const User = require('../models/UserModel');
const Quiz = require('../models/QuizModel');
const Videos = require('../models/VideosModel');

router.post("/addCours",authMiddlewares, profMiddleware, async (req, res) => {
    try {
        const { matiere, semestre, type, filiere, professeur, title, pdfUrl } = req.body;
        if (!matiere || !semestre || !type || !filiere || !professeur || !title || !pdfUrl) {
            return res.status(400).json({ success: false, message: "Champs obligatoires manquants" });
        }
        const newCours = new Cours({
            matiere,
            semestre,
            type,
            filière: filiere,
            professeur,
            title,
            pdfUrl,
        });
        await newCours.save();
        res.status(201).json({success: true,message: "Cours ajouté avec succès",cours: newCours});
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/profile',authMiddlewares,profMiddleware,async(req,res)=>{
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        const quiz = await Quiz.countDocuments({professeur:user._id});
        const videos = await Videos.countDocuments({professeur:user._id});
        if (!user) {
            return res.status(400).json({ message: "Échec de l'opération", success: false });
        }
        const saveViewUser = {
            id: user._id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            image: user.image,
            completeProfile: user.completeProfile,
            followers:user.followers,
        };
        return res.status(200).json({ user: saveViewUser, success: true , quiz , videos});
    } catch (err) {
        return res.status(500).json({ message: "Une erreur est survenue", success: false, err });
    }
})



module.exports = router;