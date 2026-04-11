  const express = require('express');
  const router = express.Router();
  const Conversation = require('../models/ConversationModel');
  const Message = require('../models/MessagesModel');
  const authMiddleware = require('../middlewares/authMiddleware');



router.post('/start-conversation',authMiddleware,async(req,res)=>{
      const userId = req.user.userId;
      const {user} = req.body;
      if(userId === user){
          return res.status(400).json({ message: "Impossible de discuter avec soi-même" });
      }
      let conversation = await Conversation.findOne({
          members:{
              $all:[userId,user]
          }
      })
      if (conversation) {
          return res.json(conversation);
      }
      conversation = await Conversation.create({
          members: [userId, user]
      });

      res.status(201).json(conversation);
  });

  router.get('/my-conversation', authMiddleware, async (req, res) => {
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


  router.get('/my-conversation/:conversationId',authMiddleware,async(req,res)=>{
      const conversationId = req.params.conversationId
      const conversation = await Conversation.findById(conversationId).populate("members","nom prenom role image")
      .populate("lastMessage","text sender")
      res.json(conversation)
  });

  router.put('/mark-as-read/:conversationId', authMiddleware, async (req, res) => {
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
  

  router.post('/messages',authMiddleware,async(req,res)=>{
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

  router.get('/get-messages/:conversationId',authMiddleware,async(req,res)=>{
      const conversationId = req.params.conversationId;
      const messages = await Message.find({
          conversationId:conversationId
      }).populate("sender", "nom prenom image")
      .sort({ createdAt: 1 });
      res.json(messages)
  });



  module.exports = router;