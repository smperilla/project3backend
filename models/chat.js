const mongoose = require('../database/connection')

const chatSchema = new mongoose.Schema(
    {
        subject: String,
        users: [{ref: 'User', type: mongoose.Schema.Types.ObjectId }],
        zaps: [String],
        zapAuthors: [{ref: 'User', type: mongoose.Schema.Types.ObjectId }]
    },
    {timestamps: true}
)

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat