const express = require("express");
const router = express.Router() ;
const asyncWrap = require("../utils/wrapAsync");
const {schemaValidate} = require("../shcemaValidate");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");


const validateListing = (req,res,next)=>{
    const { title, description, image, price, location, country } = req.body;
    const result = schemaValidate.validate({ listing: req.body });
    console.log(result)
    if(result.error){
      throw new ExpressError(401,result.error)
    }else{
      next();
    }
  }
  

router.get("/", asyncWrap(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  }));
  
  router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  router.post("/listings", validateListing, asyncWrap(async (req, res) => {
    const { title, description, image, price, location, country } = req.body;
    const newListing = new Listing({
      title,
      description,
      image,
      price,
      location,
      country,
    });
    await newListing.save();
    res.redirect("/listings"); // Redirect to listings page after saving
  }));
  
  router.get("/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  }));
  
  router.get("/:id/edit",asyncWrap(async(req,res)=>{
      let { id } = req.params;
      let listing = await Listing.findById(id);
      res.render("listings/edit.ejs",{listing})
  }));
  
  router.put("/:id", validateListing, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const { title, description, image, price, location, country } = req.body;
    await Listing.findByIdAndUpdate(id, { 
      title,
      description,
      image,
      price,
      location,
      country 
    });
    res.redirect("/listings");
  }));
  
  router.delete("/:id",asyncWrap(async(req,res)=>{
      let {id} = req.params ;
      await Listing.findByIdAndDelete(id) ;
      res.redirect("/listings")
  })) ;

  module.exports = router ;
  