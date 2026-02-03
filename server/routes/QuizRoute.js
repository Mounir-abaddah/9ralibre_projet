const express = require("express");
const router = express.Router();
const QuizModel = require("../models/QuizModel");
const authMiddleware = require("../middlewares/authMiddleware");
const NiveauxModel = require("../models/NiveauxModel");
const QuizResultModel = require("../models/QuizResultsModel");

router.post("/add-quiz", authMiddleware, async (req, res) => {
  try {
    const { title, matiere, niveaux, filiere, questions, type } = req.body;
    const quiz = new QuizModel({
      title,
      matiere,
      niveaux,
      filiere,
      professeur: req.user.userId,
      questions,
      type,
      totalQuestions: questions.length,
    });
    await quiz.save();
    res.status(200).json({ success: true, quiz });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur lors de la création du quiz",
        err,
      });
  }
});

router.get("/get-user-by-name/:niveauxNom",authMiddleware,async (req, res) => {
    try {
        const userId = req.user.userId;
        const { niveauxNom } = req.params;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Utilisateur non authentifié" });
        }
        const niveaux = await NiveauxModel.findOne({ nom: niveauxNom });
        if (!niveaux) {
            return res
            .status(404)
            .json({ success: false, message: "Aucun niveau trouvé avec ce nom" });
        }

        const quiz = await QuizModel.find({ niveaux: niveaux._id })
            .populate("matiere", "nom")
            .populate("niveaux", "nom")
            .populate("professeur", "nom prenom");

        if (!quiz || quiz.length === 0) {
            return res
            .status(404)
            .json({
                success: false,
                message: "Aucun quiz disponible pour ce niveau",
            });
        }
        res.status(200).json({ success: true, quiz });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des quiz",
            err: err.message,
        });
    }
  },
);

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const quiz = await QuizModel.findById(req.params.id)
      .populate("matiere", "nom")
      .populate("professeur", "nom prenom")
      .select("-questions.correctAnswer");
    if (!quiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz non trouvé" });
    res.json({ success: true, quiz });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur lors de récupération du quiz",
        err,
      });
  }
});

router.post("/:id/submit", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const quizId = req.params.id;
    const { answers } = req.body;

    const quiz = await QuizModel.findById(quizId);
    if (!quiz)
        return res.status(404).json({ success: false, message: "Quiz introuvable" });

    const processedAnswers = [];
    let correctCount = 0;

    for (const a of answers) {
        const q = quiz.questions.id(a.questionId);
        const correctAnswer = q ? q.correctAnswer : null;
        const isCorrect = correctAnswer !== null && a.selectedAnswer === correctAnswer;
        if (isCorrect) correctCount++;
        processedAnswers.push({
            questionId: a.questionId,
            selectedAnswer: a.selectedAnswer,
            correctAnswer: correctAnswer,
            isCorrect: !!isCorrect,
        });
    }

    const totalQuestions = quiz.questions.length;
    const score = correctCount;

    const quizResult = new QuizResultModel({
      user: userId,
      quiz: quizId,
      answers: processedAnswers,
      score,
      totalQuestions,
    });
    await quizResult.save();

    res.status(200).json({
        success: true,
        result: { score, totalQuestions, percentage, processedAnswers },
        quizResult,
    });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la soumission du quiz",
            err: err.message,
        });
    }
});

router.get('/results/user', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const results = await QuizResultModel.find({ user: userId }).select("quiz passedAt score");
    res.json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur", err: err.message });
  }
});

module.exports = router;
