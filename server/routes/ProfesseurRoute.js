const express = require('express');
const router = express.Router();
const authMiddlewares = require('../middlewares/authMiddleware');
const profMiddleware = require('../middlewares/profMiddleware');
const Cours = require("../models/CoursModel");
const User = require('../models/UserModel');
const Quiz = require('../models/QuizModel');
const Videos = require('../models/VideosModel');
const Conversation = require('../models/ConversationModel')

router.post("/addCours",authMiddlewares, profMiddleware, async (req, res) => {
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
            pdfUrl,
        });
        await newCours.save();
        res.status(201).json({success: true,message: "Cours ajouté avec succès",cours: newCours});
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
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