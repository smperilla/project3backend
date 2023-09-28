const mongoose = require('../database/connection')

const folderSchema = new mongoose.Schema(
    {
        title: String,
        chats: [{ref: 'Chat', type: mongoose.Schema.Types.ObjectId }]
    },
    {timestamps: true}
)

const Folder = mongoose.model('Folder', folderSchema)

module.exports = Folder