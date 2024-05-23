const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");

const {
  index,
  createListings,
  renderNewFrom,
  renderShowListings,
  editListings,
  updateListing,
  destroyListings,
} = require("../controllers/listing.js");

router
  .route("/")
  .get(asyncWrap(index))
  .post(isLoggedIn, validateListing, asyncWrap(createListings));

router.get("/new", isLoggedIn, renderNewFrom);

router
  .route("/:id")
  .get(asyncWrap(renderShowListings))
  .put(isLoggedIn, validateListing, asyncWrap(updateListing))
  .delete(isLoggedIn, isOwner, asyncWrap(destroyListings));

router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(editListings));

module.exports = router;
