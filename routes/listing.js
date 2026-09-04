const express=require("express");
const router=express.Router({
     mergeParams:true
    });
const wrapAsync=require("../utils/wrapAsync")
const ExpressError=require("../utils/ExpressError")
const { listingSchema } = require("../schema.js");
const Listing=require("../models/listing.js");
const { isLoggedIn , isOwner , validateListing } = require("../middleware.js");








//NEW LISTING
router.get("/new" , isLoggedIn ,  (req,res) => {
   
    res.render("listings/new.ejs");
});

//LIsting details
router.get("/:id" ,wrapAsync( async (req,res) => {
    let {id} = req.params;

    let listing=await Listing.findById(id)
    .populate({ path :"reviews" , 
                populate : {
                    path : "author",
                }
    })
    .populate("owner");
    if(!listing){
            req.flash("error" , " Listing does not Exist !");
            return res.redirect("/listings");

    }
    console.log(listing);
    res.render("listings/details" , {listing});
}));

//Adding new listing
router.post("/" ,isLoggedIn , validateListing, wrapAsync ( async (req,res) => {
    
    let newListing=new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success" , " New Listing Created");
    res.redirect("/listings");
    
}));

//Edit form
router.get("/:id/edit" , isLoggedIn , isOwner ,wrapAsync( async (req,res) => {
    let {id} = req.params;
    let listing=await Listing.findById(id);
    if(!listing){
            req.flash("error" , " Listing does not Exist !");
            return res.redirect("/listings");

    }
    res.render("listings/edit.ejs" ,{listing})
}));

//update changes
router.put("/:id" , isLoggedIn , isOwner , validateListing , wrapAsync( async (req,res) => {
    let {id} = req.params;
    
    
        await Listing.findByIdAndUpdate(id, req.body.listing , {new:true});
    
        req.flash("success" , "  Listing Updated");
        res.redirect(`/listings/${id}`);

    
}));

//Delete
router.delete("/:id" , isLoggedIn , isOwner , wrapAsync(async (req,res) => {
    let {id} = req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    req.flash("success" , "  Listing Deleted");
     res.redirect("/listings");

}));


module.exports=router;