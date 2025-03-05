`use strict`

const mongoose = require(`mongoose`)

const PrivateKeySchema = new mongoose.Schema({
    accountID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    privateKey: {
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

const PrivateKeyModel = mongoose.model("privatekey", PrivateKeySchema)
module.exports = PrivateKeyModel