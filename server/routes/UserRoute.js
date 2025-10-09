const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs')
const authMiddleware = require('../middlewares/authMiddleware')
const {completeProfileShema} = require('../validations/authValidation');

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
            accountVerified: user.accountVerified
        }
        return res.status(200).json({user:saveViewUser,success:true});
    }catch(err){
        return res.status(500).json({ message: "Une erreur est survenue", success: false, err });
    }
})

router.patch('/completeProfile',authMiddleware,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const completeProfile = completeProfileShema.parse(req.body);
        const { nom, prenom, role, password } = completeProfile; 
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
        if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        }
        user.completeProfile = true
        await user.save();
        return res.status(200).send({message:"Operation reussi",success:true})
    }catch(err){
        if (err.name === "ZodError") {
        return res.status(400).send({
            success: false,
            message: err.issues.map(e => e.message)
        });
        }
        return res.status(500).send({ message: "Une erreur est survenue", success: false });
    }
})

module.exports = router