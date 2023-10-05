require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const User = require('./models/user')
const cors = require('cors')
const morgan = require('morgan')
const PORT = process.env.PORT
const folderController = require('./controllers/folderController.js')
const chatController = require('./controllers/chatController.js')
const authController = require('./controllers/authController.js')
//MIDDLEWARE
app.use(cors())
const io = new Server(server,{
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    }
  });
app.use(morgan('tiny'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.get('/', (req, res)=>{
    res.send('testing!')
})

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
})

  
app.use('/users', authController)
app.use('/folders', folderController)
app.use('/chats', chatController)

// app.listen(PORT, ()=>{
//     console.log(`hello from port: ${PORT}`);
// })
server.listen(PORT, ()=>{
    console.log('hello from socket on port:', PORT);
});
