const express = require("express");
const authRouter = express.Router();
const { validateSignUp } = require('../utils/validation');
const bcrypt = require("bcrypt");
const {User} = require("../models/user");


authRouter.post("/signup",async (req,res)=>{
    try{
    validateSignUp(req);
    const {firstName,lastName,email,password } = req.body;
    //console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    //console.log(hashedPassword);
    const findUser = await User.findOne({email:email});
    if(findUser){
        throw new Error("User already exists");
    }
    const user1 = new User({firstName,lastName,email,password : hashedPassword});
    const newUser = await user1.save();
    const token = await newUser.getJWT();
    res.cookie("token",token, { expires: new Date(Date.now() + 24*3600000),});
    res.send(newUser);
    }
    catch(err) {
        res.status(500).send(err.message);
    }

})
// whenever a user logs in -> a cookie is generated and sent in the response 
authRouter.post("/login",async (req,res)=>{
    //validate username and password 
    // authenticate username and password 
    try{
    const {email,password} = req.body;
    const user = await User.findOne({email:email});
    if(!user){
        throw new Error ("Invalid Credentials");
    }
    const passwordCheck = await user.validatePassword(password);
    if(passwordCheck){
        const token = await user.getJWT();
        res.cookie("token",token, { expires: new Date(Date.now() + 24*3600000),});
        res.send(user);
    }
    else{
        throw new Error ("Invalid Credentials");
    }
    }
    catch(err){
        res.status(401).send(err.message);
    }
})

authRouter.post('/logout',(req,res)=>{
    res.cookie("token",null,{ expires: new Date(Date.now()) });
    res.send("Logout Successfully");
})


module.exports = authRouter;