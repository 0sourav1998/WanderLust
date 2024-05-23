const express = require("express");
const router = express.Router({ mergeParams: true }) ;
const ExpressError = require("../utils/ExpressError");
const asyncWrap = require("../utils/wrapAsync");
const {reviewValidation , isLoggedIn , isAuthor} = require('../middleware.js') ;
const {createReviews , destroyReviews} = require('../controllers/reviews.js') ;





//reviews 
//POST route

router.post("/",isLoggedIn,reviewValidation,asyncWrap(createReviews)) ;
  
  //delete review
  
router.delete("/:reviewID",isAuthor,asyncWrap(destroyReviews))

  module.exports = router ;