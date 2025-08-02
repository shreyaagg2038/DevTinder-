const express = require('express');

const app = express();

//creating admin/getData and admin/deleteUser api
//Adding logic to check that admin is the one who is doing these operations
// so this means everytime I want to check auth i need to add it in all admin apis but this is not good way to do this 
// so here comes middleware as a saviour

app.use("/admin",(req,res,next)=>{
    console.log("Authenticating admin");
    const token = "xyz";
    const isAdmin = token === "xyz";
    if(isAdmin){
        next();
    }
    else{
       res.status(401).send("Sorry ACCESS ONLY TO ADMIN");
    }
})
app.get("/admin/getData",(req,res)=>{
    res.send("Data sent successfully");
})

app.get("/admin/deleteUser",(req,res)=>{
    res.send("Deleted a User");
})


app.listen(3000,()=>{
    console.log("Server is successfully listening on port 3000");
})