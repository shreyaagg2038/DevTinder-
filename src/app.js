const express = require('express');

const app = express();
const {connectDb} = require("./config/database");
const {User} = require("./models/user");
const { validateSignUp } = require('./utils/validation');
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');
const validator = require('validator');
const {userAuth} = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup",async (req,res)=>{
    try{
    validateSignUp(req);
    const {firstName,lastName,email,password } = req.body;
    //console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    //console.log(hashedPassword);
    const user1 = new User({firstName,lastName,email,password : hashedPassword});
    await user1.save();
    res.send("User added successfully");
    }
    catch(err) {
        res.status(500).send(err.message);
    }

})


// whenever a user logs in -> a cookie is generated and sent in the response 
app.post("/login",async (req,res)=>{
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
        res.cookie("token",token, { expires: new Date(Date.now() + 7*3600000),});
        res.send("Login Successful");

    }
    else{
        throw new Error ("Invalid Credentials");
    }
    }
    catch(err){
        res.status(401).send(err.message);
    }
})

app.post("/sendConnectionRequest",userAuth,async (req,res)=>{
    try{
        const user= req.user;
        res.send("Connection request sent by: " + user.firstName);
    }
    catch(err){
        res.status(404).send("ERROR " + err.message);
    }
});

app.get("/profile",userAuth,async (req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(500).send("ERROR: "+err.message);
    }
})
connectDb().then(()=>{
    console.log("Successfully connected to the DB");
    app.listen(3000,()=>{
    console.log("Server is successfully listening on port 3000");
})
}
).catch((err)=>{
    console.log(err);
});
