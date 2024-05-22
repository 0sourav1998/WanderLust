const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing") ;

const Mongo_Url = "mongodb://127.0.0.1:27017/wanderlust";
mian()
  .then((res) => {
    console.log("Connected to Db");
  })
  .catch((err) => console.log(err));

async function mian() {
  await mongoose.connect(Mongo_Url);
}

async function initDB(){
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner :"664d8ab35c2ad5da49d84ebc"}))
    await Listing.insertMany(initData.data)
}

initDB();