require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').createServer(app);
const { Server } = require("socket.io");

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
