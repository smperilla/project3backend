const mongoose = require('../database/connection')

const draftSchema = new mongoose.Schema(
    {
        recipients: [{ref: 'User', type: mongoose.Schema.Types.ObjectId }],
        subject: String,
        zap: String
    },
    {timestamps: true}
)

const Draft = mongoose.model('Draft', draftSchema)

module.exports = Draft