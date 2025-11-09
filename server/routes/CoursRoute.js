const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/UserModel')
const Niveaux = require('../models/NiveauxModel');
const Matiere = require('../models/MatiereModel');
const Cours = require('../models/CoursModel');


router.get("/getCours/:niveauxNom", authMiddleware, async (req, res) => {
  try {
    const { niveauxNom } = req.params;

    const { matiere, semestre, type, filiere, search } = req.query;
  
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const niveau = await Niveaux.findOne({ nom: niveauxNom });
    if (!niveau) {
      return res.status(404).json({ success: false, message: "Niveau non trouvé" });
    }

    let matiereQuery = { niveaux: niveau._id }; 
    if (matiere) {
      matiereQuery.nom = matiere;
    }
    const matieres = await Matiere.find(matiereQuery);
    const matiereIds = matieres.map(m => m._id);

    if (matiereIds.length === 0) {
      return res.json({ success: true, totalCours: 0, totalPages: 0, cours: [] });
    }

    const queryObject = { matiere: { $in: matiereIds } };

    if (semestre) queryObject.semestre = semestre;
    if (type) queryObject.type = type;
    if (filiere) queryObject.filière = filiere;

    if (search) {
      const searchRegex = new RegExp(search, 'i');

      const matchingMatieres = await Matiere.find({ 
        nom: searchRegex, 
        niveaux: niveau._id 
      });
      const matchingMatiereIds = matchingMatieres.map(m => m._id);

      queryObject.$or = [
        { title: searchRegex },
        { professeur: searchRegex },
        { semestre: searchRegex },
        { matiere: { $in: matchingMatiereIds } }
      ];
    }

    const totalCours = await Cours.countDocuments(queryObject); 
    
    const cours = await Cours.find(queryObject)
      .populate({
        path: "matiere",
        populate: {
          path: "niveaux",
          model: "Niveaux"
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      totalCours,
      limit,
      skip,
      totalPages: Math.ceil(totalCours / limit),
      cours
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des cours", error: err.message });
  }
});

router.post("/addCours", async (req, res) => {
  try {
    const { matiere, semestre, type, filiere, professeur, title, pdfUrl } = req.body;
    
    if (!matiere || !semestre || !type || !filiere || !professeur || !title || !pdfUrl) {
      return res.status(400).json({ success: false, message: "Champs obligatoires manquants" });
    }

    const newCours = new Cours({
      matiere,
      semestre,
      type,
      filière: filiere,
      professeur,
      title,
      pdfUrl
    });

    await newCours.save();

    res.status(201).json({ success: true, message: "Cours ajouté avec succès", cours: newCours });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});





module.exports = router