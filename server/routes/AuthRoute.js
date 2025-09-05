const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');


router.post('/register',async(req,res)=>{
    try{
        const emailExists = await User.findOne({email:req.body.email})
        if(emailExists){
            return res.status(400).send({message:'Email exists deja',success:false})
        }
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const newUser = new User({
            nom : req.body.nom,
            prenom : req.body.prenom,
            type : req.body.type,
            email : req.body.email,
            password : hashedPassword,
        })
        await newUser.save();
        return res.status(200).send({ message: "Votre compte a ete bien creer", success: true });
    }catch(err){
        res.status(400).send({message:'Une erreure est survenue',success:false})
    }
})

module.exports = router