const Listing=require("../models/listing.js");



module.exports.index =  async (req,res) => {
    const allListings = await Listing.find( {});
    res.render("listings/index.ejs" , { allListings });
};

module.exports.renderNewForm = (req,res) => {
   
    res.render("listings/new.ejs");
};

module.exports.listingDetails   = async (req,res) => {
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
};

module.exports.saveListing = async (req,res) => {
    
    let newListing=new Listing(req.body.listing);
    newListing.owner = req.user._id;
    
    if(req.file){
        console.log(req.file);
        let url = req.file.path;
    let filename = req.file.filename;
    console.log(url);
        newListing.image = { url , filename };

    }else{
        console.log("Cloudinary issue");
    }
    await newListing.save();
    req.flash("success" , " New Listing Created");
    res.redirect("/listings");
    
};

module.exports.renderEditForm =  async (req,res) => {
    let {id} = req.params;
    let listing=await Listing.findById(id);
    if(!listing){
            req.flash("error" , " Listing does not Exist !");
            return res.redirect("/listings");

    }
    let originalImageUrl = listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload" , "/upload/h_300,w_300,c_fill");
    res.render("listings/edit.ejs" ,{listing , originalImageUrl})
};

module.exports.updateChanges = async (req,res) => {
    let {id} = req.params;
    
    await Listing.findByIdAndUpdate(id, req.body.listing , {new:true});
       
    if( typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        Listing.image = { url , filename };
        await Listing.save();
    }
    req.flash("success" , "  Listing Updated");
    res.redirect(`/listings/${id}`);

    
};

module.exports.destroyListing = async (req,res) => {
    let {id} = req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    req.flash("success" , "  Listing Deleted");
     res.redirect("/listings");

};