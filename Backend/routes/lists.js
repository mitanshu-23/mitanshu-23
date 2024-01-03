const express=require('express');
const router = express.Router();
const List = require('../models/List');
const verify = require('../verifyToken');
const { findByIdAndDelete } = require('../models/User');


//CREATE NEW List

router.post('/add',verify, async (req,res)=>{
        //VERIFY BY ACCESS TOKEN
        if(req.user.isAdmin){
           const newList = new List(req.body);
            try{
                const list = await newList.save();
                res.status(200).json(list);
            }
            catch(err){
                res.status(500).json(err)
             }
}
else
{
    res.status(403).json("You are not allowed")
}
});


router.delete('/:id',verify, async (req,res)=>{
    //VERIFY BY ACCESS TOKEN
    
    if(req.user.isAdmin){
        try{
            const deletedList = await List.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted List: " + deletedList.title);
        }
        catch(err){
            res.status(500).json(err)
         }
}
else
{
res.status(403).json("You are not allowed")
}
});


router.get('/',verify, async (req,res)=>{
    const typequery=req.query.type;
    const genrequery=req.query.genre;
    let list=[];
        console.log(typequery, genrequery)
        try{
                if(typequery)
                {
                    if(genrequery)
                    {
                        list = await List.aggregate([
                            { $sample : {size : 10}}, //10Lists
                            { $match : {type:typequery, genre:genrequery}}
                        ])
                    }
                    else
                    {
                        list = await List.aggregate([
                            { $sample : {size : 10}}, //10Lists
                            { $match : {type:typequery}}
                        ])
                    }
                }
            else{
               //HOME PAGE ->Random Lists
               list = await List.aggregate([
                {
                    $sample : {size: 10}
                }
               ]);
             }


            res.status(200).json(list);
        }
        catch(err){
            res.status(500).json(err)
         }
});


router.put('/:id',verify,async (req,res)=>{
    if(req.user.isAdmin)
    {
        try{
            const updatedList = await List.findByIdAndUpdate(req.params.id,
                {
                    $set:req.body
                }, {new:true}
            );
            res.status(200).json(updatedList);
        }
        catch(err){
            res.status(500).json(err)
         }
    }else{
        res.status(403).json("You are not allowed");
    }
})

module.exports = router