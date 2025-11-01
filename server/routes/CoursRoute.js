const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/UserModel')
const Niveaux = require('../models/NiveauxModel');
const Matiere = require('../models/MatiereModel');
const Cours = require('../models/CoursModel');

router.get("/getCours/:niveauNom", authMiddleware, async (req, res) => {
  try {
    const { niveauNom } = req.params;

    const niveau = await Niveaux.findOne({ nom: niveauNom });
    if (!niveau) {
      return res.status(404).json({ success: false, message: "Niveau non trouvé" });
    }
    const matieres = await Matiere.find({ niveaux: niveau._id });
    const matiereIds = matieres.map(m => m._id);
    const cours = await Cours.find({ matiere: { $in: matiereIds } })
      .populate({
        path: "matiere",
        populate: {
          path: "niveaux",
          model: "Niveaux"
        }
      });
    return res.json({ success: true, cours });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des cours",error: err.message});
  }
});



module.exports = router