const Listing = require('../models/listing')
const Reviews = require('../models/reviews') ;

module.exports.createReviews = async(req,res)=>{
    let {id} = req.params ;
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
    res.redirect(`/listings/${id}`)
  }

  module.exports.destroyReviews = async(req,res)=>{
    let {id , reviewID} = req.params ;
    console.log("ID :" , id , "REVIEW ID :" , reviewID) ;
    await Reviews.findByIdAndDelete(reviewID);
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewID}})
    req.flash('success', 'Review Deleted');
    res.redirect(`/listings/${id}`)
}