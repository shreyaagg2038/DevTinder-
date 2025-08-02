const express = require('express');

const app = express();
const {connectDb} = require("./config/database");
const {User} = require("./models/user");

app.use(express.json());
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
        res.status(500).send("Error while adding user");
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
