const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const authMiddleware = async (req,res,next)=>{
    const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).send({message: "⛔ Accès refusé : Token manquant",success: false});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select("blockedUntil");
        if (!user) {
          return res.status(401).send({ message: "Utilisateur introuvable", success: false });
        }
        if (user.blockedUntil && user.blockedUntil > new Date()) {
          return res.status(403).send({
            message: "Votre compte est temporairement bloqué",
            success: false,
            blockedUntil: user.blockedUntil,
          });
        }
        req.user = decoded;
        next();
    }catch(err){
        return res.status(403).send({message: "❌ Token invalide ou expiré",success: false,error: err.message});
    }
}

module.exports = authMiddleware
