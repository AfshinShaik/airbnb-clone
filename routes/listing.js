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
//Adding new listing

router
    .route ( "/" )
    .get( wrapAsync (listingController.index))
    .post(isLoggedIn , validateListing, wrapAsync (listingController.saveListing));



//NEW LISTING
router.get("/new" , isLoggedIn , listingController.renderNewForm );


//LIsting details
//update changes
//Delete

router
    .route( "/:id" )
    .get( wrapAsync(listingController.listingDetails ))
    .put( isLoggedIn , isOwner , validateListing , wrapAsync( listingController.updateChanges))
    .delete( isLoggedIn , isOwner , wrapAsync(listingController.destroyListing));

//Edit form
router.get("/:id/edit" , isLoggedIn , isOwner ,wrapAsync(listingController.renderEditForm));




module.exports=router;