require("dotenv").config();
const Folder = require('../models/folder')
const User = require('../models/user')
const Chat = require('../models/chat')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10
let aPassword = process.env.ASEED
let bPassword = process.env.BSEED
let cPassword = process.env.CSEED
let dPassword = process.env.DSEED
let fPassword = process.env.FSEED

router.get('/', async (req, res)=>{
    const users = await User.find({})
    for (const user of users) {
        await user.populate('folders')
    }
    res.json(users)
})

// router.get('/seed', async (req, res)=>{
//     await User.deleteMany({})
//     await Folder.deleteMany({})
//     await Chat.deleteMany({})
//     const starterFolders = [
//         {title: 'inbox'},
//         {title: 'sent'},
//         {title: 'deleted'},
//         {title: 'drafts'},
//         {title: 'plans'}
//     ]
//     const aFolders = await Folder.create(starterFolders)
//     const bFolders = await Folder.create(starterFolders)
//     const cFolders = await Folder.create(starterFolders)
//     const dFolders = await Folder.create(starterFolders)
//     const fFolders = await Folder.create(starterFolders)
    
//     const aFoldersIds = []
//     await aFolders.forEach(f=>{aFoldersIds.push(f._id)})
//     const bFoldersIds = []
//     await bFolders.forEach(f=>{bFoldersIds.push(f._id)})
//     const cFoldersIds = []
//     await cFolders.forEach(f=>{cFoldersIds.push(f._id)})
//     const dFoldersIds = []
//     await dFolders.forEach(f=>{dFoldersIds.push(f._id)})
//     const fFoldersIds = []
//     await fFolders.forEach(f=>{fFoldersIds.push(f._id)})
//     let seedPasswords = [aPassword, bPassword, cPassword, dPassword, fPassword]
//     let seedScrambledPasswords = []
//     for (const pass of seedPasswords) {
//         const hashedPassword = await bcrypt.hash(pass, saltRounds);
//         seedScrambledPasswords.push(hashedPassword);
//     }
//     const starterUsers = [
//         {username: 'a', password: seedScrambledPasswords[0], folders:aFoldersIds},
//         {username: 'b', password: seedScrambledPasswords[1], folders:bFoldersIds},
//         {username: 'c', password: seedScrambledPasswords[2], folders:cFoldersIds},
//         {username: 'd', password: seedScrambledPasswords[3], folders:dFoldersIds},
//         {username: 'f', password: seedScrambledPasswords[4], folders:fFoldersIds}
//     ]
//     const createdUsers = await User.create(starterUsers)
//     for (const user of createdUsers) {
//         await user.populate('folders')
//     }
//     res.json(createdUsers)
// })

router.get('/:id', async (req, res)=>{
    const user = await User.findById(req.params.id)
    // await user.populate('drafts')
    await user.populate('folders')
    for (const folder of user.folders){
        await folder.populate('chats')
        for (const author of folder.chats){
            await author.populate('users')
            await author.populate('zapAuthors')
        }
    }   
    res.json(user)
})

module.exports = router