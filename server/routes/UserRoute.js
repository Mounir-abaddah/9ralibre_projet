const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const authMiddleware = require('../middlewares/authMiddleware')

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

module.exports = router