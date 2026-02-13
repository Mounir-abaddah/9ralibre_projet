const express = require('express');
const router = express.Router();
const Saved = require('../models/EnregistrerModel');
const authMiddleware = require('../middlewares/authMiddleware');

// Sauvegarder un item
router.post("/toggle-save", authMiddleware, async (req, res) => {
    const { itemId, itemModel } = req.body;
    try {
        const existing = await Saved.findOne({
            user: req.user.userId,
            item: itemId
        });

        if (existing) {
            await Saved.findByIdAndDelete(existing._id);
            return res.status(200).json({ isSaved: false, message: "Item supprimé" });
        }

        await Saved.create({
            user: req.user.userId,
            item: itemId,
            itemModel
        });

        return res.status(201).json({ isSaved: true, message: "Item sauvegardé" });
    } catch (error) {
        console.error("Erreur lors du toggle save:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.get("/my-saved", authMiddleware, async (req, res) => {
    try {
        const savedItems = await Saved.find({
            user: req.user.userId
        })
        .populate({
            path: 'item',
            populate: [
                { path: 'matiere', select: 'nom' },
                { path: 'professeur', select: 'nom prenom image' },
            ]
        }).sort({ createdAt: -1 });
        return res.status(200).json(savedItems);
    } catch (error) {
        console.error("Erreur lors de la récupération des items sauvegardés:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


module.exports = router;