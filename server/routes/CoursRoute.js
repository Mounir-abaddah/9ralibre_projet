const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/UserModel");
const Niveaux = require("../models/NiveauxModel");
const Matiere = require("../models/MatiereModel");
const Cours = require("../models/CoursModel");

router.get("/getCours/:niveauxNom", authMiddleware, async (req, res) => {
  try {
    const { niveauxNom } = req.params;

    const { matiere, semestre, type, filiere, search } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const niveau = await Niveaux.findOne({ nom: niveauxNom });
    if (!niveau) {
      return res
        .status(404)
        .json({ success: false, message: "Niveau non trouvé" });
    }

    let matiereQuery = { niveaux: niveau._id };
    if (matiere) {
      matiereQuery.nom = matiere;
    }
    const matieres = await Matiere.find(matiereQuery);
    const matiereIds = matieres.map((m) => m._id);

    if (matiereIds.length === 0) {
      return res.json({
        success: true,
        totalCours: 0,
        totalPages: 0,
        cours: [],
      });
    }

    const queryObject = { matiere: { $in: matiereIds } };

    if (semestre) queryObject.semestre = semestre;
    if (type) queryObject.type = type;
    if (filiere) queryObject.filière = filiere;

    if (search) {
      const searchWords = search.split(" ");

      const matchingMatieres = await Matiere.find({
        niveaux: niveau._id,
        nom: new RegExp(search, "i"),
      });
      const matchingMatiereIds = matchingMatieres.map((m) => m._id);

      const matchingProfs = await User.find({
        role: "Professeur",
        $and: searchWords.map((word) => ({
          $or: [
            { nom: new RegExp(word, "i") },
            { prenom: new RegExp(word, "i") },
          ],
        })),
      });
      const matchingProfIds = matchingProfs.map((p) => p._id);

      queryObject.$or = [
        { title: new RegExp(search, "i") },
        { professeur: { $in: matchingProfIds } },
        { semestre: new RegExp(search, "i") },
        { matiere: { $in: matchingMatiereIds } },
      ];
    }

    const totalCours = await Cours.countDocuments(queryObject);

    const cours = await Cours.find(queryObject)
      .populate({
        path: "matiere",
        populate: {
          path: "niveaux",
          model: "Niveaux",
        },
      })
      .populate("professeur", "nom prenom role image email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      totalCours,
      limit,
      skip,
      totalPages: Math.ceil(totalCours / limit),
      cours,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur lors de la récupération des cours",
        error: err.message,
      });
  }
});

router.post("/addCours", async (req, res) => {
  try {
    const { matiere, semestre, type, filiere, professeur, title, pdfUrl } =
      req.body;

    if (
      !matiere ||
      !semestre ||
      !type ||
      !filiere ||
      !professeur ||
      !title ||
      !pdfUrl
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Champs obligatoires manquants" });
    }

    const newCours = new Cours({
      matiere,
      semestre,
      type,
      filière: filiere,
      professeur,
      title,
      pdfUrl,
    });

    await newCours.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Cours ajouté avec succès",
        cours: newCours,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

{
  /*********************** POST SAVE COURS ET UNSAVE IT ***********************/
}
router.post("/save-cours/:coursId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { coursId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ message: "Utilisateur non trouvé", success: false });
    }

    // Vérifier si le cours est déjà sauvegardé
    const isSaved = user.savedCours.some((id) => id.toString() === coursId);

    if (!isSaved) {
      user.savedCours.push(coursId);
    } else {
      user.savedCours = user.savedCours.filter(
        (id) => id.toString() !== coursId,
      );
    }

    await user.save();

    // Vérifier le nouvel état après sauvegarde
    const newIsSaved = user.savedCours.some((id) => id.toString() === coursId);

    return res.status(200).send({
      success: true,
      isSaved: newIsSaved,
      message: newIsSaved
        ? "Cours enregistré"
        : "Cours supprimé des enregistrements",
    });
  } catch (err) {
    console.error("Erreur save cours:", err);
    return res
      .status(500)
      .send({
        message: "Une erreur est survenue lors de l'enregistrement du cours",
        success: false,
        err,
      });
  }
});

{
  /*********************** GET ALL SAVED COURS***********************/
}
router.get("/get-saved-cours", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    let { page = 1, limit = 6 } = req.query;
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .send({ message: "Utilisateur non trouvé", success: false });
    }

    const totalSaved = user.savedCours.length;

    // Récupérer les IDs avec pagination
    const savedCoursIds = user.savedCours.slice(skip, skip + limit);

    // Ensuite, populate les détails des cours
    const populatedUser = await User.findById(userId).populate({
      path: "savedCours",
      match: { _id: { $in: savedCoursIds } },
      populate: [
        { path: "professeur", select: "nom prenom image" },
        { path: "matiere", select: "nom" },
      ],
    });

    return res.status(200).send({
      success: true,
      page,
      limit,
      totalSaved,
      totalPages: Math.ceil(totalSaved / limit),
      savedCours: populatedUser.savedCours,
    });
  } catch (err) {
    console.error("Erreur get saved cours:", err);
    return res
      .status(500)
      .send({
        message:
          "Une erreur est survenue lors de la récupération des cours enregistrés",
        success: false,
        err,
      });
  }
});

module.exports = router;
