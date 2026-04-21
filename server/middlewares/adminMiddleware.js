const User = require('../models/UserModel');

const ensureAdmin = async (req, res, next) => {
  try {
    const admin = await User.findById(req.user.userId).select("role");
    if (!admin || admin.role !== "Admin") {
      return res.status(403).json({ success: false, message: "Accès admin requis" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: "Erreur serveur", err });
  }
};

module.exports = ensureAdmin;
