const mongoose=require("mongoose");
const Schema=mongoose.Schema;


const listingSchema=new Schema({
    title:{
        type:String,
        require:true,
    },
    description:{
        type:String,
    },
    image:{
        filename:String,
        url:String,
        
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});

listingSchema.post("findOneAndDelete" , async (listing) =>{
    if(listing){
        await mongoose.model("Review").deleteMany({ _id : { $in : listing.reviews} } );
    }
});

const Listing=new mongoose.model("Listing" , listingSchema);
module.exports=Listing;