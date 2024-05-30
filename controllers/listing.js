const Listing = require('../models/listing') ;
const mbxGeoCodinates = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.Map_Token ;
const geocodingClient = mbxGeoCodinates({ accessToken: mapToken });

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
    let response = await geocodingClient.forwardGeocode({
      query: req.body.location,
      limit: 1
    })
      .send()
    const { title, description, image, price, location, country } = req.body;
    let url = req.file.path;
    let filename = req.file.filename ;
    const newListing = new Listing({
      title,
      description,
      image,
      price,
      location,
      country,
    });
    newListing.owner = req.user._id ;
    newListing.image = {url,filename} ;
    if (response.body.features.length > 0) {
      newListing.geometry = {
          type: "Point",
          coordinates: response.body.features[0].geometry.coordinates
      };
     await newListing.save()
  } else {
      throw new Error("Geocoding failed to return any results.");
  }
    req.flash('success', 'New Listing Was Created');
    res.redirect("/listings");
  }

  module.exports.renderShowListings = async (req, res) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");

        if (!listing) {
            req.flash('error', 'Listing you are trying to find does not exist!');
            return res.redirect('/listings');
        }

        let coordinates = listing.geometry ? listing.geometry.coordinates : [];

        if (coordinates.length === 0) {
            let response = await geocodingClient.forwardGeocode({
                query: listing.location, // Use listing.location instead of req.body.location
                limit: 1
            }).send();

            if (response.body.features.length > 0) {
                listing.geometry = {
                    type: "Point",
                    coordinates: response.body.features[0].geometry.coordinates
                };
                await listing.save();
                coordinates = listing.geometry.coordinates; // Update coordinates after saving
            } else {
                console.log(`Geocoding failed for listing with ID ${listing._id}`);
            }
        }

        res.render("listings/show.ejs", { listing, coordinates });
    } catch (error) {
        req.flash('error', 'Something went wrong.');
        res.redirect('/listings');
    }
};

  module.exports.editListings = async(req,res)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
      req.flash('error','Listings You are trying to Find does not Exists!');
     return res.redirect('/listings')
    }
    let originalImageURl = listing.image.url ;
    originalImageURl = originalImageURl.replace("/upload" , "/upload/c_thumb,g_face,h_200,w_200");
    res.render("listings/edit.ejs",{listing , originalImageURl})
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let url = req.file.path;
    let filename = req.file.filename ;
    const { title, description, image, price, location, country } = req.body;
    let listing = await Listing.findByIdAndUpdate(id, { 
      title,
      description,
      image,
      price,
      location,
      country 
    });
    if(typeof req.file !== "undefined"){
      listing.image = {url , filename};
      await listing.save();
    }
    req.flash('success', 'Listing Updated');
    res.redirect("/listings");
  }

  module.exports.destroyListings = async(req,res)=>{
    let {id} = req.params ;
    await Listing.findByIdAndDelete(id) ;
    req.flash('success', 'Listing Deleted');
    res.redirect("/listings")
}