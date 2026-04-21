const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const VideosModel = require("../models/VideosModel");
const CoursModels = require("../models/CoursModel");
const QuizModel = require("../models/QuizModel");
const ResultatQuizModel = require("../models/ResultatQuizModel");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {completeProfileShema,EventsShema} = require("../validations/authValidation");
const { sendBlockedAccountEmail, sendProfessorStatusEmail } = require("../services/emailServices");
const ModerationLog = require("../models/ModerationLogModel");
const Appeal = require("../models/AppealModel");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.userId;
    const uploadPath = path.join("./uploads/images/", userId.toString());
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "Échec de l'opération", success: false });
    }
    const saveViewUser = {
      id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      niveaux: user.niveaux,
      provider: user.provider,
      image: user.image,
      accountVerified: user.accountVerified,
      completeProfile: user.completeProfile,
      followers:user.followers,
      blockedUntil: user.blockedUntil,
      blockReason: user.blockReason,
    };
    return res.status(200).json({ user: saveViewUser, success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Une erreur est survenue", success: false, err });
  }
});

router.get("/profile/:name", authMiddleware, async (req, res) => {
  try {
    const { name } = req.params;

    // Support du format "nom-prenom" (tiret) ainsi que les espaces
    const [nom, prenom] = name.split("-");

    let user;
    if (prenom) {
      // Si le format est "nom-prenom"
      user = await User.findOne({ nom, prenom }).select("-password");
    } else {
      // Sinon chercher juste par nom
      user = await User.findOne({ nom: name }).select("-password");
    }

    if (!user) {
      return res
        .status(404)
        .json({ message: "Utilisateur non trouvé", success: false });
    }

    return res.status(200).json({ user, success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", success: false, err });
  }
});

router.post(
  "/uploadImage",
  authMiddleware,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .send({ message: "Aucun fichier n’a été téléchargé", sucess: false });
      }
      const userId = req.user.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(400)
          .send({ message: "Échec de l'opération", success: false });
      }
      user.image = req.file.originalname;
      await user.save();
      return res
        .status(200)
        .send({
          message: "Image importée avec succès",
          image: user.image,
          success: true,
        });
    } catch (err) {
      return res
        .status(500)
        .send({ message: "Une erreure est survenue", success: false, err });
    }
  },
);

router.get("/importImage", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .send({ message: "Échec de l'opération", success: false });
    }
    if (!user.image) {
      return res
        .status(200)
        .send({ message: "Aucune image à importer", success: false });
    }
    return res
      .status(200)
      .json({
        image: user.image,
        message: "Image importée avec succès",
        success: true,
      });
  } catch (err) {
    return res
      .status(500)
      .send({
        message: "Une erreur est survenue lors de l’import de l’image",
        success: false,
        err,
      });
  }
});

router.delete("/deleteImage", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .send({ message: "Échec de l'opération", success: false });
    }
    if (!user.image) {
      return res
        .status(400)
        .send({ message: "Aucune image à supprimer", success: false });
    }
    const imagePath = path.join(
      `./uploads/images/${userId.toString()}`,
      user.image,
    );

    fs.unlink(imagePath, (err) => {
      if (err) {
        return res
          .status(500)
          .send({
            message: "Erreur lors de la suppression du fichier",
            success: false,
            err,
          });
      }
    });
    user.image = "";
    await user.save();
    return res
      .status(200)
      .send({ message: "Image supprimée avec succès", success: true });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Une erreure est survenue", success: false, err });
  }
});

router.patch("/completeProfile",authMiddleware,upload.single("avatar"),async (req, res) => {
    try {
      const userId = req.user.userId;
      const completeProfile = completeProfileShema.parse(req.body);
      const { nom, prenom, role, niveaux } = completeProfile;
      const user = await User.findById(userId);
      if (!user || !user.accountVerified) {
        return res
          .status(400)
          .send({ message: "Échec de l'opération", success: false });
      }
      if (user.completeProfile) {
        return res
          .status(400)
          .send({ message: "Le profil a déjà été complété.", success: false });
      }
      if (nom) user.nom = nom;
      if (prenom) user.prenom = prenom;
      if (role) user.role = role;
      if (niveaux) user.niveaux = niveaux;
      if (req.file) {
        user.image = req.file.filename;
      }
      user.completeProfile = true;
      await user.save();
      return res
        .status(200)
        .send({
          message: "Profil complété avec succès",
          user: { niveaux: user.niveaux },
          success: true,
        });
    } catch (err) {
      if (req.file) {
        const imagePath = path.join(
          `./uploads/images/${req.user.userId}`,
          req.file.filename,
        );
        fs.unlink(imagePath, (err) => {
          if (err) console.log("Erreur suppression fichier:", err);
        });
      }
      if (err.name === "ZodError") {
        return res.status(400).send({
          success: false,
          message: err.issues.map((e) => e.message),
        });
      }
      return res
        .status(500)
        .send({ message: "Une erreur est survenue", success: false });
    }
  },
);

router.get("/getEvenements", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .send({
          message:
            "Impossible de récupérer les événements pour cet utilisateur.",
          success: false,
        });
    }
    return res.status(200).send({ events: user.events, success: true });
  } catch (err) {
    return res
      .status(500)
      .send({
        message:
          "Une erreur interne est survenue. Veuillez réessayer plus tard",
        success: false,
        err,
      });
  }
});

router.post("/postEvents", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const EventsShemaValidation = EventsShema.parse(req.body);
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .send({
          message: "Impossible d'ajouter l'événement. Veuillez réessayer.",
          success: false,
        });
    }
    const dateTostring = EventsShemaValidation.Date.toDateString();
    const DateExister = user.events.find(
      (e) => e.Date.toDateString() === dateTostring,
    );
    if (DateExister) {
      DateExister.items.push(...EventsShemaValidation.items);
    }
    if (!DateExister) {
      user.events.push({
        Date: EventsShemaValidation.Date,
        items: EventsShemaValidation.items,
      });
    }
    await user.save();
    return res
      .status(200)
      .send({ message: "Événement ajouté avec succès.", success: true });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).send({
        success: false,
        message: err.issues.map((e) => e.message),
      });
    }
    return res
      .status(500)
      .send({ message: "Une erreur est survenue", success: false, err });
  }
});

router.delete("/deleteEvents/:eventId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const eventId = req.params.eventId;
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { events: { _id: eventId } } },
      { new: true },
    );
    if (!user) {
      return res
        .status(400)
        .send({
          message: "Impossible de supprimer l'événement. Veuillez réessayer.",
          success: false,
        });
    }
    return res
      .status(200)
      .send({ message: "Événement supprimé avec succès.", success: true });
  } catch (err) {
    return res
      .status(500)
      .send({
        message:
          "Une erreur interne est survenue lors de la suppression de l'événement.",
        success: false,
        err,
      });
  }
});

router.post("/follow/:professeurId", authMiddleware, async (req, res) => {
  const { professeurId } = req.params;
  const userId = req.user.userId;
  const professeur = await User.findById(professeurId);
  const user = await User.findById(userId);

  if (userId === professeurId) {
    return res
      .status(400)
      .json({ success: false, message: "Impossible de suivre vous-même" });
  }

  if (!professeur) {
    return res
      .status(404)
      .json({ success: false, message: "Professeur introuvable" });
  }

  const alreadyFollowing = professeur.followers.includes(userId);

  if (alreadyFollowing) {
    professeur.followers.pull(userId);
    user.following.pull(professeurId);
  }
  if (!alreadyFollowing) {
    professeur.followers.push(userId);
    user.following.push(professeurId);
  }

  await professeur.save();
  await user.save();

  res.json({
    success: true,
    following: !alreadyFollowing,
    followersCount: professeur.followers.length,
  });
});

router.get("/profile/:userId/content", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const viewerId = req.user.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé" });
    }

    const isSelf = viewerId === userId;
    const isProfesseur = user.role === "Professeur";

    if (!isProfesseur) {
      return res.status(200).json({
        success: true,
        videos: [],
        cours: [],
        quiz: [],
      });
    }

    const videoQuery = { professeur: userId };
    if (!isSelf) videoQuery.visibility = "Public";

    const [videos, cours, quiz] = await Promise.all([
      VideosModel.find(videoQuery)
        .populate("matiere", "nom")
        .populate("niveaux", "nom")
        .select("title description thumbnail videoUrl views likes createdAt filiere matiere niveaux visibility")
        .sort({ createdAt: -1 })
        .limit(12)
        .lean(),
      CoursModels.find({ professeur: userId })
        .populate("matiere", "nom")
        .select("title type semestre filière pdfUrl createdAt matiere")
        .sort({ createdAt: -1 })
        .limit(12)
        .lean(),
      QuizModel.find({ professeur: userId })
        .populate("matiere", "nom")
        .populate("niveaux", "nom")
        .select("text participants createdAt filiere matiere niveaux")
        .sort({ createdAt: -1 })
        .limit(12)
        .lean(),
    ]);

    return res.status(200).json({ success: true, videos, cours, quiz });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      err,
    });
  }
});

router.get("/profile/:userId/quiz-results", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const viewerId = req.user.userId;

    if (viewerId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé",
      });
    }

    const results = await ResultatQuizModel.find({ userId })
      .populate("quizId", "text")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return res.status(200).json({ success: true, results });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Erreur serveur",
      err,
    });
  }
});

router.get("/getUser/:nameProfile", authMiddleware, async (req, res) => {
  try {
    const { nameProfile } = req.params;

    const [nom, prenom] = nameProfile.split("-");

    const user = await User.findOne({ nom, prenom }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.put("/updateProfile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { nom, prenom, email, niveaux } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ message: "Utilisateur non trouvé", success: false });
    }

    if (nom) user.nom = nom;
    if (prenom) user.prenom = prenom;
    if (email) user.email = email;
    if (niveaux) user.niveaux = niveaux;

    await user.save();

    return res.status(200).send({
      message: "Profil mis à jour avec succès",
      success: true,
      user: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        niveaux: user.niveaux,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Une erreur est survenue", success: false, err });
  }
});

router.put("/changePassword", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).send({
        message: "Les champs obligatoires sont manquants",
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ message: "Utilisateur non trouvé", success: false });
    }

    // Vérifier le mot de passe actuel
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      return res.status(400).send({
        message: "Le mot de passe actuel est incorrect",
        success: false,
      });
    }

    // Vérifier que le nouveau mot de passe n'est pas le même que l'actuel
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).send({
        message:
          "Le nouveau mot de passe doit être différent du mot de passe actuel",
        success: false,
      });
    }

    // Hacher et mettre à jour le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).send({
      message: "Mot de passe changé avec succès",
      success: true,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Une erreur est survenue", success: false, err });
  }
});

router.get("/saved/latest", authMiddleware, async (req, res) => {
  try {

    const userId = req.user.userId;

    const user = await User.findById(userId)
      .populate({
        path: "savedVideos",
        options: { sort: { createdAt: -1 }, limit: 3 }
      })
      .populate({
        path: "savedCours",
        options: { sort: { createdAt: -1 }, limit: 3 }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    res.json({
      success: true,
      videos: user.savedVideos,
      cours: user.savedCours
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      err
    });
  }
});
module.exports = router;
