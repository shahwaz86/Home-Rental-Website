const mongoose = require("mongoose");
const Review = require("./reviews");

const sampleListing = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
   url: String,
   filename: String
  },
  country: {
    type: String,
     required: true,

  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  reviews:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});

sampleListing.post("findOneAndDelete", async(listing) =>{
  if(listing){

    await Review.deleteMany({_id: {$in: listing.reviews}})
  }
})

const Listing = mongoose.model("Listing", sampleListing);
module.exports = Listing;