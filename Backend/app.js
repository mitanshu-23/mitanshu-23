const express=require("express");
const app=express();
const mongoose=require('mongoose')
const dotenv = require('dotenv')
const authroute = require('./routes/auth')
const userroute = require('./routes/users')
const movieroute=require('./routes/movies')
const listroute=require('./routes/lists')
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB Connection Successful")
    }).catch(
    (err)=>{
    console.log(err)
    });




    //In express server not going to accept json
    app.use(express.json());

    app.use('/api/auth',authroute);
    app.use('/api/users',userroute);
    app.use('/api/movies',movieroute);
    app.use('/api/lists',listroute);
    
app.listen(8000,()=>{
    console.log("Server listening at port 8000");
})