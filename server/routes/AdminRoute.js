const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const ensureAdmin = require('../middlewares/adminMiddleware');
const ModerationLog = require("../models/ModerationLogModel");
const Appeal = require("../models/AppealModel");
const {loginSchema } = require('../validations/authValidation');
const User = require('../models/UserModel');
const VideosModel = require('../models/VideosModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

router.post('/connexion', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Email ou mot de passe incorrect", success: false });
    }
    if (user.role !== "Admin") {
      return res.status(403).send({ message: "Accès réservé aux admins", success: false });
    }
    if (!user.accountVerified) {
      return res.status(400).send({ message: "Compte non vérifié", success: false });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).send({ message: "Email ou mot de passe incorrect", success: false });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).send({ message: "Connexion admin réussie", success: true });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).send({
        success: false,
        message: err.issues.map((e) => e.message),
      });
    }
    return res.status(500).send({ message: "Une erreure est survenue", success: false });
  }
});


router.post("/appeal", async (req, res) => {
  try {
    const { email, message } = req.body;
    if (!email || !message || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Email et message (10 caractères min) sont requis",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
    }
    if (!user.blockedUntil || user.blockedUntil <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Ce compte n'est pas bloqué actuellement",
      });
    }

    const existsPending = await Appeal.findOne({ user: user._id, status: "PENDING" });
    if (existsPending) {
      return res.status(400).json({
        success: false,
        message: "Une demande est déjà en attente",
      });
    }

    await Appeal.create({
      user: user._id,
      email,
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Demande envoyée avec succès",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Erreur serveur", err });
  }
});


router.get("/users", authMiddleware, ensureAdmin, async (req, res) => {
  try {
    const { search = "" } = req.query;
    const searchRegex = new RegExp(search, "i");
    const users = await User.find({
      role: { $ne: "Admin" },
      $or: [{ nom: searchRegex }, { prenom: searchRegex }, { email: searchRegex }],
    })
      .select("nom prenom email role niveaux blockedUntil blockReason accountVerified status createdAt")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Erreur serveur", err });
  }
});

router.get("/prof/users", authMiddleware, ensureAdmin, async (req, res) => {
  try {
    const { search = "" } = req.query;
    const searchRegex = new RegExp(search, "i");
    const users = await User.find({
      role: { $ne: "Admin" },
      status: { $ne: "declined" },
      $or: [{ nom: searchRegex }, { prenom: searchRegex }, { email: searchRegex }],
    })
      .select("nom prenom email role niveaux blockedUntil blockReason accountVerified status createdAt")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Erreur serveur", err });
  }
});


router.patch("/professeurs/:userId/status", authMiddleware, ensureAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, conditions = "" } = req.body;

    if (!["approved", "declined"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Statut invalide. Utilisez approved ou declined",
      });
    }

    const professeur = await User.findById(userId);
    if (!professeur) {
      return res.status(404).json({ success: false, message: "Professeur introuvable" });
    }
    if (professeur.role !== "Professeur") {
      return res.status(400).json({ success: false, message: "Cet utilisateur n'est pas un professeur" });
    }

    professeur.status = status;
    await professeur.save();

    try {
      await sendProfessorStatusEmail(professeur, status, conditions);
    } catch (emailErr) {
      console.error("Erreur envoi email statut professeur:", emailErr);
    }

    return res.status(200).json({
      success: true,
      message: status === "approved" ? "Professeur approuvé" : "Professeur refusé",
      professeur: {
        id: professeur._id,
        nom: professeur.nom,
        prenom: professeur.prenom,
        email: professeur.email,
        status: professeur.status,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Erreur serveur", err });
  }
});

router.patch("/users/:userId/block", authMiddleware, ensureAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { days, reason = "" } = req.body;
    const daysNumber = Number(days);
    if (!Number.isFinite(daysNumber) || daysNumber < 0) {
      return res.status(400).json({ success: false, message: "Nombre de jours invalide" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    if (user.role === "Admin") {
      return res.status(400).json({ success: false, message: "Blocage admin interdit" });
    }
    if (daysNumber === 0) {
      user.blockedUntil = null;
      user.blockReason = "";
    } else {
      const blockedUntil = new Date();
      blockedUntil.setDate(blockedUntil.getDate() + daysNumber);
      user.blockedUntil = blockedUntil;
      user.blockReason = reason;
    }
    await user.save();
    await ModerationLog.create({
      admin: req.user.userId,
      targetUser: user._id,
      action: daysNumber === 0 ? "UNBLOCK" : "BLOCK",
      reason: reason || "",
      meta: {
        days: daysNumber,
        blockedUntil: user.blockedUntil,
      },
    });
    if (daysNumber > 0) {
      try {
        await sendBlockedAccountEmail(user, user.blockedUntil, reason);
      } catch (emailErr) {
        console.error("Erreur envoi email de blocage:", emailErr);
      }
    }
    return res.status(200).json({
      success: true,
      message: daysNumber === 0 ? "Utilisateur débloqué" : "Utilisateur bloqué",
      user: {
        id: user._id,
        blockedUntil: user.blockedUntil,
        blockReason: user.blockReason,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Erreur serveur", err });
  }
});

router.get("/reports", authMiddleware, ensureAdmin, async (req, res) => {
  try {
    const videos = await VideosModel.find({
      $or: [{ reports: { $exists: true, $not: { $size: 0 } } }, { "comments.reports": { $exists: true, $not: { $size: 0 } } }],
    })
      .populate("professeur", "nom prenom email")
      .populate("reports.user", "nom prenom email role")
      .populate("comments.user", "nom prenom email role")
      .populate("comments.reports.user", "nom prenom email role")
      .select("title videoUrl professeur reports comments")
      .sort({ updatedAt: -1 });

    const videoReports = [];
    const commentReports = [];

    videos.forEach((video) => {
      (video.reports || []).forEach((report) => {
        videoReports.push({
          videoId: video._id,
          title: video.title,
          videoUrl: video.videoUrl,
          professeur: video.professeur,
          report,
        });
      });
      (video.comments || []).forEach((comment) => {
        (comment.reports || []).forEach((report) => {
          commentReports.push({
            videoId: video._id,
            title: video.title,
            commentId: comment._id,
            commentText: comment.text,
            commentAuthor: comment.user,
            professeur: video.professeur,
            report,
          });
        });
      });
    });

    return res.status(200).json({
      success: true,
      videoReports,
      commentReports,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Erreur serveur", err });
  }
});

router.get("/moderation-logs", authMiddleware, ensureAdmin, async (req, res) => {
  try {
    const logs = await ModerationLog.find()
      .populate("admin", "nom prenom email")
      .populate("targetUser", "nom prenom email role")
      .sort({ createdAt: -1 })
      .limit(200);
    return res.status(200).json({ success: true, logs });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Erreur serveur", err });
  }
});

router.get("/appeals", authMiddleware, ensureAdmin, async (req, res) => {
  try {
    const appeals = await Appeal.find()
      .populate("user", "nom prenom email blockedUntil")
      .populate("reviewedBy", "nom prenom email")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, appeals });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Erreur serveur", err });
  }
});

router.patch("/appeals/:appealId/review", authMiddleware, ensureAdmin, async (req, res) => {
  try {
    const { appealId } = req.params;
    const { status, reviewNote = "" } = req.body;
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Statut invalide" });
    }
    const appeal = await Appeal.findById(appealId).populate("user");
    if (!appeal) {
      return res.status(404).json({ success: false, message: "Demande introuvable" });
    }
    appeal.status = status;
    appeal.reviewNote = reviewNote;
    appeal.reviewedBy = req.user.userId;
    appeal.reviewedAt = new Date();
    await appeal.save();

    if (status === "APPROVED" && appeal.user) {
      appeal.user.blockedUntil = null;
      appeal.user.blockReason = "";
      await appeal.user.save();
      await ModerationLog.create({
        admin: req.user.userId,
        targetUser: appeal.user._id,
        action: "APPEAL_REVIEWED",
        reason: reviewNote || "Appeal approved",
        meta: { appealId: appeal._id, result: status },
      });
    }

    return res.status(200).json({ success: true, message: "Demande traitée", appeal });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Erreur serveur", err });
  }
});






module.exports = router;