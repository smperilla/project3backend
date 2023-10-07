const Chat = require('../models/chat')
const User = require('../models/user')
const Folder = require('../models/folder')
const express = require('express')
const router = express.Router()

//SEED
// router.get('/seed', async (req, res)=>{
//     await Chat.deleteMany({})
//     const userA = await User.findOne({username: 'a'}).populate('folders')
//     const userB = await User.findOne({username: 'b'}).populate('folders')
//     const userC = await User.findOne({username: 'c'}).populate('folders')
//     const userD = await User.findOne({username: 'd'}).populate('folders')
//     const userF = await User.findOne({username: 'f'}).populate('folders')
//     const users = [userA, userB, userC, userD, userF]
//     const userAId = userA._id.toHexString()
//     const userBId = userB._id.toHexString()
//     const userCId = userC._id.toHexString()
//     const userDId = userD._id.toHexString()
//     const userFId = userF._id.toHexString()
//     const starterConvos = [
//     {
//         subject: 'Dinner',
//         users: [userCId, userBId],
//         zaps: ['hey', 'yo', 'what do you wanna do for dinner?', 'idk', '...', 'you?', 'pizza?', 'pizzaaaaa'],
//         zapAuthors: [userCId, userBId, userCId, userBId, userBId, userBId, userCId, userBId]
//     },
//     {
//         subject: 'Breakfast',
//         users: [userCId, userBId],
//         zaps: ['hey bro', 'whats up', 'what do you wanna do for breakfast?', 'pancakes.', 'legend, yes'],
//         zapAuthors: [userCId, userBId, userCId, userBId, userCId]
//     },
//     {
//         subject: 'Want to go on a Date with me?',
//         users: [userCId, userAId, userBId],
//         zaps: ['hey, I was wondering if you are free tongiht?', 'heyyyy', '....', 'idk...', 'tough', 'this is tough to watch...why am i on this'],
//         zapAuthors: [userCId, userAId, userAId, userAId, userCId, userBId]
//     },
//     {
//         subject: 'Concert tomorrow',
//         users: [userCId, userBId, userDId, userFId],
//         zaps: ['so excited for tomorrow!', 'woooo', 'ayyy', 'wait, who invited c...', 'shoot my bad guys'],
//         zapAuthors: [userCId, userBId, userDId, userFId, userBId, userCId]
//     }]
//     const createdConvos = await Chat.create(starterConvos)
//     const convo1Id = createdConvos[0]._id.toHexString()
//     const convo2Id = createdConvos[1]._id.toHexString()
//     const convo3Id = createdConvos[2]._id.toHexString()
//     const convo4Id = createdConvos[3]._id.toHexString()
//     const inboxB = userB.folders.find(f=>f.title=='inbox')
//     const plansB = userB.folders.find(f=>f.title=='plans')
//     const inboxC = userC.folders.find(f=>f.title=='inbox')
//     const plansC = userC.folders.find(f=>f.title=='plans')
//     const inboxBId = inboxB._id.toHexString()
//     const plansBId = plansB._id.toHexString()
//     const inboxCId = inboxC._id.toHexString()
//     const plansCId = plansC._id.toHexString()
//     await Folder.findByIdAndUpdate(inboxBId, {$push: {chats: [convo1Id, convo2Id, convo3Id]}}, {new: true})
//     await Folder.findByIdAndUpdate(plansBId, {$push: {chats: convo4Id}}, {new: true})
//     await Folder.findByIdAndUpdate(inboxCId, {$push: {chats: [convo1Id, convo2Id, convo3Id]}}, {new: true})
//     await Folder.findByIdAndUpdate(plansCId, {$push: {chats: convo4Id}}, {new: true})
//     res.json(createdConvos)
// })

//INDEX
router.get('/', async(req, res)=>{
    res.json(await Chat.find({}))
})

//DELETE
//UPDATE
router.put('/:id', async (req, res)=>{
    try {
        await Chat.findByIdAndUpdate(req.params.id, {$push: {zaps: req.body.zap}}, {new:true})
        //BELOW HERE REQ.SESSIONS.USERID
        await Chat.findByIdAndUpdate(req.params.id, {$push: {zapAuthors: '6515dc9ffc1ca272ca121d28'}}, {new:true})
        res.json(req.body)
    } catch (error) {
        res.status(400).json(error);
    }
})

//CREATE
router.post("/", async (req, res) => {
    try {
        const newChat = {}
        if (req.body.subject){
            newChat.subject = req.body.subject
        } else {
            newChat.subject = 'No Subject'
        }
        const recipient = await User.findOne({username:req.body.recipients})
        newChat.users = [recipient._id.toHexString()]
        newChat.users.push('6515dc9ffc1ca272ca121d28')
        //REQ.SESSION.USERID^
        newChat.zaps = [req.body.zap]
        newChat.zapAuthors = ['6515dc9ffc1ca272ca121d28']
        //REQ.SESSION.USERID^
        const createdChat= await Chat.create(newChat)
        const createdChatId = createdChat._id.toHexString()
        console.log(createdChat);
        console.log(createdChatId);
        await createdChat.populate('users')
        for (const user of createdChat.users){
            await user.populate('folders')
            const inbox = user.folders.find(f=>f.title=='inbox')
            const inboxId = inbox._id.toHexString()
            await Folder.findByIdAndUpdate(inboxId, {$push: {chats: createdChatId}}, {new:true})
        }
        res.json(createdChat)
    } catch (error) {
      res.status(400).json(error);
    }
});
//SHOW


module.exports = router