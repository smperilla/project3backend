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
router.delete('/:id', async (req, res)=>{
    try {
        res.json(await Folder.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(400).json(error);
    }
})

//UPDATE
router.put('/:id', async (req, res)=>{
    if(req.body.title){
        try {
            res.json(
                await Folder.findByIdAndUpdate(req.params.id, {title: req.body.title}, {new:true})
            )
        } catch (error) {
            res.status(400).json(error);
        }
    }
})

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
router.get('/:id', async (req,res)=>{
    try {
        res.json(await Folder.findById(req.params.id));
    } catch (error) {
        res.status(400).json(error);
    }

})

module.exports = router