const express=require("express");
const app=express();
const ExpressError=require("./Error.js");

app.use((req,res,next) => {
    console.log(req.query);
    let {token}=req.query;
    if(token == "getaccess"){
        next();
    }
    throw new ExpressError(408,"Denied!");
});

app.get("/post" , (req,res) => {
   //
     abcd=abcd;
    res.send("shbvfius");
});

app.use((err,req,res,next) => {
    let {status,message}=err;
    console.log("Errorrrrrrrr");
    res.status(status).send(message);
});

app.listen(8080,(req,res) =>{
    console.log("listening");
});



//shaikafshin298_db_user
//NTkJ3lZxQ4jODKLL

//mongodb+srv://shaikafshin298_db_user:NTkJ3lZxQ4jODKLL@cluster0.syoqkrb.mongodb.net/?appName=Cluster0
