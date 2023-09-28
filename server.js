require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const PORT = process.env.PORT || 4000
const folderController = require('./controllers/folderController.js')
const chatController = require('./controllers/chatController.js')
const authController = require('./controllers/authController.js')
//MIDDLEWARE
app.use(cors())
app.use(morgan('tiny'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.get('/', (req, res)=>{
    res.send('testing!')
})

app.use('/users', authController)
app.use('/folders', folderController)
app.use('/chats', chatController)

app.listen(PORT, ()=>{
    console.log(`hello from port: ${PORT}`);
})