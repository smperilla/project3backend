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
const session = require("express-session");
const folderController = require("./controllers/folderController.js");
const chatController = require("./controllers/chatController.js");
const authController = require("./controllers/authController.js");
const loginController = require("./controllers/loginController.js");
const allowedOrigin = 'http://localhost:3000';
const corsOptions = {
    origin: allowedOrigin,
    credentials: true, // Allow credentials (cookies)
  };
//MIDDLEWARE
app.use(cors(corsOptions));
const io = new Server(server,{
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    }
  });
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ 
    secret: "somestring", 
    cookie: { domain: '.http://localhost:4000' } 
}));

app.get("/", (req, res) => {
  res.send("testing!"+req.session.userid);
});

app.use("/users", authController);
app.use("/folders", folderController);
app.use("/chats", chatController);
app.use("/login", loginController);

io.on('connection', (socket)=>{
    console.log('a user connected')
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
    socket.on('sendMessage', async(zap)=>{
        console.log(zap.zap);
        console.log(zap.chatId);
        console.log(zap.folderId);
        await Chat.findByIdAndUpdate(zap.chatId, {$push: {zaps: zap.zap}}, {new:true})
        //BELOW HERE REQ.SESSIONS.USERID
        const updatedChat = await Chat.findByIdAndUpdate(zap.chatId, {$push: {zapAuthors: '6515dc9ffc1ca272ca121d28'}}, {new:true})
        await updatedChat.populate('users')
        await updatedChat.populate('zapAuthors')
        const user = await User.findById('6515dc9ffc1ca272ca121d28')
        await user.populate('folders')
        for (const folder of user.folders){
            await folder.populate('chats')
            for (const author of folder.chats){
                await author.populate('users')
                await author.populate('zapAuthors')
            }
        } 
        const folder = await Folder.findById(zap.folderId)
        await folder.populate('chats')
        for (const chat of folder.chats){
            await chat.populate('users')
            await chat.populate('zapAuthors')
        }
        socket.emit('sentMessage', updatedChat, user, folder)
    })
})

  
// app.listen(PORT, () => {
//   console.log(`hello from port: ${PORT}`);
// })
server.listen(PORT, ()=>{
    console.log('hello from socket on port:', PORT);
});
;
