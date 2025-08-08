const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
const { set } = require("mongoose");
const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName age gender skills photoUrl about"

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
        .find({toUserId:loggedInUserId,status:"interested"}).select("fromUserId")
        .populate("fromUserId",USER_SAFE_DATA);
        if(!requests){
            res.status(400).json({message:"No requests"});
        }
        res.json(requests);
    }
    catch(err){
        res.status(404).json({message:`${err.message}`});
    }
})

userRouter.get('/user/feed',userAuth,async (req,res)=>{
    try{
        const page = req.query.page || 1;
        let limit = req.query.limit || 10;
        limit = limit>50 ? 50:limit;
        const skip = (page-1)*limit;
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest
        .find({$or:[{fromUserId:loggedInUser._id},
                    {toUserId:loggedInUser._id}
        ]}).select("fromUserId toUserId");

        const hideFromFeedUsers = new Set();
        connectionRequests.forEach((req)=>{
            hideFromFeedUsers.add(req.fromUserId);
            hideFromFeedUsers.add(req.toUserId);
        })
        const users =  await User.find({
            $and :[
                {_id : {$nin : Array.from(hideFromFeedUsers)}},
                {_id : {$ne : loggedInUser._id}}
            ]
        }).skip(skip).limit(limit)
        .select(USER_SAFE_DATA);
        res.json({message:"Other Users",data : users});
    }
    catch(err){
        res.status(400).json({message:`${err.message}`});
    }
})
module.exports =userRouter;