const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    card_id: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: false,
        default: 0
    },
    dislikes: {
        type: Number,
        required: false,
        default: 0
    },
    voted: {
        type: Array,
        required: false,
        default: []
    },
    timestamp: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Card', cardSchema);