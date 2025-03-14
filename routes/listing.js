const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner} = require("../utils/middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingControllers = require("../controllers/listing.js");

// index route
router.get("/",wrapAsync( listingControllers.index));

// new route
router.get("/new",isLoggedIn, listingControllers.newFormRender);

// create route
router.post("/create",  isLoggedIn, upload.single("listing[image]"), wrapAsync( listingControllers.newListing));
  // router.post("/create",upload.single("image") ,(req,res) =>{
  //   res.send(req.file);
  // })


// show route
router.get("/:id", wrapAsync(listingControllers.showListing));

// edit route
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(listingControllers.editFormRender));

// update route

router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]") ,wrapAsync( listingControllers.updateListing));

// delete route

router.delete("/:id", isLoggedIn, isOwner,wrapAsync(listingControllers.deleteListing));


module.exports = router;