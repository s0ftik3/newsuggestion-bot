const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: false
    },
    language: {
        type: String,
        required: false,
        default: 'en'
    },
    cards: {
        type: Array,
        required: false,
        default: []
    },
    banned: {
        type: Boolean,
        required: false,
        default: false
    },
    neverAskMedia: {
        type: Boolean,
        required: false,
        default: false
    },
    autoTranslate: {
        type: Boolean,
        required: false,
        default: false
    },
    role: {
        type: String,
        required: false,
        default: 'user'
    },
    timestamp: {
        type: Date,
        required: false,
        default: new Date()
    }
});

module.exports = mongoose.model('User', userSchema);