const mongoose = require('mongoose');

const cookieSchema = new mongoose.Schema({
    account: {
        type: String,
        required: true
    },
    cookies: {
        type: Array,
        required: true
    },
    timestamp: {
        type: Date,
        required: false,
        default: new Date()
    }
});

module.exports = mongoose.model('Cookie', cookieSchema);