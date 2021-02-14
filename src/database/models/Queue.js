const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
    card_id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    app: {
        type: Number,
        required: false
    },
    author: {
        type: String,
        required: true
    },
    message_id: {
        type: Number,
        required: false
    },
    language: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        required: false,
        default: new Date()
    }
});

module.exports = mongoose.model('Queue', queueSchema);