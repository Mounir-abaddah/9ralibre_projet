const express = require('express');
const router = express.Router();
const Niveaux = require('../models/NiveauxModel');
const Quiz = require('../models/QuizModel');
const ResultsQuiz = require('../models/ResultatQuizModel');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add-quiz', authMiddleware, async (req, res) => {
    try {
        const {
            text,
            questions,
            professeur,
            filiere,
            matiere,
            niveaux
        } = req.body;

        const quiz = await Quiz.create({
            text,
            questions,
            professeur,
            filiere,
            matiere,
            niveaux
        });

        res.status(201).json(quiz);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/get-quiz/:niveauxName', authMiddleware, async (req, res) => {
    try {
        const niveauxName = req.params.niveauxName;
        const niveaux = await Niveaux.findOne({nom:niveauxName});
        if (!niveaux) {
            return res.status(404).json({ message: "Niveau non trouvé" });
        }
        const quiz = await Quiz.find({ niveaux: niveaux })
        .populate("professeur","nom prenom")
        .populate("niveaux","nom")
        .populate("matiere","nom")
        .select("-questions.correctAnswer");
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/quiz/:quizId', authMiddleware, async (req, res) => {
try {
    const quiz = await Quiz.findById(req.params.quizId)
    .populate("professeur","nom prenom")
    .populate("niveaux","nom")
    .populate("matiere","nom")
    .select("-questions.correctAnswer");

    if(!quiz){
    return res.status(404).json({message:"Quiz non trouvé"});
    }

    res.json(quiz);

} catch(error){
    res.status(500).json({message:error.message});
}
});

router.post('/submit',authMiddleware,async(req,res)=>{
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if(!quiz) {
        return res.status(404).json({ message: "Quiz non trouvé" });
    }
    if (!answers || answers.length !== quiz.questions.length) {
        return res.status(400).json({ message: "Réponses invalides" });
    }
    let score = 0;
    let wrongAnswers = [];

    const alreadyDone = await ResultsQuiz.findOne({
        userId: req.user.userId,
        quizId: quizId
    });

    if (alreadyDone) {
        return res.status(400).json({ message: "Vous avez déjà passé ce quiz" });
    }

    for (let i = 0; i < quiz.questions.length; i++) {
        const question = quiz.questions[i];
        const userAnswer = answers[i];
        if (question.correctAnswer === userAnswer) {
            score += 10;
        }else {
            wrongAnswers.push({
                question: question.question,
                correctAnswer: question.options[question.correctAnswer],
                userAnswer: question.options[userAnswer]
            });
        }
    }
    const result = await ResultsQuiz.create({
        userId: req.user.userId,
        quizId,
        score,
        totalQuestions: quiz.questions.length,
        wrongAnswers
    });
    res.json(result);
});

router.get('/leaderboard/:quizId', authMiddleware, async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const results = await ResultsQuiz.find({ quizId })
            .populate('userId', 'nom prenom')
            .sort({ score: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;