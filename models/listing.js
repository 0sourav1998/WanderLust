const mongoose = require("mongoose");
const Schema = mongoose.Schema ;
const Reviews = require("./reviews")

const listingSchema = new Schema({
    title : {
        type:String ,
        required : true
    },
    description : String ,
    image: {
        url : String ,
        filename : String
      },
      price : Number ,
      location : String ,
      country : String ,
      reviews : [
        {
          type : Schema.Types.ObjectId,
          ref : "Reviews"
        }
      ] ,
      owner : {
        type : Schema.Types.ObjectId ,
        ref : "User"
      } ,
      geometry : {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
}) ;


// delete the reviews in Reviews model
//by using POST middleware
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    let reviewID = listing.reviews ;
    await Reviews.deleteMany({_id : {$in : reviewID}})
  }
})

const Listing = mongoose.model("Listing",listingSchema) ;

module.exports = Listing ;