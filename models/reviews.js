const { date } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema ;

const reviewSchema = mongoose.Schema({
    ratings : {
        type : Number,
        min : 1 ,
        max : 5
    },
    comments : String ,
    createdAt : {
        type : Date ,
        default : Date.now()
    }
})

const Reviews =  mongoose.model("Reviews",reviewSchema) ;

module.exports = Reviews ;