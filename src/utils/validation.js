
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

module.exports = {validateSignUp};