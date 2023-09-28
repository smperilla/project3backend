const express = require('express')
const router = express.Router()

//SEED

//INDEX
router.get('/', (req, res)=>{
    res.send('testing from the chat route')
})

//DELETE
//UPDATE
//CREATE
//SHOW


module.exports = router