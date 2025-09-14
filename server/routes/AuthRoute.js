const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const {registerShema , loginSchema} = require('../validations/authValidation');
const jwt = require('jsonwebtoken');


router.post('/register',async(req,res)=>{
    try{
        const registerValidation = registerShema.parse(req.body)
        const emailExists = await User.findOne({email:registerValidation.email})
        if(emailExists){
            return res.status(400).send({message:'Impossible de créer un compte avec ces informations',success:false})
        }
        const hashedPassword = await bcrypt.hash(registerValidation.password,10);
        const newUser = new User({
            nom : registerValidation.nom,
            prenom : registerValidation.prenom,
            type : registerValidation.type,
            email : registerValidation.email,
            password : hashedPassword,
        })
        await newUser.save();
        return res.status(200).send({ message: "Votre compte a été créé avec succès !", success: true });
    }catch(err){
        if(err.name === "ZodError"){
            return res.status(400).send({
                message:"Validation échouée",
                success:false,
                error:err.issues.map(e => e.message)
            })
        }
        res.status(500).send({message:'Une erreure est survenue',success:false})
    }
})


router.post('/connexion',async(req,res)=>{
    try{
        const {email,password} = loginSchema.parse(req.body);
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).send({message:"Authfailed",success:false})
        }
        const passwordMatch = await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            return res.status(400).send({message:"Mot de passe incorecte",success:false})
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
        return res.status(200).send({message: "Connexion réussie",success: true,});
  }catch(err){
        if(err.name === "ZodError"){
            return res.status(400).send({
                message:"Validation échouée",
                success:false,
                error:err.issues.map(e => e.message)
            })
        }
        res.status(500).send({message:'Une erreure est survenue',success:false})
    }
})

module.exports = router