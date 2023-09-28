const Folder = require('../models/folder')
const User = require('../models/user')
const Chat = require('../models/chat')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res)=>{
    const users = await User.find({})
    for (const user of users) {
        await user.populate('folders')
    }
    res.json(users)
})

router.get('/seed', async (req, res)=>{
    await User.deleteMany({})
    await Folder.deleteMany({})
    await Chat.deleteMany({})
    const starterFolders = [
        {title: 'inbox'},
        {title: 'sent'},
        {title: 'deleted'},
        {title: 'My First Folder'}
    ]
    const aFolders = await Folder.create(starterFolders)
    const bFolders = await Folder.create(starterFolders)
    const cFolders = await Folder.create(starterFolders)
    const dFolders = await Folder.create(starterFolders)
    const fFolders = await Folder.create(starterFolders)
    
    const aFoldersIds = []
    await aFolders.forEach(f=>{aFoldersIds.push(f._id)})
    const bFoldersIds = []
    await bFolders.forEach(f=>{bFoldersIds.push(f._id)})
    const cFoldersIds = []
    await cFolders.forEach(f=>{cFoldersIds.push(f._id)})
    const dFoldersIds = []
    await dFolders.forEach(f=>{dFoldersIds.push(f._id)})
    const fFoldersIds = []
    await fFolders.forEach(f=>{fFoldersIds.push(f._id)})

    const starterUsers = [
        {username: 'a', password: 'a', folders:aFoldersIds},
        {username: 'b', password: 'b', folders:bFoldersIds},
        {username: 'c', password: 'c', folders:cFoldersIds},
        {username: 'd', password: 'd', folders:dFoldersIds},
        {username: 'f', password: 'f', folders:fFoldersIds}
    ]
    const createdUsers = await User.create(starterUsers)
    for (const user of createdUsers) {
        await user.populate('folders')
    }
    res.json(createdUsers)
})

module.exports = router