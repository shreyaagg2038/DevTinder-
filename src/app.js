const express = require('express');

const app = express();
const {connectDb} = require("./config/database");
const {User} = require("./models/user");
const { validateSignUp } = require('./utils/validation');
const bcrypt = require("bcrypt");
const { default: mongoose } = require('mongoose');

app.use(express.json());

app.get("/user",async (req,res)=>{
    try{
    const filter = req.body.id;
    //console.log(filter);
    const users = await User.findById(filter);
    if(!users){
        res.status(404).send("User Not Found");
    }
    else{
    res.send(users);
    }

    }
    catch(err){
        res.status(500).send(err.message);
    }
})

app.delete("/user",async(req,res)=>{
    const userId = req.body.userId;
    try{
        const users  = await User.findByIdAndDelete(userId);
        //console.log(users);
        res.send("User deleted successfully");
    }
    catch(err){
        res.status(500).send("User not deleted");
    }
})

// I want only about,skills,age,gender,photoUrl that can be changed 
app.patch("/user/:userId",async(req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    //console.log(userId);
    //console.log(update);

    try{
        const ALLOWED_UPDATES = ["age","skills","gender","about","photoUrl"];
    const canBeUpdated = Object.keys(data).every((k)=>
            ALLOWED_UPDATES.includes(k));
        console.log(canBeUpdated);
        if(!canBeUpdated){
            throw new Error ("These fields cant'be updated");
        }
        const users  = await User.findByIdAndUpdate(userId,data,{returnDocument:"after",runValidators:true});
        console.log(users);
        res.send("User Name updated successfully");
    }
    catch(err){
        res.status(500).send(err.message);
    }
})

// app.put("/user",async(req,res)=>{
//     const userId = req.body.userId;
//     const update = req.body;
//     console.log(userId);
//     console.log(update);
//     try{
//         const users  = await User.findByIdAndUpdate(userId,update,{returnDocument:"after"});
//         console.log(users);
//         res.send("User Name updated successfully");
//     }
//     catch(err){
//         res.status(500).send("User not deleted");
//     }
// })

app.get("/feed",async (req,res)=>{
    try{
    //const filter = req.body.email;
    //console.log(filter);
    const users = await User.find({});
    if(users.length===0){
        res.status(404).send("User Not Found");
    }
    else{
    res.send(users);
    }

    }
    catch(err){
        res.status(500).send("Something went wrong");
    }
})
app.post("/signup",async (req,res)=>{
    // validate the fields 
    // encrypt the password 
    //CREATING A NEW INSTANCE OF USER MODEL
    try{
    validateSignUp(req);
    const {firstName,lastName,email,password } = req.body;
    console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user1 = new User({firstName,lastName,email,password : hashedPassword});
    await user1.save();
    res.send("User added successfully");
    }
    catch(err) {
        res.status(500).send(err.message);
    }

})

app.post("/login",async (req,res)=>{
    //validate username and password 
    // authenticate username and password 
    try{
    const {email,password} = req.body;
    const user = await User.findOne({email:email});
    if(!user){
        throw new Error ("User not found");
    }
    const hashedPassword = user.password;

    const passwordCheck = bcrypt.compare(password, hashedPassword);
    if(!passwordCheck){
        throw new Error ("Incorrect Password");
    }
    else{
        res.status(400).send("Login Successful");
    }
    }
    catch(err){
        res.status(401).send(err.message);
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
