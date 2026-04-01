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
const Message = require('../models/MessagesModel');
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

router.get('/fetch-niveaux',authMiddlewares,profMiddleware,async(req,res)=>{
  const user = await User.findById(req.user.userId);
  const niveau = await Niveaux.findOne({ nom: user.niveaux });
  res.json(niveau)
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


router.get('/get-videos', authMiddlewares, profMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const videos = await Videos.find({ professeur: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Videos.countDocuments({ professeur: userId });

    res.json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      success: true,
      videos,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/add-videos', authMiddlewares, profMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      title,
      description,
      videoUrl,
      thumbnail,
      niveaux,
      matiere,
      filiere,
      visibility
    } = req.body;

    if (!title || !videoUrl || !matiere || !niveaux || !filiere) {
      return res.status(400).json({success: false,message: "Champs obligatoires manquants"});
    }

    const video = new Videos({
      title,
      description,
      videoUrl,
      thumbnail,
      niveaux,
      professeur: userId,
      matiere,
      filiere,
      visibility: visibility || "Public"
    });

    await video.save();

    res.status(201).json({success: true,message: "Vidéo ajoutée avec succès",video});

  } catch (err) {
    console.error(err);
    res.status(500).json({success: false,message: "Erreur lors de l'ajout de la vidéo"});
  }
});

router.put("/update-videos/:videoId",authMiddlewares,profMiddleware, async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description, videoUrl, thumbnail, matiere, filiere, visibility, niveaux } = req.body;
    const updatedVideo = await Videos.findByIdAndUpdate(videoId,{
        title,
        description,
        videoUrl,
        thumbnail,
        matiere,
        filiere,
        visibility,
        niveaux,
      },{
        new: true,
        runValidators: true,
      }
    );
    if (!updatedVideo) {
      return res.status(404).json({message: "Vidéo non trouvée"});
    }
    res.status(200).json({message: "Vidéo modifiée avec succès",video: updatedVideo});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Erreur serveur",sucess:false,error});
  }
});

router.delete('/delete-videos/:videoId', authMiddlewares, profMiddleware, async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const userId = req.user.userId;

    const video = await Videos.findById(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: "Vidéo introuvable" });
    }

    if (video.professeur.toString() !== userId) {
      return res.status(403).json({success: false,message: "Non autorisé"});
    }

    await Videos.findByIdAndDelete(videoId);

    res.json({ success: true, message: "Vidéo supprimée avec succès" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});


router.get('/get-quiz', authMiddlewares, profMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const [quiz, totalQuiz] = await Promise.all([
      Quiz.find({ professeur: userId })
      .populate("matiere")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Quiz.countDocuments({ professeur: userId })
    ]);

    const totalPages = Math.ceil(totalQuiz / limit);

    res.json({
      success: true,
      page,
      totalPages,
      totalQuiz,
      quiz
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({success: false,message: "Erreur serveur"});
  }
});


router.post('/add-quiz', authMiddlewares, profMiddleware, async (req, res) => {
  try {
    const { text, questions, matiere, filiere } = req.body;

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const niveauxDoc = await Niveaux.findOne({ nom: user.niveaux });

    if (!niveauxDoc) {
      return res.status(404).json({ message: "Niveau introuvable" });
    }
    const niveaux = niveauxDoc._id;

    if (!text) {
      return res.status(400).json({ message: "Titre requis" });
    }
    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: "Questions requises" });
    }
    const cleanQuestions = questions.map((q, index) => {
      if (!q.question) {
        throw new Error(`Question ${index + 1} vide`);
      }

      const options = q.options.filter((opt) => opt.trim() !== "");

      if (options.length < 2) {
        throw new Error(`Minimum 2 réponses (question ${index + 1})`);
      }

      if (q.correctAnswer === null || q.correctAnswer === undefined) {
        throw new Error(`Choisir une bonne réponse (question ${index + 1})`);
      }

      return {
        question: q.question,
        options,
        correctAnswer: q.correctAnswer
      };
    });

    const quiz = await Quiz.create({
      text,
      questions: cleanQuestions,
      professeur: req.user.userId,
      matiere,
      niveaux,
      filiere
    });

    res.status(201).json({ success: true, quiz });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


router.delete('/delete-quiz/:quizId', authMiddlewares, profMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const quizId = req.params.quizId;

    const quiz = await Quiz.findOneAndDelete({
      _id: quizId,
      professeur: userId
    });

    if (!quiz) {
      return res.status(404).json({success: false,message: "Quiz non trouvé ou non autorisé"});
    }

    res.json({success: true,message: "Quiz supprimé avec succès",quiz});

  } catch (error) {
    console.error(error);
    res.status(500).json({success: false,message: "Erreur serveur"});
  }
});



router.get('/my-conversation', authMiddlewares,profMiddleware, async (req, res) => {
    const userId = req.user.userId;

    const conversations = await Conversation.find({
      members: userId
    })
    .populate("members", "nom prenom role image")
    .populate("lastMessage", "text sender")
    .sort({createdAt:-1});

    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          readBy: { $ne: userId },
          sender: { $ne: userId }
        });

        return {
          ...conv.toObject(),
          unreadCount
        };
      })
    );

    res.json(conversationsWithUnread);
});

router.get('/my-conversation/:conversationId',authMiddlewares,profMiddleware,async(req,res)=>{
    const conversationId = req.params.conversationId
    const conversation = await Conversation.findById(conversationId).populate("members","nom prenom role image")
    .populate("lastMessage","text sender")
    res.json(conversation)
});

router.get('/get-messages/:conversationId',authMiddlewares,profMiddleware,async(req,res)=>{
    const conversationId = req.params.conversationId;
    const messages = await Message.find({
        conversationId:conversationId
    }).populate("sender", "nom prenom image")
    .sort({ createdAt: 1 });
    res.json(messages)
});

router.post('/messages',authMiddlewares,profMiddleware,async(req,res)=>{
    const userId = req.user.userId;
    const {conversationId,text} = req.body;
    const messages = await Message.create({
        conversationId,
        sender:userId,
        text,
        readBy:[req.user.userId]
    })
    await Conversation.findByIdAndUpdate(conversationId,{
        lastMessage:messages._id
    })
    res.status(201).json(messages)
});




module.exports = router;