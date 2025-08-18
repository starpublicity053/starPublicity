const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
    },
    messages: [{
        role: {
            type: String, // 'user' or 'bot'
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    }],
    intent: { // The final intent detected by Dialogflow
        type: String, 
    },
}, { timestamps: true });

const ChatLog = mongoose.model('ChatLog', chatLogSchema);
module.exports = ChatLog;