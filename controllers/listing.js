const Listing = require('../models/listing')

module.exports.index = async (req, res) => {
    const allListings = await Listing.find();
    if (allListings.length === 0) {
      req.flash('error', 'No listings found!');
      return res.redirect('/listings/new');
    }
    res.render("listings/index.ejs", { allListings });
  } ;

  module.exports.renderNewFrom = (req, res) => {
    res.render("listings/new.ejs");
  }

  module.exports.createListings = async (req, res) => {
    const { title, description, image, price, location, country } = req.body;
    let url = req.file.path;
    let filename = req.file.filename ;
    console.log(url , filename)
    const newListing = new Listing({
      title,
      description,
      image,
      price,
      location,
      country,
    });
    newListing.owner = req.user._id ;
    newListing.image = {url,filename}
    await newListing.save();
    req.flash('success', 'New Listing Was Created');
    res.redirect("/listings");
  }

  module.exports.renderShowListings = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path : "reviews" , populate :{path : "author"}}).populate("owner");
    if(!listing){
      req.flash('error','Listings You are trying to Find does not Exists!');
      return res.redirect('/listings')
    }
    res.render("listings/show.ejs", { listing });
  }

  module.exports.editListings = async(req,res)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
      req.flash('error','Listings You are trying to Find does not Exists!');
     return res.redirect('/listings')
    }
    res.render("listings/edit.ejs",{listing})
}

module.exports.updateListing = async (req, res) => {
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
  }

  module.exports.destroyListings = async(req,res)=>{
    let {id} = req.params ;
    await Listing.findByIdAndDelete(id) ;
    req.flash('success', 'Listing Deleted');
    res.redirect("/listings")
}