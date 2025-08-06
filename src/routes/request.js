const express = require("express");
const requestRouter = express.Router();
const {ConnectionRequest} = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const {validateConnectionRequest} = require("../utils/validation");
const { User } = require("../models/user");

requestRouter.post("/connection/sent/:status/:userId",userAuth,async (req,res)=>{
    try{
    await validateConnectionRequest(req);
    const loggedInUser = req.user;
    const fromUserId= req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;
    const toUser =await User.findById(toUserId);
    const isExistingConnection = await ConnectionRequest.find(
        {$or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}]}
    );
    if(isExistingConnection.length > 0){
        throw new Error("Request already exists");
    }
    const request  = new ConnectionRequest({fromUserId,toUserId,status});
    await request.save();
    res.json({
        message:`${loggedInUser.firstName} sent the request succesfully to ${toUser.firstName} `,
        date : request
    })
    }
    catch(err){
        res.status(404).send("ERROR: " + err.message);
    }

})

requestRouter.post('/request/review/:status/:requestId',userAuth,async (req,res)=>{
    try{
        // allowed status -> accepted, rejected 
        const allowedStatus = ["accepted","rejected"];
        const status = req.params.status;
        const requestId = req.params.requestId;
        const loggedInUser = req.user._id;
        if(!allowedStatus.includes(status)){
            res.status(404).json({message:"Invalid status"});
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser,
            status: "interested"
        })
        if(!connectionRequest){
            res.status(404).json({message:"Connection request not found"});
        }
        connectionRequest.status = status;
        await connectionRequest.save();
        res.json({message:`Connection request ${status}`,data : connectionRequest});
    }
    catch(err){
        res.status(404).json({message : `${err.message}`});
    }
})
module.exports = requestRouter;