const express = require('express');
const router = express.Router();
const Niveaux = require('../models/NiveauxModel');
const Quiz = require('../models/QuizModel');
const ResultsQuiz = require('../models/ResultatQuizModel');
const authMiddleware = require('../middlewares/authMiddleware');
const UserModels = require('../models/UserModel');


router.get('/get-quiz/:niveauxName', authMiddleware, async (req, res) => {
    const userId = req.user.userId
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1)*limit;
    try {
        const niveauxName = req.params.niveauxName;
        const niveaux = await Niveaux.findOne({nom:niveauxName});
        if (!niveaux) {
            return res.status(404).json({ message: "Niveau non trouvé" });
        }
        const user = await UserModels.findById(userId).select('niveaux');
        const quiz = await Quiz.find({ niveaux: niveaux })
        .populate("professeur","nom prenom image role")
        .populate("niveaux","nom")
        .populate("matiere","nom")
        .select("-questions.correctAnswer")
        .limit(limit)
        .skip(skip)
        .sort({createdAt:-1});

        if (user.niveaux !== niveauxName) {
            return res.status(403).json({success: false,message: "Accès refusé"});
        }

        const usersResults = await ResultsQuiz.find({
            userId:req.user.userId
        });
        const passedQuiz = usersResults.map(r => r.quizId.toString());
        const disqualifiedQuiz = usersResults
            .filter((r) => r.disqualified)
            .map((r) => r.quizId.toString());
        const finalQuiz = quiz.map(q => ({
            ...q.toObject(),
            alreadyPassed: passedQuiz.includes(q._id.toString()),
            blockedByCheating: disqualifiedQuiz.includes(q._id.toString())
        }))
        const totalQuiz = await Quiz.countDocuments({niveaux:niveaux})
        res.json({limit,skip,totalQuiz,finalQuiz});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:quizId', authMiddleware, async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const userId = req.user.userId;

        const userResult = await ResultsQuiz.find({ quizId });

        const isDisqualified = userResult.find(
            r => r.userId.toString() === userId && r.disqualified
        );

        if (isDisqualified) {
            return res.status(403).json({
                message: "Accès refusé : vous êtes disqualifié",
                reason: isDisqualified.disqualifiedReason
            });
        }

        const quiz = await Quiz.findById(quizId)
            .populate("professeur", "nom prenom")
            .populate("niveaux", "nom")
            .populate("matiere", "nom")
            .select("-questions.correctAnswer");

        if (!quiz) {
            return res.status(404).json({ message: "Quiz non trouvé" });
        }

        res.json(quiz);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/submit',authMiddleware,async(req,res)=>{
    const userId = req.user.userId;
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(quizId,{
        $addToSet:{participants:userId}
    });
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
        if (alreadyDone.disqualified) {
            return res.status(403).json({ message: "Quiz bloqué suite à une tentative de triche" });
        }
        return res.status(400).json({ message: "Vous avez déjà passé ce quiz" });
    }

    for (let i = 0; i < quiz.questions.length; i++) {
        const question = quiz.questions[i];
        const userAnswer = answers[i];
        if (question.correctAnswer === userAnswer) {
            score += 1;
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
        wrongAnswers,
    });
    res.json(result);
});

router.post('/report-cheating', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { quizId, reason } = req.body;

        if (!quizId) {
            return res.status(400).json({ message: "quizId est requis" });
        }

        const quiz = await Quiz.findByIdAndUpdate(quizId, {
            $addToSet: { participants: userId }
        });

        if (!quiz) {
            return res.status(404).json({ message: "Quiz non trouvé" });
        }

        const existingResult = await ResultsQuiz.findOne({ userId, quizId });
        if (existingResult) {
            if (!existingResult.disqualified) {
                existingResult.disqualified = true;
                existingResult.disqualifiedReason = reason || "Suspicion de triche";
                await existingResult.save();
            }
            return res.json({ success: true, blocked: true });
        }

        await ResultsQuiz.create({
            userId,
            quizId,
            score: 0,
            totalQuestions: quiz.questions.length,
            wrongAnswers: [],
            disqualified: true,
            disqualifiedReason: reason || "Suspicion de triche"
        });

        res.status(201).json({ success: true, blocked: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/results/:quizId',authMiddleware,async(req,res)=>{
    const userId = req.user.userId;
    const {quizId} = req.params;
    const results = await ResultsQuiz.find({quizId,userId:userId}).populate("quizId","text");
    const userResult = results.find(r => r.userId._id.toString() === userId);
    if (userResult && userResult.disqualified === true) {
            return res.status(403).json({
                message: "Vous êtes disqualifié de ce quiz",
                reason: userResult.disqualifiedReason
            });
    }
    res.json(results);
})

router.get('/leaderboard/:quizId', authMiddleware, async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const userId = req.user.userId;
        
        const results = await ResultsQuiz.find({ quizId,userId:userId })
            .populate('userId', 'nom prenom role')
            .sort({ score: -1 });

        const userResult = results.find(r => r.userId._id.toString() === userId);

        if (userResult && userResult.disqualified) {
            return res.status(403).json({
                message: "Vous êtes disqualifié de ce quiz",
                reason: userResult.disqualifiedReason
            });
        }

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/check/:quizId', authMiddleware, async (req, res) => {
    try {
        const result = await ResultsQuiz.findOne({
            userId: req.user.userId,
            quizId: req.params.quizId,
        });
        res.json({
            alreadyPassed: !!result,
            blockedByCheating: !!result?.disqualified
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;