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
    suggestionCount: {
        type: Number,
        required: false,
        default: 0
    },
    timestamp: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);