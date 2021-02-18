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
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    like: {
        type: Number,
        required: false,
        default: 0
    },
    dislike: {
        type: Number,
        required: false,
        default: 0
    },
    lastCommentId: {
        type: Number,
        required: false,
        default: 0
    },
    votedPeople: {
        type: Array,
        required: false,
        default: []
    },
    timestamp: {
        type: Date,
        required: false,
        default: new Date()
    }
});

module.exports = mongoose.model('Card', cardSchema);