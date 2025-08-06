const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age Gender Skills"

userRouter.get('/user/connections',userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connections = await ConnectionRequest
        .find({$or:[{toUserId:loggedInUser,status:"accepted"},{fromUserId:loggedInUser,status:"accepted"}]})
        .populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
        if(!connections){
            res.status(404).json({message:"No connections"});
        }
        const data = connections.map((row)=>{
            if(row.fromUserId._id.equals(loggedInUser._id)){
                return row.toUserId;
            }
            else{
                return row.fromUserId;
            }
        })
        res.json(data);
    }
    catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
})

userRouter.get('/user/requests/received',userAuth,async (req,res)=>{
    try{
        const loggedInUserId = req.user._id;
        const requests = await ConnectionRequest
        .find({toUserId:loggedInUserId,status:"interested"})
        .populate("fromUserId",USER_SAFE_DATA);
        if(!requests){
            res.status(400).json({message:"No requests"});
        }
        res.json({message:`Following are ${req.user.firstName}'s requests to be reviewed: `,data : requests});
    }
    catch(err){
        res.status(404).json({message:`${err.message}`});
    }
})
module.exports =userRouter;