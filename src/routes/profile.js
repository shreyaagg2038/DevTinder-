const express = require ("express");
const profileRouter = express.Router();
const {User} = require("../models/user");
const {userAuth} = require("../middlewares/auth");

profileRouter.get("/profile/view",userAuth,async (req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(500).send("ERROR: "+err.message);
    }
})

// profileRouter.patch('/profile/edit',userAuth,async (req,res)=>{
//     console.log(req.body);
//     const keyName = Object.keys(req.body).every(field=> console.log(field));
//     res.send("Hey You are editing your profile");


// })

module.exports = profileRouter;