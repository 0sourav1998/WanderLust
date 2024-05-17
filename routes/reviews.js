const express = require("express");
const router = express.Router({ mergeParams: true }) ;
const ExpressError = require("../utils/ExpressError");
const asyncWrap = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Reviews = require("../models/reviews");
const {reviewValidate} = require("../shcemaValidate");



const reviewValidation = (req,res,next)=>{
    const result = reviewValidate.validate({ reviews: req.body });
    if(result.error){
      throw new ExpressError(401,result.error)
    }else{
      next();
    }
  }

//reviews 
//POST route

router.post("/",reviewValidation,asyncWrap(async(req,res)=>{
    let listings = await Listing.findById(req.params.id) ;
    let newReview = new Reviews({
      ratings : req.body.ratings ,
      comments : req.body.comments 
    })
    listings.reviews.push(newReview) ;
    await newReview.save();
    await listings.save();
    res.redirect("/listings")
  })) ;
  
  //delete review
  
  router.delete("/:reviewID",asyncWrap(async(req,res)=>{
    let {id , reviewID} = req.params ;
    console.log("ID :" , id , "REVIEW ID :" , reviewID) ;
    await Reviews.findByIdAndDelete(reviewID);
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewID}})
    res.redirect("/listings")
  
  }))

  module.exports = router ;