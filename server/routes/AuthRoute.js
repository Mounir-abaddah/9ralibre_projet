const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const passport = require('passport')
const {registerShema , loginSchema , messageOUblierSchema,passwordResetShema} = require('../validations/authValidation');
const { sendVerificationEmail, oublierMotdepasse } = require('../services/emailServices');


router.post('/register',async(req,res)=>{
    try{
        const registerValidation = registerShema.parse(req.body)
        const emailExists = await User.findOne({email:registerValidation.email})
        if(emailExists){
            return res.status(400).send({message:'Impossible de créer un compte avec ces informations',success:false})
        }
        const hashedPassword = await bcrypt.hash(registerValidation.password,10);
        const newUser = new User({
            email : registerValidation.email,
            password : hashedPassword,
            accountVerified:false,
            provider:"local"
        })
        await newUser.save();

        const verifiedToken = jwt.sign({userId:newUser._id , type:"verifyEmail"},process.env.JWT_SECRET,{expiresIn:"24h"});
        const accountVerifiedUrl = `${process.env.FRONTEND_URL}/inscription/confirm-email/${verifiedToken}`;
        await sendVerificationEmail(newUser,accountVerifiedUrl);
        res.status(200).send({
            message: "Lien de confirmation d'email envoyé",
            success: true,
        });
        }catch(err){
            if(err.name === "ZodError"){
                return res.status(400).send({
                    success:false,
                    message:err.issues.map(e => e.message)
                })
            }
            res.status(500).send({message:'Une erreure est survenue',success:false})
        }
});





router.get('/confirm-email/:token',async(req,res)=>{
    try{
        const {token} = req.params;
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if(!user){
            return res.status(400).send({message:"Lien invalide ou expiré ❌",success:false})
        }
        if(user.accountVerified){
            return res.status(200).send({message:"Votre compte est déjà vérifié ✅",success:true})
        }
        user.accountVerified = true;
        await user.save();
        return res.status(200).send({ success: true, message: "Compte vérifié avec succès ✅" });
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue",success:false})
    }
})

router.post('/connexion',async(req,res)=>{
    try{
        const {email,password} = loginSchema.parse(req.body);
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).send({message:"Email ou mot de passe incorrect",success:false})
        }
        if(!user.accountVerified){
            return res.status(400).send({message:"Connexion impossible, veuillez vérifier votre saisie.",success:false})
        }
        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return res.status(400).send({message:"Email ou mot de passe incorrect",success:false})
        }
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{
            expiresIn : "1d"
        });
        res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).send({message: "Connexion réussie",user:{niveaux:user.niveaux},success: true,});
  }catch(err){
        if(err.name === "ZodError"){
            return res.status(400).send({
                success:false,
                message:err.issues.map(e => e.message)
            })
        }
        res.status(500).send({message:'Une erreure est survenue',success:false})
    }
})

router.post('/oublierMotdepasse',async(req,res)=>{
    try{
        const validationOublierPassword = messageOUblierSchema.parse(req.body);
        const user = await User.findOne({email:validationOublierPassword.email})
        if(!user){
            return res.status(400).send({message:"Si un compte existe pour cet email, vous allez recevoir un email pour réinitialiser le mot de passe" , success:false})
        }
        const token = jwt.sign({userId:user._id,type:"Oublier mot de passe"},process.env.JWT_SECRET,{
            expiresIn : "30m"
        })
        const resetLink = `${process.env.FRONTEND_URL}/password/reset/${token}`
        await oublierMotdepasse(user,resetLink)
        return res.status(200).send({ message: "Si un compte existe pour cet email, vous allez recevoir un email pour réinitialiser le mot de passe", success: true });
    }catch(err){
        if(err.name === "ZodError"){
            return res.status(400).send({
                success:false,
                message:err.issues.map(e=>e.message)
            })
        }
        res.status(500).send({message:'Une erreure est survenue',success:false})
    }
})


router.put('/resetPassword/:token', async (req, res) => {
  try{
    const {token} = req.params;
    const validationOublierPassword = passwordResetShema.parse(req.body);
    let payload;
    try{
        payload = jwt.verify(token,process.env.JWT_SECRET)
    }catch (err) {
      return res.status(400).send({message: "Lien invalide ou expiré" , success: false });
    }
    const user = await User.findById(payload.userId);
    if(!user){
        return res.status(404).send({message: "Impossible de réinitialiser le mot de passe avec ce lien",success: false });
    }
    const MemeMotdepasse = await bcrypt.compare(validationOublierPassword.password,user.password);
    if(MemeMotdepasse){
       return res.status(400).send({
        message: "Impossible de réinitialiser le mot de passe avec ces informations",
        success: false,
      });
    }
    user.password = await bcrypt.hash(validationOublierPassword.password,10);
    await user.save();
    return res.status(200).send({message: "Mot de passe réinitialisé avec succès ✅",success: true});
  }catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).send({
        success: false,
        message: err.issues.map(e => e.message)
      });
    }
    console.error(err);
    res.status(500).send({ success: false, message: "Une erreur est survenue" });
  }
});


router.get('/google',passport.authenticate('google', { scope: ['profile','email'] }));

router.get('/google/callback', passport.authenticate('google', {session:false , failureRedirect: `${process.env.FRONTEND_URL}/connexion` }),
  async function(req, res) {
    const user = req.user;
    const userNiveaux = await User.findById(user)
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn : "1d"});
    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict"
    })
    if(["1AC","2AC","3AC"].includes(userNiveaux.niveaux)){
        res.redirect(`${process.env.FRONTEND_URL}/Dashboard/Collège/${userNiveaux.niveaux}`);
    }else{
        res.redirect(`${process.env.FRONTEND_URL}/Dashboard/Lycée/${userNiveaux.niveaux}`);
    }
  });
  


module.exports = router