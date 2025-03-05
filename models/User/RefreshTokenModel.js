`use strict`
const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
    accountID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deviceId: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model(`RefreshToken`, RefreshTokenSchema)