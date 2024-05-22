const Listing = require('./models/listing');
const Review = require('./models/reviews');
const {schemaValidate , reviewValidate} = require("./shcemaValidate");
const ExpressError = require("./utils/ExpressError");


const validateListing = (req,res,next)=>{
    const { title, description, image, price, location, country } = req.body;
    const result = schemaValidate.validate({ listing: req.body });
    if(result.error){
      throw new ExpressError(401,result.error)
    }else{
      next();
    }
  }

  const reviewValidation = (req,res,next)=>{
    const result = reviewValidate.validate({ reviews: req.body });
    if(result.error){
      throw new ExpressError(401,result.error)
    }else{
      next();
    }
  }
  

const isLoggedIn = (req,res,next)=>{
    console.log(req.user)
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl ;
        console.log(req.session.redirectUrl)
        req.flash('error','Please login to continue')
       return res.redirect('/login')
    }
    next();
}

const sameUrlRedirect = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.originalUrl = req.session.redirectUrl;
    }
    next();
}

const isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.user._id)){
        req.flash('error','You are not the owner of the Listing !') ;
        return res.redirect(`/listings/${id}`)
    }
    next();
}

const isAuthor = async(req,res,next)=>{
    let { id , reviewID} = req.params;
    let review = await Review.findById(reviewID);
    if(!review.author.equals(res.locals.user._id)){
        req.flash('error','You are not the owner of the Listing !') ;
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports = {isLoggedIn , sameUrlRedirect , isOwner ,validateListing , reviewValidation , isAuthor}
