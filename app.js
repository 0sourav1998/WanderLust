const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override") ;
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError");



const listings = require("./routes/listings.js")
const reviews = require("./routes/reviews.js");

app.use(methodOverride('_method'))

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);


const Mongo_Url = "mongodb://127.0.0.1:27017/wanderlust";


main()
  .then((res) => {
    console.log("Connected to Db");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(Mongo_Url);
} ;

app.use("/listings",listings) ;
app.use("/listings/:id/reviews",reviews);


app.all("*",(req,res,next)=>{
  next(new ExpressError(404 ,"Page Not Found"))
}) ;

app.use((err, req, res, next) => {
  let {statusCode = 500, message} = err ;
  res.status(statusCode)
  res.render("listings/Error.ejs" , {message})
});


app.listen(8080, () => {
  console.log("App is listening to Port 8080");
});
