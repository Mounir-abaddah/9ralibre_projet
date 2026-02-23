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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1)*limit;
    try {
        const niveauxName = req.params.niveauxName;
        const niveaux = await Niveaux.findOne({nom:niveauxName});
        if (!niveaux) {
            return res.status(404).json({ message: "Niveau non trouvé" });
        }
        const quiz = await Quiz.find({ niveaux: niveaux })
        .populate("professeur","nom prenom image role")
        .populate("niveaux","nom")
        .populate("matiere","nom")
        .select("-questions.correctAnswer")
        .limit(limit)
        .skip(skip)
        .sort({createdAt:-1});

        const usersResults = await ResultsQuiz.find({
            userId:req.user.userId
        });
        const passedQuiz = usersResults.map(r => r.quizId.toString());
        const finalQuiz = quiz.map(q => ({
            ...q.toObject(),
            alreadyPassed: passedQuiz.includes(q._id.toString())
        }))
        const totalQuiz = await Quiz.countDocuments({niveaux:niveaux})
        res.json({limit,skip,totalQuiz,finalQuiz});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:quizId', authMiddleware, async (req, res) => {
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

router.get('/results/:quizId',authMiddleware,async(req,res)=>{
    const userId = req.user.userId;
    const {quizId} = req.params;
    const results = await ResultsQuiz.find({quizId,userId:userId}).populate("quizId","text");
    res.json(results);
})

router.get('/leaderboard/:quizId', authMiddleware, async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const userId = req.user.userId;
        const results = await ResultsQuiz.find({ quizId,userId:userId })
            .populate('userId', 'nom prenom role')
            .sort({ score: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/check/:quizId', authMiddleware, async (req, res) => {
    try {
        const alreadyDone = await ResultsQuiz.findOne({
            userId: req.user.userId,
            quizId: req.params.quizId,
        });
        res.json({ alreadyPassed: !!alreadyDone });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;