const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId , 
        ref:"Conversation"
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId , 
        ref:"User",
        required:true
    },
    text:{
        type:String
    },
    readBy:[{
        type:mongoose.Schema.Types.ObjectId , 
        ref:"User"
    }]
},{
    timestamps:true
})

const MessageModel = mongoose.model("Message",MessageSchema,"message");
module.exports = MessageModel;