const express=require('express');
const router = express.Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const verify = require('../verifyToken');

// Yes, the routes /:id and / can conflict depending on the order in which they are defined12.

// In many web frameworks, routes are matched in the order they are defined. 
//If /:id is defined before /, the /:id route could interpret the / as an id parameter

//GET ALL USERS(FORADMIN)
router.get('/',verify, async (req,res)=>{
    const query=req.query.new;
    const num=req.query.limit;
    //VERIFY BY ACCESS TOKEN
    if(req.user.isAdmin){
        //Deleting User
        try{
            const Users = query ? await User.find().limit(num) : await User.find();
            res.status(200).json(Users);
        }
        catch(err){
            res.status(500).json(err)
         }
}
else
{
res.status(403).json("You are not allowed to see all users");
}
});


//UPDATE USERINFO

router.put('/:id',verify, async (req,res)=>{
    
        //VERIFY BY ACCESS TOKEN
        if(req.user.id === req.params.id || req.user.isAdmin){
            //Changing Password
            if(req.body.password){
                req.body.password=CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
            }


            try{
                const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                    $set:req.body
                },{new:true});

                res.status(200).json(updatedUser);

            }
            catch(err){
                res.status(500).json(err)
             }
}
else
{
    res.status(403).json("You can updateonly your account")
}
})

router.put('/:id',verify, async (req,res)=>{
    
        //VERIFY BY ACCESS TOKEN
        if(req.user.id === req.params.id || req.user.isAdmin){
            //Changing Password
            if(req.body.password){
                req.body.password=CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
            }


            try{
                const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                    $set:req.body
                },{new:true});

                res.status(200).json(updatedUser);

            }
            catch(err){
                res.status(500).json(err)
             }
}
else
{
    res.status(403).json("You can updateonly your account")
}
})


//DELETE USER

router.delete('/:id',verify, async (req,res)=>{
    //VERIFY BY ACCESS TOKEN
    if(req.user.id === req.params.id || req.user.isAdmin){
        //Deleting User
        try{
            const deletedUser = await User.findByIdAndDelete(req.params.id);

            res.status(200).json("User Deleted" + deletedUser.username);

        }
        catch(err){
            res.status(500).json(err)
         }
}
else
{
res.status(403).json("You can delete only your account")
}
});


//GET

router.get('/find/:id', async (req,res)=>{
    //NO NEED TO VERIFY BY ACCESS TOKEN BECAUSE EVERYONE CAN HAVE INFO OF OTHER USER USERNAME,EMAIL,CREATED,UPDATED like we can see other users in leetcode
        try{
            const user = await User.findById(req.params.id);
            const {password, ...info} = user._doc; //Destructuring Object
            res.status(201).json(info);

        }
        catch(err){
            res.status(500).json(err)
         }
});




//USER STATS
router.get('/stats',async(req,res)=>{

        const today= new Date();
        const lastYear=today.setFullYear(today.setFullYear() - 1);


        const monthsArray = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];


            try{
                const data = await User.aggregate([
                    {
                        $project:{
                            month : {$month: "$createdAt"}
                        }
                    },{
                        $group:{
                            _id:"$month",
                            total: {$sum:1}
                        }
                    }
                ]);
                res.status(200).json(data);
            }
            catch(err){
                res.status(500).json(err)
             }
    }
)

module.exports = router