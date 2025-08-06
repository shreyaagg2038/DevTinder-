const express = require('express');

const app = express();
const {connectDb} = require("./config/database");
const { default: mongoose } = require('mongoose');
const cookieParser = require('cookie-parser');

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(cookieParser());
app.use(express.json());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
//app.use('/',userRouter);


app.post("/sendConnectionRequest",async (req,res)=>{
    try{
        const user= req.user;
        res.send("Connection request sent by: " + user.firstName);
    }
    catch(err){
        res.status(404).send("ERROR " + err.message);
    }
});


connectDb().then(()=>{
    console.log("Successfully connected to the DB");
    app.listen(3000,()=>{
    console.log("Server is successfully listening on port 3000");
})
}
).catch((err)=>{
    console.log(err);
});
