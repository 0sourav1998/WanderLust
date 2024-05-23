const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { sameUrlRedirect } = require("../middleware.js");

const {
  renderSignUpFrom,
  createUser,
  renderLoginFrom,
  login,
  logout,
} = require("../controllers/user.js");

router.route("/signup").get(renderSignUpFrom).post(createUser);

router
  .route("/login")
  .get(renderLoginFrom)
  .post(
    sameUrlRedirect,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    login
  );

router.get("/logout", logout);

module.exports = router;
