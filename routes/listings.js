const express = require("express");
const router = express.Router() ;
const asyncWrap = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const {isLoggedIn , isOwner} = require('../middleware.js')
const {validateListing} = require('../middleware.js')


router.get("/", asyncWrap(async (req, res) => {
    const allListings = await Listing.find();
    if (allListings.length === 0) {
      req.flash('error', 'No listings found!');
      return res.redirect('/listings/new');
    }
    res.render("listings/index.ejs", { allListings });
  }));
  
  router.get("/new",isLoggedIn ,(req, res) => {
    res.render("listings/new.ejs");
  });

  router.post("/",isLoggedIn, validateListing, asyncWrap(async (req, res) => {
    const { title, description, image, price, location, country } = req.body;
    const newListing = new Listing({
      title,
      description,
      image,
      price,
      location,
      country,
    });
    newListing.owner = req.user._id ;
    await newListing.save();
    req.flash('success', 'New Listing Was Created');
    res.redirect("/listings");
  }));
  
  router.get("/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path : "reviews" , populate :{path : "author"}}).populate("owner");
    if(!listing){
      req.flash('error','Listings You are trying to Find does not Exists!');
      return res.redirect('/listings')
    }
    res.render("listings/show.ejs", { listing });
  }));
  
  router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(async(req,res)=>{
      let { id } = req.params;
      let listing = await Listing.findById(id);
      if(!listing){
        req.flash('error','Listings You are trying to Find does not Exists!');
       return res.redirect('/listings')
      }
      res.render("listings/edit.ejs",{listing})
  }));
  
  router.put("/:id",isLoggedIn, validateListing, asyncWrap(async (req, res) => {
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
    req.flash('success', 'Listing Updated');
    res.redirect("/listings");
  }));
  
  router.delete("/:id",isLoggedIn,isOwner,asyncWrap(async(req,res)=>{
      let {id} = req.params ;
      await Listing.findByIdAndDelete(id) ;
      req.flash('success', 'Listing Deleted');
      res.redirect("/listings")
  })) ;

  module.exports = router ;
  