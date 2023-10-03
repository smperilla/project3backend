const Chat = require('../models/chat')
const User = require('../models/user')
const Folder = require('../models/folder')
const express = require('express')
const router = express.Router()

//SEED
router.get('/seed', async (req, res)=>{
    await Chat.deleteMany({})
    const userA = await User.findOne({username: 'a'}).populate('folders')
    const userB = await User.findOne({username: 'b'}).populate('folders')
    const userC = await User.findOne({username: 'c'}).populate('folders')
    const userD = await User.findOne({username: 'd'}).populate('folders')
    const userF = await User.findOne({username: 'f'}).populate('folders')
    const users = [userA, userB, userC, userD, userF]
    const userAId = userA._id.toHexString()
    const userBId = userB._id.toHexString()
    const userCId = userC._id.toHexString()
    const userDId = userD._id.toHexString()
    const userFId = userF._id.toHexString()
    const starterConvos = [
    {
        subject: 'Dinner',
        users: [userCId, userBId],
        zaps: ['hey', 'yo', 'what do you wanna do for dinner?', 'idk', '...', 'you?', 'pizza?', 'pizzaaaaa'],
        zapAuthors: [userCId, userBId, userCId, userBId, userBId, userBId, userCId, userBId]
    },
    {
        subject: 'Breakfast',
        users: [userCId, userBId],
        zaps: ['hey bro', 'whats up', 'what do you wanna do for breakfast?', 'pancakes.', 'legend, yes'],
        zapAuthors: [userCId, userBId, userCId, userBId, userCId]
    },
    {
        subject: 'Want to go on a Date with me?',
        users: [userCId, userAId],
        zaps: ['hey, I was wondering if you are free tongiht?', 'heyyyy', '....', 'idk...', 'tough'],
        zapAuthors: [userCId, userAId, userAId, userAId, userCId]
    },
    {
        subject: 'Concert tomorrow',
        users: [userCId, userBId, userDId, userFId],
        zaps: ['so excited for tomorrow!', 'woooo', 'ayyy', 'wait, who invited c...', 'shoot my bad guys'],
        zapAuthors: [userCId, userBId, userDId, userFId, userFId, userBId]
    }]
    const createdConvos = await Chat.create(starterConvos)
    const convo1Id = createdConvos[0]._id.toHexString()
    const convo2Id = createdConvos[1]._id.toHexString()
    const convo3Id = createdConvos[2]._id.toHexString()
    const convo4Id = createdConvos[3]._id.toHexString()
    const inboxC = userC.folders.find(f=>f.title=='inbox')
    console.log(inboxC);
    res.json(createdConvos)
})

//INDEX
router.get('/', async(req, res)=>{
    res.json(await Chat.find({}))
})

//DELETE
//UPDATE
//CREATE
//SHOW


module.exports = router