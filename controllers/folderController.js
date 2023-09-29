const Folder = require('../models/folder')
const User = require('../models/user')
const express = require('express')
const router = express.Router()

//SEED

//INDEX
router.get('/', async (req, res)=>{
    const folders = await Folder.find({})
    res.json(folders)
})

//DELETE
//UPDATE
//CREATE
router.post("/", async (req, res) => {
    try {
        const newFolder = await Folder.create(req.body)
        const newFolderId = newFolder._id.toHexString()
        // await User.findByIdAndUpdate('req.session.userid', {$push: {folders: newFolderId}},{new:true})
        await User.findByIdAndUpdate('6515dc9ffc1ca272ca121d28', {$push: {folders: newFolderId}},{new:true})
        res.json(newFolder);
    } catch (error) {
      res.status(400).json(error);
    }
});
//SHOW


module.exports = router