const express = require('express');

const app = express();
const {authAdmin,userAdmin} = require("./middlewares/auth.js")
//creating admin/getData and admin/deleteUser api
//Adding logic to check that admin is the one who is doing these operations
// so this means everytime I want to check auth i need to add it in all admin apis but this is not good way to do this 
// so here comes middleware as a saviour

app.use("/admin",authAdmin)

//app.use("/user",userAdmin);

app.get("/user/getProfiles",userAdmin,(req,res)=>{
    throw new error("abcdefghijkl");
    res.send("All the profiles of the users");
})
//Error Handling middleware 
app.use('/',(err,req,res,next)=>{
    if(err){
        res.status(500).send("Something went wrong");
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