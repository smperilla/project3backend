const Chat = require('../models/chat')
const User = require('../models/user')
const Folder = require('../models/folder')
const Draft = require('../models/draft')
const express = require('express')
const router = express.Router()

//INDEX
router.get('/', async(req, res)=>{
    res.json(await Draft.find({}))
})

//CREATE
router.post('/', async(req, res)=>{
    res.json(await Draft.create(req.body))
})

//SHOW
router.get('/:id', async(req, res)=>{
    res.json(await Draft.findById(req.params.id))
})

module.exports = router