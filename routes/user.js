const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {sameUrlRedirect} = require('../middleware.js')

router.get("/signup", (req, res) => {
  res.render("user/signup.ejs");
});

router.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    // req.login -> when user signup he automatically logged-in
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", "Username already exists");
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post(
  "/login",
  sameUrlRedirect,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    const url = res.locals.originalUrl || '/listings';
    req.flash("success", "Welcome back to WanderLust");
    res.redirect(url);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Logged Out");
    res.redirect("/login");
  });
});

module.exports = router;
