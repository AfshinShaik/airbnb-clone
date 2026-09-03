const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync")
const ExpressError=require("./utils/ExpressError")
const { listingSchema ,reviewSchema} = require("./schema.js")
const Review=require("./models/review.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const usersRouter=require("./routes/user.js");


const session=require("express-session");

const flash=require("connect-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");



const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("working");
}).catch(err => {
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
};

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname,"views"));
app.use(express.urlencoded({extended :true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,'public')));


const sessionOptions =({
    secret : "my secret",
    resave:false,
    saveUninitialized : true,
    cookie : {
        expires :Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    },
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use( (req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser= req.user;
    next();
});

// All listings Index route
app.get("/listings" , wrapAsync(async (req,res) => {
   let allListings= await Listing.find({});
   res.render("listings/index" , { allListings });
}));

// to add a demo user
app.get("/demouser" , async (req,res) => {
    let fakeuser = new User({
        email:"zakhia123!gmail.com",
        username:"Zakhia",
    })

    let registered=await User.register(fakeuser , "zakhia");
    res.send(registered);
})


app.use("/listings" , listingsRouter );
app.use("/listings/:id/reviews" , reviewsRouter );
app.use("/" , usersRouter );




// app.get("/test/listing" ,async (req,res) => {
//     let sample=new Listing({
//         title:"Villa",
//         description:"feeel at home",
//         price:100000,
//         location:"ysr,Kadapa",
//         country:"India",
//     });
//     await sample.save().then(()=>{
//         console.log(sample);
//     });
//     res.send("sample");
// });

app.all( "*any" , (req,res,next) => {
    next( new ExpressError(404,"Page not found"));
});

 app.use((err,req,res,next)=>{
     let { statusCode=505 , message="Something went wrong!" } =err;
     res.status(statusCode).render("listings/error.ejs" , { message });
 });

// app.get("/" , (req,res) => {
//     res.send("hi");
// });


app.listen(8080, () => {
    console.log("Listening 8080");
});