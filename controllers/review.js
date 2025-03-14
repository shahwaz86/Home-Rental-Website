const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.newReview = async(req,res) =>{
  let listing = await Listing.findById(req.params.id);
  // console.log(listing);
  let newReviews = new Review(req.body.reviews);
  // console.log(newReviews);
  newReviews.author = req.user._id;
  // console.log(newReviews);
  listing.reviews.push(newReviews);
  await newReviews.save();
  await listing.save();
  // res.send("new review saved");
  req.flash("success", "New review added!");
  res.redirect(`/listing/${listing._id}`);
  

};

module.exports.deleteReview = async(req,res) =>{
  let {id, reviewid} = req.params;
  // console.log(`id is ${id}, reviewid is ${reviewid}`);
  // res.send("done");
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewid}});
  await Review.findByIdAndDelete(reviewid);
  req.flash("success", "review deleted!")
  res.redirect(`/listing/${id}`);
};