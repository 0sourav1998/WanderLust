if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStategy = require('passport-local');
const User = require('./models/user.js')

const Mongo_Url = process.env.Mongo_DB_Url ;

const Mongo_Store = MongoStore.create({
  mongoUrl : Mongo_Url ,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter : 24 * 3600 
}) ;

Mongo_Store.on("error",()=>{
  console.log("Some Error Occured",err)
})

const sessionOptions = {
  Mongo_Store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  },
};



app.use(session(sessionOptions));
app.use(flash());

//passport and flash requires session

//passport initialized
app.use(passport.initialize());
//request should know which o session's part it is
app.use(passport.session());

//inside passport new users should be authanticated through LocalStategy and each user should be authanticate by User.authanticate() (login,sing-up)
passport.use(new LocalStategy(User.authenticate()))

//user realted info stored in a session so user does not require to login multiple time in a session
passport.serializeUser(User.serializeUser());
//after session ends unstore the user info from the session
passport.deserializeUser(User.deserializeUser());

const listingRouter= require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js")

app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);

// const Mongo_Url = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then((res) => {
    console.log("Connected to Db");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(Mongo_Url);
}

app.use((req,res,next)=>{
  res.locals.successMsg = req.flash('success');
  res.locals.errorMsg = req.flash('error')
  // we have to use locals bcz the access of req.user is not available in navbar
  res.locals.user = req.user ;
  next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use('/',userRouter)

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message } = err;
  res.status(statusCode);
  res.render("listings/Error.ejs", { message });
});

app.listen(8080, () => {
  console.log("App is listening to Port 8080");
});
