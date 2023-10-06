const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

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
    bcrypt.hash(plainTextPassword, 10, async (err, hashedPassword) => {
      req.body.password = hashedPassword;
      let newUser = await User.create(req.body);
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
      // handle error
      return res.status(500).send("Failed to logout.");
    }
    // Clear the session cookie from the client-side
    res.clearCookie("connect.sid"); // 'connect.sid' is the default cookie name used by express-session
    return res.send("Logged out!");
  });
});

//Need headers with credentials set to true.

module.exports = router;
