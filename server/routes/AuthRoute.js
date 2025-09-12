const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const registerShema = require('../validations/authValidation');

router.post('/register',async(req,res)=>{
    try{
        const registerValidation = registerShema.registerShema.parse(req.body)
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

module.exports = router