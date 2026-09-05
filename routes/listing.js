const express=require("express");
const router=express.Router({
     mergeParams:true
    });
const wrapAsync=require("../utils/wrapAsync")
const ExpressError=require("../utils/ExpressError")
const { listingSchema } = require("../schema.js");
const Listing=require("../models/listing.js");
const { isLoggedIn , isOwner , validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");



// All listings Index route
router.get( "/" , wrapAsync (listingController.index));



//NEW LISTING
router.get("/new" , isLoggedIn , listingController.renderNewForm );

//LIsting details
router.get("/:id" ,wrapAsync(listingController.listingDetails ));

//Adding new listing
router.post("/" ,isLoggedIn , validateListing, wrapAsync (listingController.saveListing));

//Edit form
router.get("/:id/edit" , isLoggedIn , isOwner ,wrapAsync(listingController.renderEditForm));

//update changes
router.put("/:id" , isLoggedIn , isOwner , validateListing , wrapAsync( listingController.updateChanges));

//Delete
router.delete("/:id" , isLoggedIn , isOwner , wrapAsync(listingController.destroyListing));


module.exports=router;