require("dotenv").config();
const express = require("express");
const app = express();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const User = require('./models/user')
const Chat = require('./models/chat')
const Folder = require('./models/folder')
const cors = require("cors");
const morgan = require("morgan");
const PORT = process.env.PORT;
const secret = process.env.SECRET
const session = require("express-session");
const folderController = require("./controllers/folderController.js");
const chatController = require("./controllers/chatController.js");
const authController = require("./controllers/authController.js");
const loginController = require("./controllers/loginController.js");

//MIDDLEWARE
app.use(cors());
const io = new Server(server,{
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    }
  });
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: secret }));

app.get("/", (req, res) => {
  res.send("testing!"+req.session.userid);
});

app.use("/users", authController);
app.use("/folders", folderController);
app.use("/chats", chatController);
app.use("/login", loginController);

io.on('connection', (socket)=>{
    console.log('a user connected')
    socket.join('globalRoom');
    socket.on('disconnect', ()=>{
        console.log('user disconnected');
    })
    socket.on('hello', (word)=>{
        console.log(word);
        socket.emit('hello', word)
    })
    socket.on('grabobject', async (word)=>{
        console.log(word);
        const obj = await User.findByIdAndUpdate('6515dc9ffc1ca272ca121d28', {username:'c'}, {new:true})
        console.log(obj);
        await obj.populate('folders')
        for (const folder of obj.folders){
            await folder.populate('chats')
            for (const author of folder.chats){
                await author.populate('users')
                await author.populate('zapAuthors')
            }
        }   
        socket.emit('object', obj)
    })
    socket.on('sendMessage', async(zap, userid)=>{
        console.log(zap.zap);
        console.log(zap.chatId);
        console.log(zap.folderId);
        await Chat.findByIdAndUpdate(zap.chatId, {$push: {zaps: zap.zap}}, {new:true})
        //BELOW HERE REQ.SESSIONS.USERID
        const updatedChat = await Chat.findByIdAndUpdate(zap.chatId, {$push: {zapAuthors: userid}}, {new:true})
        // await updatedChat.populate('users')
        // await updatedChat.populate('zapAuthors')
        // const user = await User.findById(userid)
        // await user.populate('folders')
        // for (const folder of user.folders){
        //     await folder.populate('chats')
        //     for (const author of folder.chats){
        //         await author.populate('users')
        //         await author.populate('zapAuthors')
        //     }
        // } 
        // const folder = await Folder.findById(zap.folderId)
        // await folder.populate('chats')
        // for (const chat of folder.chats){
        //     await chat.populate('users')
        //     await chat.populate('zapAuthors')
        // }
        // socket.emit('sentMessage', updatedChat, user, folder)
        // socket.emit('update', 'word')
        // socket.broadcast.emit('update', 'word')
        io.to('globalRoom').emit('update', 'word')
    })
    socket.on('updateMe', async (userid, folderid, chatid)=>{
        const user = await User.findById(userid)
        await user.populate('folders')
        for (const folder of user.folders){
            await folder.populate('chats')
            for (const author of folder.chats){
                await author.populate('users')
                await author.populate('zapAuthors')
            }
        } 
        const folder = await Folder.findById(folderid)
        await folder.populate('chats')
        for (const chat of folder.chats){
            await chat.populate('users')
            await chat.populate('zapAuthors')
        }
        const chat = await Chat.findById(chatid)
        await chat.populate('users')
        await chat.populate('zapAuthors')
        socket.emit('updatedYou', user, folder, chat)
    })

    socket.on('renameFolder', async(folder, folderId, userid)=>{
        console.log(folder);
        console.log(folderId);
        await Folder.findByIdAndUpdate(folderId, {title:folder}, {new:true})
        const user = await User.findById(userid)
        await user.populate('folders')
        for (const folder of user.folders){
            await folder.populate('chats')
            for (const author of folder.chats){
                await author.populate('users')
                await author.populate('zapAuthors')
            }
        } 
        socket.emit('renamedFolder', user)
    })
    socket.on('makeNewFolder', async (folder, userid)=>{
        console.log(folder);
        let newFolderTitle
        if (folder==''){
            newFolderTitle='Untitled Folder'
        } else{
            newFolderTitle=folder
        }
        const newFolder = await Folder.create({title:newFolderTitle})
        const newFolderId = newFolder._id.toHexString()
        const user = await User.findByIdAndUpdate(userid, {$push: {folders: newFolderId}},{new:true})
        await user.populate('folders')
        for (const folder of user.folders){
            await folder.populate('chats')
            for (const author of folder.chats){
                await author.populate('users')
                await author.populate('zapAuthors')
            }
        } 
        socket.emit('createdFolder', user)
    })
    socket.on('startNewChat', async(rec, sub, zap, userid)=>{
        console.log(rec,sub,zap, userid);
        const newChat = {}
        if (sub==''){
            newChat.subject = 'No Subject'
        } else {
            newChat.subject = sub
        }
        const recipient = await User.findOne({username:rec})
        newChat.users = [recipient._id.toHexString()]
        newChat.users.push(userid)
        newChat.zaps = [zap]
        newChat.zapAuthors = [userid]
        const createdChat= await Chat.create(newChat)
        const createdChatId = createdChat._id.toHexString()
        await createdChat.populate('users')
        for (const user of createdChat.users){
            await user.populate('folders')
            const inbox = user.folders.find(f=>f.title=='inbox')
            const inboxId = inbox._id.toHexString()
            await Folder.findByIdAndUpdate(inboxId, {$push: {chats: createdChatId}}, {new:true})
        }
        const user = await User.findById(userid)
        await user.populate('folders')
        for (const folder of user.folders){
            await folder.populate('chats')
            for (const author of folder.chats){
                await author.populate('users')
                await author.populate('zapAuthors')
            }
        } 
        socket.emit('createdNewChat', user)
    })
    socket.on('moveFolder', async(obj, destination, userid)=>{
        console.log(obj);
        console.log(destination);
        await Folder.findByIdAndUpdate(obj.currentFolderId, {$pull: {chats: obj.chatId}}, {new:true})
        const newDestination = await Folder.findByIdAndUpdate(destination, {$push: {chats: obj.chatId}}, {new:true})
        const user = await User.findById(userid)
        await user.populate('folders')
        for (const folder of user.folders){
            await folder.populate('chats')
            for (const author of folder.chats){
                await author.populate('users')
                await author.populate('zapAuthors')
            }
        } 
        await newDestination.populate('chats')
        for (const author of newDestination.chats){
            await author.populate('users')
            await author.populate('zapAuthors')
        }
        socket.emit('movedFolder', user, newDestination)
    })
})


// app.listen(PORT, () => {
//   console.log(`hello from port: ${PORT}`);
// })
server.listen(PORT, ()=>{
    console.log('hello from socket on port:', PORT);
});
;
