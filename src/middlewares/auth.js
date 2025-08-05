const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req,res,next)=>{
    try{
    const cookies = req.cookies;
    const {token} = cookies;
    //console.log(token);
    if(!token){
        throw new Error ("Invalid Token");
    }
    const decodedMessage = await jwt.verify(token,"DEVTINDER@123");
    const {_id} = decodedMessage;
    const user = await User.findById(_id);
    //console.log(user);
    if(!user){
        throw new Error("User not found");
    }
    req.user = user;
    next();
    }
    catch(err){
        res.status(404).send("ERROR : " + err.message);
    }
};

module.exports = {
    userAuth
}