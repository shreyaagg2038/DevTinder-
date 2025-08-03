const express = require('express');

const app = express();
const {connectDb} = require("./config/database");
const {User} = require("./models/user");

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

app.patch("/user",async(req,res)=>{
    const userId = req.body.userId;
    const update = req.body;
    console.log(userId);
    console.log(update);
    try{
        const users  = await User.findByIdAndUpdate(userId,update,{returnDocument:"after",runValidators:true});
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
    const userObj = req.body;
    console.log(userObj);
    //CREATING A NEW INSTANCE OF USER MODEL
    try{
    const user1 = new User(userObj);
    await user1.save();
    res.send("User added successfully");
    }
    catch(err) {
        res.status(500).send("Error while adding user " + err.message);
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
