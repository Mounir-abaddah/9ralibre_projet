const mongoose = require('mongoose');

const ConversatonSchema = new mongoose.Schema({
    members:[{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"User"
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }
},{
    timestamps:true
});

const ConversatonModel = mongoose.model("Conversation",ConversatonSchema,"conversation");

module.exports = ConversatonModel;