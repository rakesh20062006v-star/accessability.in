const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    accountType: {
        type: String,
        enum: ['Individual', 'Organization'],
        required: true
    },

    disabilityTypes: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('User', UserSchema);