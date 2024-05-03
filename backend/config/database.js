const mongoose = require('mongoose')
require("dotenv").config();

exports.connect = ()=>{
    mongoose.connect(process.env.CONNECTION_URI_MDB)
    .then(()=>{
        console.log("Connected to Database!")
    })
    .catch((e)=>{
        console.log("Error Connecting to database ", e)
    })
}
