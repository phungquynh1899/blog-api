`use strict`

const mongoose = require(`mongoose`)

const PublicKeySchema = new mongoose.Schema({
    accountID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    publicKey: {
        type: String,
        required: true
    },
    deviceId: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

const PublicKeyModel = mongoose.model("publickey", PublicKeySchema)
module.exports = PublicKeyModel