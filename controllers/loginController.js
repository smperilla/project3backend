require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Folder = require('../models/folder.js')
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.SALT_ROUNDS)

router.get("/", (req, res) => {
  res.send("login");
});

router.post("/", async (req, res) => {
  console.log(req.body);

  let userToLogin = await User.findOne({ username: req.body.username });
  console.log(userToLogin);
  if (userToLogin) {
    bcrypt.compare(req.body.password, userToLogin.password, (err, result) => {
      if (result) {
        const id = userToLogin._id.toHexString();
        req.session.userid = id
        // req.session.username = userToLogin.name;
        res.json({
          message: "success",
          // userid: userToLogin._id.toHexString(),
          userid: req.session.userid
          // username: userToLogin.username,
        });
      } else {
        res.json("Incorrect Password");
      }
    });
  }
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res) => {
  if (req.body.username && req.body.password) {
    let plainTextPassword = req.body.password;
    bcrypt.hash(plainTextPassword, saltRounds, async (err, hashedPassword) => {
      req.body.password = hashedPassword;
      let newUser = await User.create(req.body);
      const starterFolders = [
        {title: 'inbox'},
        {title: 'sent'},
        {title: 'deleted'},
        {title: 'drafts'},
        {title: 'plans'}
      ]
      const createdStarterFolders = await Folder.create(starterFolders)
      const starterFoldersIds = []
      await createdStarterFolders.forEach(f=>{starterFoldersIds.push(f._id)})
      await User.findByIdAndUpdate(newUser._id, {folders:starterFoldersIds}, {new:true})
      res.send(newUser);
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to logout.");
    }
    res.clearCookie("connect.sid"); 
    return res.send("Logged out!");
  });
});

module.exports = router;
