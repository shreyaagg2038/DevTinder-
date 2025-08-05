const express = require ("express");
const profileRouter = express.Router();
const {User} = require("../models/user");
const {userAuth} = require("../middlewares/auth");
const {validateProfileEdit} = require("../utils/validation")
const {validateEditPassword} = require("../utils/validation")
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view",userAuth,async (req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(500).send("ERROR: "+err.message);
    }
})

profileRouter.patch('/profile/edit',userAuth,async (req,res)=>{
    try{
    validateProfileEdit(req);
    const loggedInUser = req.user;
    console.log(loggedInUser);

    Object.keys(req.body).forEach(key=>{
        loggedInUser[key] = req.body[key];
    })
    await loggedInUser.save();
    console.log(loggedInUser);
    res.json({message:'${loggedInUser.firstName} profile updated succesfully',data:loggedInUser});
    }
    catch(err){
        res.status(404).send("ERROR:"+ err.message);
    }

})

profileRouter.patch('/profile/password',userAuth, async(req,res)=>{
    try{
    validateEditPassword(req);
    const {newPassword} = req.body;
    const loggedInUser = req.user;
    //generate password 
    const passwordHash = await bcrypt.hash(newPassword,10);
    if(passwordHash == loggedInUser["password"]){
        throw new Error("Password is same as previous one");
    }
    console.log(loggedInUser["password"]);
    
    
    console.log(passwordHash);
    //update password in DB 
    loggedInUser["password"] = passwordHash;
    await loggedInUser.save();
    res.send("Password updated successfully");
    }
    catch(err){
        res.status(404).send("ERROR:" + err.message);
    }
})

module.exports = profileRouter;