const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { 
    timestamps: true 
});

const ConversationModel = mongoose.model("Conversation",ConversationSchema);

module.exports = ConversationModel
