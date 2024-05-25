const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const {
    index,
    createListings,
    renderNewFrom,
    renderShowListings,
    editListings,
    updateListing,
    destroyListings,
} = require("../controllers/listing.js");

const multer = require('multer');
const { storage } = require('../cloudConfig.js');  // Correctly destructure storage
const upload = multer({ storage });

router
    .route("/")
    .get(asyncWrap(index))
    .post(isLoggedIn, upload.single('image') ,validateListing, asyncWrap(createListings));

router.get("/new", isLoggedIn, renderNewFrom);

router
    .route("/:id")
    .get(asyncWrap(renderShowListings))
    .put(isLoggedIn, validateListing, asyncWrap(updateListing))
    .delete(isLoggedIn, isOwner, asyncWrap(destroyListings));

router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(editListings));

module.exports = router;
