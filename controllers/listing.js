const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async(req,res) =>{
  let listings = await Listing.find();
  res.render("./listings/index.ejs", {listings}); 
};

module.exports.newFormRender = (req,res) =>{
  res.render("./listings/new.ejs");
};

module.exports.newListing = async(req,res) =>{
  
  let url = req.file.path;
  let filename = req.file.filename

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url,filename};
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listing");
  // res.send(req.body);
};

module.exports.showListing = async (req,res) =>{
  let {id} = req.params;
  let listing =await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
  if(!listing){
    req.flash("error", "listing you requested for doen't exists!");
    res.redirect("/listing");
  }
  else{
    // console.log(listing);
    res.render("./listings/show.ejs", {listing});
  }
};

module.exports.editFormRender =  async(req,res) =>{
  let {id} = req.params;
  let listing =await Listing.findById(id);
  if(!listing){
    req.flash("error", "listing you requested for doesn't exists!");
    res.redirect("/listing");
  }
  else{
    originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", {listing});
  }
};

module.exports.updateListing = async(req,res) =>{
  let {id} = req.params;
  let listing =  await Listing.findByIdAndUpdate(id, {...req.body.listing});

  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }

  req.flash("success", "listing updated successfully!");
  res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async(req,res) =>{
  let {id} = req.params;
   await Listing.findByIdAndDelete(id);
   req.flash("success", "listing deleted successfully!");
  res.redirect("/listing");
};