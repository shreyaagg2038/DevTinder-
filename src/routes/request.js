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
    //console.log(loggedInUser.firstName);
    const fromUserId= req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;
    const toUser =await User.findById(toUserId);
    if(fromUserId==toUserId){
        throw new Error("Cannot send request to itself");
    }
    const isExistingConnection = await ConnectionRequest.find(
        {$or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}]}
    );
    if(isExistingConnection.length !=0){
        throw new Error("Request already exists");
    }
    const request  = new ConnectionRequest({fromUserId,toUserId,status});
    request.save();
    res.json({
        message:`${loggedInUser.firstName} sent the request succesfully to ${toUser.firstName} `,
        date : request
    })
    }
    catch(err){
        res.status(404).send("ERROR: " + err.message);
    }

})

module.exports = requestRouter;