const express=require("express");
const router=express.Router({
     mergeParams:true
});
const wrapAsync=require("../utils/wrapAsync")
const ExpressError=require("../utils/ExpressError")
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const { validateReview ,isLoggedIn , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");




//REVIEW
//post request
router.post("/"
    ,isLoggedIn 
    , validateReview 
    , wrapAsync(reviewController.createReview ));

//DELETE review

router.delete("/:reviewId" 
    , isLoggedIn
    ,isReviewAuthor
    , wrapAsync( reviewController.destroyReview ));


module.exports=router;