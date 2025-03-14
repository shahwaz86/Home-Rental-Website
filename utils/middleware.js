const Listing = require("../models/listing");
const Reviews = require("../models/reviews");

module.exports.isLoggedIn=(req,res,next) =>{
  if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in first");
   return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req,res,next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async(req,res,next) =>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "you are not owner of this listing");
  return  res.redirect(`/listing/${id}`);
  }
  next()
};

module.exports.isReviewAuthor = async(req,res, next) =>{
  let {id , reviewid } = req.params;
  let Review = await Reviews.findById(reviewid);
  // console.log(Review);
  if(!Review.author._id.equals(res.locals.currUser._id)){
    req.flash("error", "you are not author of this review");
   return res.redirect(`/listing/${id}`);
  }
  next();
}