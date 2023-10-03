const mongoose = require('../database/connection')

const userSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        folders: [{ref: 'Folder', type: mongoose.Schema.Types.ObjectId }],
        drafts: [{ref: 'Draft', type: mongoose.Schema.Types.ObjectId }]
    },
    {timestamps: true}
)

const User = mongoose.model('User', userSchema)

module.exports = User