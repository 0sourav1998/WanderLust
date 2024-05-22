const express = require("express");
const router = express.Router({ mergeParams: true }) ;
const ExpressError = require("../utils/ExpressError");
const asyncWrap = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Reviews = require("../models/reviews");
const {reviewValidation , isLoggedIn , isAuthor} = require('../middleware.js')




//reviews 
//POST route

router.post("/",isLoggedIn,reviewValidation,asyncWrap(async(req,res)=>{
    let listings = await Listing.findById(req.params.id) ;
    let newReview = new Reviews({
      ratings : req.body.ratings ,
      comments : req.body.comments 
    });
    newReview.author = req.user._id ;
    listings.reviews.push(newReview) ;
    await newReview.save();
    await listings.save();
    req.flash('success', 'Review Added');
    res.redirect("/listings")
  })) ;
  
  //delete review
  
  router.delete("/:reviewID",isAuthor,asyncWrap(async(req,res)=>{
    let {id , reviewID} = req.params ;
    console.log("ID :" , id , "REVIEW ID :" , reviewID) ;
    await Reviews.findByIdAndDelete(reviewID);
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewID}})
    req.flash('success', 'Review Deleted');
    res.redirect("/listings")
  
  }))

  module.exports = router ;