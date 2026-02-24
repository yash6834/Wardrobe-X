const express = require ("express")
const { getuser, adduser,loginUser,getUserProfile } = require ("../controller/UserController")
const {protect} = require("../middlewares/authMiddleware")

const app = express.Router()

app.get("/user", getuser)
app.post("/add", adduser)
app.post("/login",loginUser)
app.get("/profile", protect, getUserProfile);


module.exports = app