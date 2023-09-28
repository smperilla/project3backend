require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const PORT = process.env.PORT
const foldersController = require('./controllers/foldersController.js')

//MIDDLEWARE
app.use(cors())
app.use(morgan('tiny'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.get('/', (req, res)=>{
    res.send('testing!')
})

app.use('/folders', foldersController)

app.listen(PORT, ()=>{
    console.log(`hello from port: ${PORT}`);
})