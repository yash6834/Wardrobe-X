//import mongoose 
const mongoose = require("mongoose")

//function to connnect mongoose
const connDB = async() => {
    try{
        await mongoose.connect('mongodb+srv://yash25:8778@cluster0.pdjmynf.mongodb.net/E-Commerce')
        console.log("Mogoose Conneted..!")
    }catch(err) {
            console.log("Mongoose Connection Error..!", err.message)
        }
        
}

module.exports = connDB;
