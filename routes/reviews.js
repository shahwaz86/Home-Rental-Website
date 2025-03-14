const express = require("express");
const router = express.Router({mergeParams: true});

const {reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isReviewAuthor } = require("../utils/middleware.js");

const reviewControllers = require("../controllers/review.js");

const validateReview = (req,res,next) =>{
  let {error} = reviewSchema.validate(req.body);
  if(error){ 
    throw new ExpressError(400, message);
  }
  else{
    next();
  }
};



router.post("/",isLoggedIn,validateReview,wrapAsync(reviewControllers.newReview ));

router.delete("/:reviewid",isLoggedIn,isReviewAuthor, wrapAsync(reviewControllers.deleteReview));

module.exports = router;