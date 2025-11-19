const express = require ("express")
const { getuser, adduser,loginUser } = require ("../controller/UserController")

const app = express.Router()

app.get("/user", getuser)
app.post("/add", adduser)
app.post("/login",loginUser)


module.exports = app