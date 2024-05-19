const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require('connect-flash');

const sessionOptions = {
  secret: "mysecretcode",
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

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);

const Mongo_Url = "mongodb://127.0.0.1:27017/wanderlust";

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
  next();
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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
