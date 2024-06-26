const { date } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema ;

const reviewSchema = new Schema({
    ratings : {
        type : Number,
        min : 1 ,
        max : 5
    },
    comments : String ,
    createdAt : {
        type : Date ,
        default : Date.now()
    } ,
    author :{
        type : Schema.Types.ObjectId,
        ref : "User"
    }
})

const Reviews =  mongoose.model("Reviews",reviewSchema) ;

module.exports = Reviews ;