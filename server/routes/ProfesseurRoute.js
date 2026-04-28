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
const bcrypt = require("bcryptjs");
const {addCoursSchema,addVideoSchema,updateVideoSchema,addQuizSchema,registerSchema,loginSchema,messageOUblierSchema,passwordResetShema,EventsShema} = require('../validations/professeurValidation');
const { oublierMotdepasseProfesseur, sendProfessorRegistrationReceivedEmail } = require('../services/emailServices')
const jwt = require('jsonwebtoken');

function zodErrorPayload(err) {
  return {
    success: false,
    message: err.issues.map((e) => e.message).join(", "),
    issues: err.issues.map((e) => ({ path: e.path, message: e.message })),
  };
}


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


const storageImage = multer.diskStorage({
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
const uploadImage = multer({ storage: storageImage });

router.get('/fetch-matiere',authMiddlewares,profMiddleware,async(req,res)=>{
  const user = await User.findById(req.user.userId);
  if (!user) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }
  const niveau = await Niveaux.findOne({ nom: user.niveaux });
  if (!niveau) {
    return res.status(404).json({ message: "Niveau introuvable" });
  }
  const matiere = await Matiere.find({ niveaux: niveau._id }).populate("niveaux");
  res.json(matiere)
})

router.get('/fetch-niveaux',authMiddlewares,profMiddleware,async(req,res)=>{
  const user = await User.findById(req.user.userId);
  const niveau = await Niveaux.findOne({ nom: user.niveaux });
  res.json(niveau)
})


router.post("/add-cours",authMiddlewares,profMiddleware,upload.single("file"),async (req, res) => {
  try {
    const AddCours = addCoursSchema.parse(req.body); 
    const userId = req.user.userId;
    if (!req.file) {
        return res.status(400).json({success: false,message: "Le fichier PDF est obligatoire",});
    }
    if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ success: false, message: "Seuls les fichiers PDF sont autorisés", });
    }
    const cours = await Cours.create({
      professeur: userId,
      filière: AddCours.filiere,
      semestre: AddCours.semestre,
      title: AddCours.title,
      pdfUrl: req.file.filename,
      matiere:AddCours.matiere,
      type:AddCours.type
    });
    res.json({ success: true, cours });
  }catch (err) {
    if (err.name === "ZodError") {
        return res.status(400).json(zodErrorPayload(err));
      }
      return res.status(500).send({ message: "Une erreur est survenue", success: false });
    }
});

router.put("/put-cours/:coursId",authMiddlewares,profMiddleware,upload.single("file"),async (req, res) => {
    try {
      const updateCoursSchema = addCoursSchema.partial(req.body);
      const { semestre, title, matiere, type, filiere } = updateCoursSchema.parse(req.body);
      const coursId = req.params.coursId;
      const cours = await Cours.findById(coursId);
      if (!cours) {
        return res.status(404).json({ message: "Cours non trouvé" });
      }
      if(cours.professeur.toString() !== req.user.userId) {
        return res.status(403).json({success: false,message: "Non autorisé",});
      }
      cours.semestre = semestre || cours.semestre;
      cours.title = title || cours.title;
      cours.type = type || cours.type;
      cours.filière = filiere || cours.filière;
      cours.matiere = matiere || cours.matiere;
      if (req.file) {
        if (req.file.mimetype !== "application/pdf") {
          return res.status(400).json({success: false,message: "Seuls les PDF sont autorisés",});
        }
        cours.pdfUrl = req.file.filename;
      }
      await cours.save();
      res.json({ success: true, cours });
    } catch (err) {
      if (err.name === "ZodError") {
        return res.status(400).json(zodErrorPayload(err));
      }
      return res.status(500).json({success: false,message: err.message || "Erreur serveur",});
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
    const limit = parseInt(req.query.limit) || 16;
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
      provider:user.provider,
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
{/***************************************************************Validation Vieos Post */}
router.get('/get-videos', authMiddlewares, profMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { search } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const queryObject = {
      professeur: userId,
    };
  
    if (search) {
      queryObject.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const videos = await Videos.find(queryObject)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Videos.countDocuments(queryObject);

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

router.get('/get-videos-id/:videoId',authMiddlewares,profMiddleware,async(req,res)=>{
    try{
        const userId = req.user.userId;
        const {videoId} = req.params;
        const videos = await Videos.findById(videoId)
        .populate("niveaux","nom")
        .populate("matiere","nom")
        .populate("comments.user","nom prenom role image")
        .populate("comments.replies.user","nom prenom role image")
        if(!videos){
            return res.status(404).send({message:"Aucune videos est trouver d'apres ce Id",success:false})
        }
        const user = await User.findById(userId);
        return res.status(200).send({
            success:true,
            likesCount:videos.likes.length,
            viewsCount:videos.views,
            videos
        })
    }catch(err){
        return res.status(500).send({message:"Une erreure est survenue lors de recuperation de video",success:false,err})
    }
});

router.post('/add-videos', authMiddlewares, profMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = addVideoSchema.parse(req.body);
    const video = new Videos({
      ...data,
      professeur: userId,
      visibility: data.visibility || "Public",
    });

    await video.save();

    res.status(201).json({success: true,message: "Vidéo ajoutée avec succès",video});

  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json(zodErrorPayload(err));
    }
    res.status(500).json({success: false,message: "Erreur lors de l'ajout de la vidéo",});
  }
});


router.put("/update-videos/:videoId", authMiddlewares, profMiddleware, async (req, res) => {
  try {
    const { videoId } = req.params;

    // ✅ Validation
    const data = updateVideoSchema.parse(req.body);

    const video = await Videos.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Vidéo non trouvée" });
    }

    // ✅ Sécurité
    if (video.professeur.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé",
      });
    }

    // ✅ Update dynamique propre 🔥
    Object.assign(video, data);

    await video.save();

    res.status(200).json({
      success: true,
      message: "Vidéo modifiée avec succès",
      video,
    });

  } catch (err) {

    if (err.name === "ZodError") {
      return res.status(400).json(zodErrorPayload(err));
    }

    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
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

{/***************************************************************Validation Quiz Post */}
router.get('/get-quiz', authMiddlewares, profMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const queryObject = {
      professeur: userId,
    };

    if (search) {
      queryObject.$or = [
        { text: { $regex: search, $options: "i" } },
        { filiere: { $regex: search, $options: "i" } },
      ];
    }
    

    const [quiz, totalQuiz] = await Promise.all([
      Quiz.find(queryObject)
      .populate("matiere")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Quiz.countDocuments(queryObject)
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

router.post("/add-quiz",authMiddlewares,profMiddleware,async (req, res) => {
    try {
      const data = addQuizSchema.parse(req.body);

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }

      const niveauxDoc = await Niveaux.findOne({ nom: user.niveaux });
      if (!niveauxDoc) {
        return res.status(404).json({
          success: false,
          message: "Niveau introuvable",
        });
      }

      const niveaux = niveauxDoc._id;

      const cleanQuestions = data.questions.map((q) => ({
        question: q.question,
        options: q.options.filter((opt) => opt.trim() !== ""),
        correctAnswer: q.correctAnswer,
      }));

      const quiz = await Quiz.create({
        text: data.text,
        questions: cleanQuestions,
        professeur: req.user.userId,
        matiere: data.matiere,
        niveaux,
        filiere: data.filiere,
      });

      res.status(201).json({
        success: true,
        message: "Quiz ajouté avec succès",
        quiz,
      });

    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json(zodErrorPayload(error));
      }
      res.status(500).json({success: false,message: error.message || "Erreur serveur",});
    }
  }
);

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

  router.put('/mark-as-read/:conversationId', authMiddlewares,profMiddleware ,async (req, res) => {
    const userId = req.user.userId;

    await Message.updateMany(
      {
        conversationId: req.params.conversationId,
        readBy: { $ne: userId }
      },
      {
        $push: { readBy: userId }
      }
    );

    res.json({ message: "Messages marqués comme lus" });
  });





router.put('/settings', authMiddlewares, profMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      nom,
      prenom,
      niveaux,
      image
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    user.nom = nom || user.nom;
    user.prenom = prenom || user.prenom;
    user.niveaux = niveaux || user.niveaux;
    user.image = image || user.image;

    // si profil complet
    user.completeProfile = true;

    await user.save();

    res.json({
      success: true,
      message: "Profil mis à jour avec succès",
      user
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});


router.put('/change-password', authMiddlewares, profMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé"
      });
    }

    // vérifier ancien mot de passe
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Ancien mot de passe incorrect"
      });
    }

    // hash nouveau password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({
      success: true,
      message: "Mot de passe modifié avec succès"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

router.put('/upload-avatar', authMiddlewares, profMiddleware, uploadImage.single("image"), async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false });
    }

    if (req.file) {
      user.image = req.file.filename;
    }

    await user.save();

    res.json({
      success: true,
      image: user.image
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});



{/***************************************************************Validation autheentfication Post */}
router.post("/register", async (req, res) => {
  try {
    // ✅ validation
    const data = registerSchema.parse(req.body);

    const emailExists = await User.findOne({ email: data.email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Impossible de créer un compte avec ces informations",
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = new User({
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      password: hashedPassword,
      niveaux: data.niveaux,
      accountVerified: true,
      role: "Professeur",
      provider: "local",
      status: "pending",
    });

    await newUser.save();
    try {
      await sendProfessorRegistrationReceivedEmail(newUser);
    } catch (emailErr) {
      console.error("Erreur envoi email inscription professeur:", emailErr);
    }

    res.status(201).json({
      success: true,
      message: "Compte créé avec succès. En attente de validation.",
    });

  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json(zodErrorPayload(err));
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email });

    if (!user) {
      return res.status(404).json({ success: false, message: "Email ou mot de passe incorrect", });
    }

    if (user.status === "declined") {
      return res.status(403).json({
        success: false,
        message: "Votre demande professeur a été refusée. Veuillez vérifier votre email pour les conditions et corriger votre dossier.",
      });
    }

    if (user.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Compte en attente de validation",
      });
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      return res.status(400).json({success: false,message: "Mot de passe incorrect",});
    }

    const token = jwt.sign({ userId: user._id, role: user.role },process.env.JWT_SECRET,{ expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json(zodErrorPayload(err));
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


router.post('/oublierMotdepasse',async(req,res)=>{
    try{
        const validationOublierPassword = messageOUblierSchema.parse(req.body);
        const user = await User.findOne({email:validationOublierPassword.email,role:"Professeur"})
        if(!user){
            return res.status(400).send({message:"Si un compte existe pour cet email, vous allez recevoir un email pour réinitialiser le mot de passe" , success:false})
        }
        if (user.status !== "approved") {
          return res.status(403).send({
            message: "Votre compte est en attente de validation. Veuillez vérifier votre email ou contacter l'administration.",
            success: false,
          });
        }
        const token = jwt.sign({userId:user._id,type:"Oublier mot de passe"},process.env.JWT_SECRET,{
            expiresIn : "30m"
        })
        const resetLink = `${process.env.FRONTEND_URL}/prof/password/reset/${token}`
        await oublierMotdepasseProfesseur(user,resetLink)
        return res.status(200).send({ message: "Si un compte existe pour cet email, vous allez recevoir un email pour réinitialiser le mot de passe", success: true });
    }catch(err){
        if(err.name === "ZodError"){
            return res.status(400).send({
                success:false,
                message:err.issues.map(e=>e.message)
            })
        }
        res.status(500).send({message:'Une erreure est survenue',success:false})
    }
})


router.put('/resetPassword/:token', async (req, res) => {
  try{
    const {token} = req.params;
    const validationOublierPassword = passwordResetShema.parse(req.body);
    let payload;
    try{
        payload = jwt.verify(token,process.env.JWT_SECRET)
    }catch (err) {
      return res.status(400).send({message: "Lien invalide ou expiré" , success: false });
    }
    const user = await User.findById(payload.userId);
    if(!user){
        return res.status(404).send({message: "Impossible de réinitialiser le mot de passe avec ce lien",success: false });
    }
    if (user.status !== "approved") {
      return res.status(403).send({message: "Compte non validé",success: false});
    }
    const MemeMotdepasse = await bcrypt.compare(validationOublierPassword.password,user.password);
    if(MemeMotdepasse){
      return res.status(400).send({
        message: "Impossible de réinitialiser le mot de passe avec ces informations",
        success: false,
      });
    }
    user.password = await bcrypt.hash(validationOublierPassword.password,10);
    await user.save();
    return res.status(200).send({message: "Mot de passe réinitialisé avec succès ✅",success: true});
  }catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).send({
        success: false,
        message: err.issues.map(e => e.message)
      });
    }
    console.error(err);
    res.status(500).send({ success: false, message: "Une erreur est survenue" });
  }
});



router.post('/logout', (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });
        return res.status(200).send({
            message: "Déconnexion réussie",
            success: true
        });
    } catch (err) {
        return res.status(500).send({
            message: "Une erreur est survenue lors de la déconnexion",
            success: false
        });
    }
});

{/***********************************************Calendrier*/}

router.get("/getEvenements", authMiddlewares,profMiddleware, async (req, res) => {
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
    const sortedEvents = [...user.events].sort(
      (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime(),
    );
    return res.status(200).send({ events: sortedEvents, success: true });
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

router.post("/postEvents", authMiddlewares,profMiddleware, async (req, res) => {
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
    const sortedEvents = [...user.events].sort(
      (a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime(),
    );
    return res.status(200).send({
      message: "Événement ajouté avec succès.",
      success: true,
      events: sortedEvents,
    });
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

router.delete("/deleteEvents/:eventId", authMiddlewares,profMiddleware, async (req, res) => {
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

router.patch("/events/items/:itemId", authMiddlewares,profMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { itemId } = req.params;
    const { type, titre, Description } = req.body;

    if (!type || !titre) {
      return res.status(400).send({
        success: false,
        message: "Le type et le titre sont obligatoires",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    let itemFound = false;
    user.events.forEach((event) => {
      event.items.forEach((item) => {
        if (item._id.toString() === itemId) {
          item.type = type;
          item.titre = titre;
          item.Description = Description || "";
          itemFound = true;
        }
      });
    });

    if (!itemFound) {
      return res.status(404).send({
        success: false,
        message: "Événement introuvable",
      });
    }

    await user.save();
    return res.status(200).send({
      success: true,
      message: "Événement modifié avec succès",
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Erreur serveur",
      err,
    });
  }
});

router.delete("/events/items/:itemId", authMiddlewares,profMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { itemId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    let itemDeleted = false;
    user.events.forEach((event) => {
      const initialLength = event.items.length;
      event.items = event.items.filter((item) => item._id.toString() !== itemId);
      if (event.items.length !== initialLength) {
        itemDeleted = true;
      }
    });

    user.events = user.events.filter((event) => event.items.length > 0);

    if (!itemDeleted) {
      return res.status(404).send({
        success: false,
        message: "Événement introuvable",
      });
    }

    await user.save();
    return res.status(200).send({
      success: true,
      message: "Événement supprimé avec succès",
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: "Erreur serveur",
      err,
    });
  }
});



module.exports = router;