
const validator = require("validator");
const { User } = require("../models/user");
const validateSignUp = (req)=>{
    const {firstName,lastName,email,password} = req.body;

    if(!firstName || !lastName){
        throw new Error ("Please enter a valid name");
    }
    if(!validator.isEmail(email)){
        throw new Error ("Invalid Email");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error ("Please enter a string password");
    }
}

const validateProfileEdit = (req)=>{
    const allowedEditFields = ["firstName","lastName","age","gender","about","skills"];
    const isAllowed = Object.keys(req.body).every(field=> allowedEditFields.includes(field));
    if(!isAllowed){
        throw new Error ("These fields can't be edited");
    }
}

const validateEditPassword = (req)=>{
    const {newPassword} = req.body;
    const isPasswordValid = validator.isStrongPassword(newPassword);
    if(!isPasswordValid){
        throw new Error ("Please enter a strong password");
    }
}
const validateConnectionRequest = async function (req){
    const toUserId= req.params.userId;
    const status = req.params.status;
    const allowedStatus = ["ignored","interested"];
    const isStatusAllowed = allowedStatus.includes(status);
    if(!isStatusAllowed){
        throw new Error ("Status not supported");
    }
    const isUserPresent = await User.findById(toUserId);
    //console.log(!isUserPresent);
    if(!isUserPresent){
        throw new Error ("User not found");
    }
}
module.exports = {validateSignUp,validateProfileEdit,validateEditPassword,validateConnectionRequest};