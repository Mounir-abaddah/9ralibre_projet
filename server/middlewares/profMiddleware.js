const jwt = require("jsonwebtoken");
const User = require('../models/UserModel');

const profMiddleware = async(req,res,next)=>{
    try{
        if (!req.user.userId) {
            return res.status(401).json({ message: "⛔ Non authentifié", success: false })
        }
        const user = await User.findById(req.user.userId).select("role")
        if (!user) {
            return res.status(401).json({ message: "⛔ Utilisateur introuvable", success: false })
        }
        if (user.role !== "Professeur") {
        return res.status(403).json({ message: "🚫 Accès refusé : réservé aux professeurs", success: false })
        }
        next();
    }catch(err){
        return res.status(403).send({message: "❌ Token invalide ou expiré",success: false,error: err.message});
    }
}

module.exports = profMiddleware