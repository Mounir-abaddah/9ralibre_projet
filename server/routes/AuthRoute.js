const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const passport = require('passport')
const {registerShema , loginSchema , messageOUblierSchema,passwordResetShema} = require('../validations/authValidation');


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
            accountVerified:false
        })
        await newUser.save();
        const verifiedToken = jwt.sign({userId:newUser._id , type:"verifyEmail"},process.env.JWT_SECRET,{expiresIn:"1h"});
        const accountVerifiedUrl = `${process.env.FRONTEND_URL}/inscription/confirm-email/${verifiedToken}`;

        var transporter = nodemailer.createTransport({
            service : 'GMAIL',
            auth : {
                user:process.env.EMAIL_CLIENT,
                pass:process.env.PASSWORD_CLIENT
            }
        })
        var mailOption = {
            from : process.env.EMAIL_CLIENT,
            to:registerValidation.email,
            html: `<!DOCTYPE html>
                <html lang="fr">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Vérification du compte</title>
                </head>
                <body style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0; height: 100vh; display: flex; align-items: center;">
                <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <tr>
                    <td style="background-color: #FEBA27; padding: 20px; text-align: center; color: #3F3F3F; font-size: 24px; font-weight: bold;">
                        🔐 Vérification du compte
                    </td>
                    </tr>
                    <tr>
                    <td style="padding: 30px; color: #333333;">
                        <p style="font-size: 18px;">Bonjour ${newUser.nom} ${newUser.prenom},</p>
                        <p style="font-size: 16px; line-height: 1.5;">
                        Merci de vous être inscrit sur <strong>9ralibre</strong> 🎉.<br>
                        Afin d'activer votre compte, veuillez confirmer votre adresse email en cliquant sur le bouton ci-dessous :
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                        <a href="${accountVerifiedUrl}" 
                            style="background-color: #0ea5e9; color: #ffffff; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
                            Confirmer mon adresse email
                        </a>
                        </div>
                        <p style="font-size: 14px; color: #666666;">
                        ⚠️ Ce lien expirera dans 1 heure pour des raisons de sécurité.
                        </p>
                        <p style="font-size: 14px; color: #666666;">
                        Si vous n'avez pas créé de compte, ignorez simplement cet email.
                        </p>
                    </td>
                    </tr>
                    <tr>
                    <td style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
                        © ${new Date().getFullYear()} 9ralibre. Tous droits réservés.
                    </td>
                    </tr>
                </table>
                </body>
                </html>`
            }
            transporter.sendMail(mailOption, function(error, info){
            if(error){
                console.log(error);
                return res.status(400).send({ message: "Compte créé, mais erreur lors de l'envoi de l'email de vérification", success: false });
            }
            return res.status(200).send({ message: "Lien de comfirmation d'email  envoyé", success: true });
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
        return res.status(400).send({message:"Une erreure est survenue",success:false})
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
        return res.status(200).send({message: "Connexion réussie",success: true,});
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
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{
            expiresIn : "30m"
        })
        const resetLink = `${process.env.FRONTEND_URL}/password/reset/${token}`
        var transporter = nodemailer.createTransport({
            service : 'GMAIL',
            auth : {
                user:process.env.EMAIL_CLIENT,
                pass:process.env.PASSWORD_CLIENT
            }
        })
        var mailOption = {
            from : process.env.EMAIL_CLIENT,
            to:validationOublierPassword.email,
            html:`<!DOCTYPE html>
                        <html lang="fr">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                            <title>Réinitialisation de mot de passe</title>
                        </head>
                        <body style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0; height: 100vh; display: flex; align-items: center;">
                        <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <tr>
                            <td style="background-color: #FEBA27; padding: 20px; text-align: center; color: #3F3F3F; font-size: 24px; font-weight: bold;">
                                🔐 Réinitialisation de mot de passe
                            </td>
                            </tr>
                            <tr>
                            <td style="padding: 30px; color: #333333;">
                                <p style="font-size: 18px;">Bonjour,</p>
                                <p style="font-size: 16px; line-height: 1.5;">
                                Vous avez demandé à réinitialiser votre mot de passe.  
                                Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe :
                                </p>
                                <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetLink}" 
                                    style="background-color: #0ea5e9; color: #ffffff; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
                                    Réinitialiser mon mot de passe
                                </a>
                                </div>
                                <p style="font-size: 14px; color: #666666;">
                                ⚠️ Ce lien expirera dans 30 minute pour des raisons de sécurité.
                                </p>
                                <p style="font-size: 14px; color: #666666;">
                                Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.
                                </p>
                            </td>
                            </tr>
                            <tr>
                            <td style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
                                © ${new Date().getFullYear()} 9ralibre. Tous droits réservés.
                            </td>
                            </tr>
                        </table>
                        </body>

                        </html>`
        }
        transporter.sendMail(mailOption, function(error, info){
        if(error){
            return console.log(error);
        }
         return res.status(200).send({ message: "Lien de réinitialisation envoyé", success: true });
        });
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
  function(req, res) {
    const user = req.user;
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn : "1d"});
    res.cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict"
    })
    res.redirect(`${process.env.FRONTEND_URL}/Dashboard`);
  });
  


module.exports = router