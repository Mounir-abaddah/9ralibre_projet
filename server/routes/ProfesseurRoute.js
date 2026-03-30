const express = require('express');
const router = express.Router();
const authMiddlewares = require('../middlewares/authMiddleware');
const profMiddleware = require('../middlewares/profMiddleware');
const Cours = require("../models/CoursModel");
const User = require('../models/UserModel');
const Quiz = require('../models/QuizModel');
const Videos = require('../models/VideosModel');
const Conversation = require('../models/ConversationModel');
const Matiere = require('../models/MatiereModel');
const Niveaux = require('../models/NiveauxModel');

const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user.userId;
    const uploadPath = path.join("./uploads/files/", userId.toString());
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

router.get('/fetch-matiere',authMiddlewares,profMiddleware,async(req,res)=>{
  const user = await User.findById(req.user.userId);
  const niveau = await Niveaux.findOne({ nom: user.niveaux });
  const matiere = await Matiere.find({niveaux:niveau._id}).populate("niveaux");
  res.json(matiere)
})


router.post("/add-cours",authMiddlewares,profMiddleware,upload.single("file"),async (req, res) => {
  try {
    const userId = req.user.userId;
    const { semestre, title, matiere, type, filiere } = req.body;
    const fileUrl = req.file.filename;
    const cours = await Cours.create({
      professeur: userId,
      filière: filiere,
      semestre: semestre,
      title: title,
      pdfUrl: fileUrl,
      matiere,
      type  
    });
    res.json({ success: true, cours });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/put-cours/:coursId",authMiddlewares,profMiddleware,upload.single("file"),async (req, res) => {
    try {
      const { semestre, title, matiere, type, filiere } = req.body;
      const coursId = req.params.coursId;

      const cours = await Cours.findById(coursId);
      if (!cours) {
        return res.status(404).json({ message: "Cours non trouvé" });
      }


      cours.semestre = semestre || cours.semestre;
      cours.title = title || cours.title;
      cours.type = type || cours.type;
      cours.filière = filiere || cours.filière;
      cours.matiere = matiere || cours.matiere;


      if (req.file) {
        cours.pdfUrl = req.file.filename;
      }

      await cours.save();

      res.json({ success: true, cours });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

router.delete("/delete-cours/:coursId", authMiddlewares, profMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { coursId } = req.params;

    const deleted = await Cours.findOneAndDelete({
      _id: coursId,
      professeur: userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Cours non trouvé ou non autorisé",
      });
    }

    res.json({
      success: true,
      message: "Cours supprimé avec succès",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/getCours", authMiddlewares, profMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { semestre, type, filiere, search } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const queryObject = {
      professeur: userId,
    };

    // filtres optionnels
    if (semestre) queryObject.semestre = semestre;
    if (type) queryObject.type = type;
    if (filiere) queryObject.filière = filiere;

    // 🔍 recherche
    if (search) {
      queryObject.$or = [
        { title: new RegExp(search, "i") },
        { semestre: new RegExp(search, "i") },
        { type: new RegExp(search, "i") },
      ];
    }

    const totalCours = await Cours.countDocuments(queryObject);

    const cours = await Cours.find(queryObject)
      .populate("matiere")
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
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des cours",
      error: err.message,
    });
  }
});

router.get('/profile', authMiddlewares, profMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    const quiz = await Quiz.countDocuments({ professeur: user._id });
    const videos = await Videos.countDocuments({ professeur: user._id });

    const videosList = await Videos.find({ professeur: user._id });

    const totalViews = videosList.reduce((acc, video) => {
      return acc + (video.views || 0);
    }, 0);

    if (!user) {
      return res.status(400).json({ message: "Échec", success: false });
    }

    const saveViewUser = {
      id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      image: user.image,
      niveaux:user.niveaux,
      completeProfile: user.completeProfile,
      followers: user.followers,
    };

    return res.status(200).json({
      user: saveViewUser,
      success: true,
      quiz,
      videos,
      totalViews // 👈 AJOUT IMPORTANT
    });

  } catch (err) {
    return res.status(500).json({
      message: "Erreur serveur",
      success: false,
      err
    });
  }
});

router.get("/last-messages", authMiddlewares, profMiddleware, async (req, res) => {
    const userId = req.user.userId;
    const conversations = await Conversation.find({
        members: userId
    })
    .populate({
        path: "lastMessage",
        populate: {
            path: "sender",
            select: "nom prenom image"
        }
    })
    .populate("members", "nom prenom image role")
    .sort({ updatedAt: -1 })
    .limit(5);
    const data = conversations.map(conv => {
        const unread =
            conv.lastMessage &&
            !conv.lastMessage.readBy.includes(userId);

        const otherUser = conv.members.find(
            m => m._id.toString() !== userId
        );

        return {
            conversationId: conv._id,
            user: otherUser,
            text: conv.lastMessage?.text || "",
            createdAt: conv.lastMessage?.createdAt,
            unread
        };
    });

    res.json({ success: true, messages: data });
});

router.get("/recent-activity", authMiddlewares, profMiddleware, async (req, res) => {
    try {

        const userId = req.user.userId;
        const cours = await Cours.find({ professeur: userId })
        .sort({ createdAt: -1 })
        .limit(1)
        .select("title createdAt");

        const videos = await Videos.find({ professeur: userId })
        .sort({ createdAt: -1 })
        .limit(1)
        .select("title createdAt");

        const quiz = await Quiz.find({ professeur: userId })
        .sort({ createdAt: -1 })
        .limit(1)
        .select("text createdAt");

        const activities = [
        ...cours.map(c => ({
            type: "cours",
            title: c.title,
            createdAt: c.createdAt
        })),

        ...videos.map(v => ({
            type: "video",
            title: v.title,
            createdAt: v.createdAt
        })),

        ...quiz.map(q => ({
            type: "quiz",
            title: q.text,
            createdAt: q.createdAt
        }))
        ];

        const sortedActivities = activities
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

        res.json({
        success: true,
        activities: sortedActivities
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get("/stats-week", authMiddlewares, profMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 6);

    const videos = await Videos.find({
      professeur: userId,
      createdAt: { $gte: lastWeek }
    });

    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

    const stats = days.map(day => ({
      day,
      views: 0,
      likes: 0
    }));

    videos.forEach(video => {
      const d = new Date(video.createdAt);
      let index = d.getDay() - 1;
      if (index === -1) index = 6;

      stats[index].views += video.views || 0;
      stats[index].likes += video.likes?.length || 0;
    });

    res.json({ success: true, stats });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});




module.exports = router;