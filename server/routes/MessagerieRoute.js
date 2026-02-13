const express = require('express');
const router = express.Router();
const Conversation = require('../models/ConversationModel');
const authMiddleware = require('../middlewares/authMiddleware');
const Message = require('../models/MessagerieModel');

router.post('/conversation',authMiddleware,async(req,res)=>{
    const senderId = req.user.userId;
    const receiverId = req.body.receiverId;
    let conversation = await Conversation.findOne({
        members:{            
            $all:[
                senderId,receiverId
            ]
        }
    })
    if (!conversation) {
        conversation = await Conversation.create({
            members: [senderId, receiverId]
        });
    }

    res.status(200).json(conversation);
});


router.get('/conversations', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        const conversations = await Conversation.find({
            members: { $in: [userId] }
        })
        .sort({updatedAt:-1})
        .populate("members", "nom prenom image role");

        const conversationsWithUnread = await Promise.all(
            conversations.map(async (conv) => {

                const unreadCount = await Message.countDocuments({
                conversationId: conv._id,
                sender: { $ne: userId },
                readBy: { $ne: userId }
                });

                return {
                ...conv.toObject(),
                unreadCount
                };
            })
        );

        res.status(200).json(conversationsWithUnread);

    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.get('/messages/:conversationId',authMiddleware,async(req,res)=>{
    const messages = await Message.find({
        conversationId:req.params.conversationId
    }).sort({createdAt:-1});
        await Message.updateMany(
    {
        conversationId: req.params.conversationId,
        sender: { $ne: req.user.userId },
        readBy: { $ne: req.user.userId }
    },
    {
        $push: { readBy: req.user.userId }
    }
    );
    res.status(200).json(messages)
})

router.post('/messages',authMiddleware,async(req,res)=>{
    const {conversationId,text} = req.body;
    const sender = req.user.userId;
    if (!conversationId || !text) {
        return res.status(400).json({ message: "Champs manquants" });
    }
    const newMessage = await Message.create({
        conversationId,
        sender,
        text,
        readBy:[sender]
    });
    await Conversation.findByIdAndUpdate(conversationId, {
        updatedAt: new Date()
    });
    res.status(201).json(newMessage);
})


module.exports = router;