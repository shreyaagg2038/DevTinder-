
const validator = require("validator");
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
    // const sanityCheck = Object.keys(req.body).forEach((key)=>{
    //     if(key=="firstName"){
    //         return key.length>4;
    //     }
    //     if(key == "skills"){
    //         return key.length<=10;
    //     }
    //     if(key == "about"){
    //         return key.length<=50;
    //     }
    // })
    // if(!sanityCheck){
    //     throw new Error("Edit was unsuccessful");
    // }
}

const validateEditPassword = (req)=>{
    const {newPassword} = req.body;
    const isPasswordValid = validator.isStrongPassword(newPassword);
    if(!isPasswordValid){
        throw new Error ("Please enter a strong password");
    }
}
module.exports = {validateSignUp,validateProfileEdit,validateEditPassword};