const express=require('express');
const router = express.Router();
const Movie = require('../models/Movies');
const verify = require('../verifyToken');


///GET ALL MOVIE
router.get('/',verify, async (req,res)=>{
   
    if(req.user.isAdmin){
    try{
        const movie=await Movie.find();
        res.status(200).json(movie);
    }
    catch(err)
    {
        res.status(500).json(err);
    }
}
else
{
    console.log("You are not allowed");
}

});

//CREATE NEW MOVIE

router.post('/add',verify, async (req,res)=>{
        //VERIFY BY ACCESS TOKEN
        if(req.user.isAdmin){
           const newMovie = new Movie(req.body);
            try{
                const movie = await newMovie.save();

                res.status(200).json(movie);

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

//UPDATE MOVIE
router.put('/:id',verify, async (req,res)=>{
    
    //VERIFY BY ACCESS TOKEN
    if(req.user.isAdmin){
        try{
            const updatedMovie = await Movie.findByIdAndUpdate(req.params.id,
                {
                    $set:req.body
                }, {new:true}
            );

            res.status(200).json(updatedMovie);
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

//DELETE MOVIE
router.delete('/:id',verify, async (req,res)=>{
    if(req.user.isAdmin)
    {
        const deletedMovie=await Movie.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted Movie" + deletedMovie.title);
    }
    else{
        console.log("You are not allowed");
    }
})

///GET MOVIE
router.get('/find/:id',verify, async (req,res)=>{
    try{
        const movie=await Movie.findById(req.params.id);
        res.status(200).json(movie);
    }
    catch(err)
    {
        res.status(500).json(err);
    }

});

//GET RANDOM MOVIES
router.get('/random',verify, async (req,res)=>{
    const type = req.query.type;
    const genreq = req.query.genre;
    console.log(type,genreq);
    let movie;
    try{
        if(type === 'series')
        {
            movie = await Movie.aggregate([
                {
                    $match: {isSeries:true}
                },
                {
                    $sample : {
                        size: 1
                    }
                }
            ]);
        }else
        {
            if(genreq)
                    {
                        movie = await Movie.aggregate([
        
                            { $match : {isSeries:false, genre:genreq}},
                            {
                                $sample : {
                                    size: 1
                                }
                            },
                            
                        ])
                    }
                    else
                    {
                        movie = await Movie.aggregate([
                            { $match : {isSeries:false}} ,
                            { $sample : {size : 1}}, 
                            
                        ]);
                    }
        }
        console.log(movie);
        res.status(200).json(movie);
    }
    catch(err)
    {
        res.status(500).json(err);
    }

});



module.exports = router