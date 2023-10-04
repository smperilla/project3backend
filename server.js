require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const PORT = process.env.PORT;
const session = require("express-session");
const folderController = require("./controllers/folderController.js");
const chatController = require("./controllers/chatController.js");
const authController = require("./controllers/authController.js");
const loginController = require("./controllers/loginController.js");

//MIDDLEWARE
app.use(cors());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: "somestring", cookie: { maxAge: 3600000 } }));

app.get("/", (req, res) => {
  res.send("testing!");
});

app.use("/users", authController);
app.use("/folders", folderController);
app.use("/chats", chatController);
app.use("/login", loginController);

app.listen(PORT, () => {
  console.log(`hello from port: ${PORT}`);
});
