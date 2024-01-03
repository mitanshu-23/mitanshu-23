const mongoose=require('mongoose')

const MovieSchema = new mongoose.Schema(
    {
        title:{type:String, required:true, unique:true},
        description:{type:String},
        img:{type:String},
        imgtitle:{type:String},
        thumb:{type:String},
        trailer:{type:String},
        video:{type:String},
        duration:{type:String},
        year:{type:String},
        limit:{type:Number},
        genre:String,
        isSeries:{type:Boolean, default:false}
    },{timestamps:true}
);

module.exports = mongoose.model("Movie",MovieSchema);