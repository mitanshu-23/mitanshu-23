const express = require('express')
const router=express.Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js')      //Using Hashing Module 'crypto-js'  for User Password
const JWT = require('jsonwebtoken');


//Register
router.post('/register',async (req,res)=>{
const newUser = new User(
    {
        username:req.body.username,
        email:req.body.email,
        password:CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()   //Encryption
    }
);
    try{
    const user = await newUser.save();
    res.status(201).json(user);
    }
    catch(err)
    {
        res.status(500).json(err)
    }
})


router.post('/login',async (req,res)=>{
    try{

        const user = await User.findOne({email:req.body.email})

        if(!user)
        {
            res.status(401).json("Wrong Password or Username");
        }

        // Checking For Password if User Present
        //Decrypting Password from MongoDb
        var   bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        var originalPass = bytes.toString(CryptoJS.enc.Utf8);

        if(originalPass !== req.body.password)
        {
            res.status(401).json("Wrong Password or Username");
        }

        else {

            //Creatiing Access Token

            const accessToken = JWT.sign({id:user._id, isAdmin:user.isAdmin}, process.env.SECRET_KEY, {expiresIn: "5d"});

            const {password, ...info} = user._doc; //Destructuring Object
            res.status(201).json({...info, accessToken});

    }   
    }
    catch(err)
    {
        res.status(500).json(err)
    }
})

module.exports = router