const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next)=>{
    const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(401).send({message: "⛔ Accès refusé : Token manquant",success: false});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded;
        next();
    }catch(err){
        return res.status(403).send({message: "❌ Token invalide ou expiré",success: false,error: err.message});
    }
}

module.exports = authMiddleware
