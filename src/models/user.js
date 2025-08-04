const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required : true,
        minLength : 4,
        maxLength: 50
    },
    lastName :{
        required : true,
        type : String ,
        minLength:4,
        maxLength:50
    },
    email :{
        type : String,
        required: true,
        unique: true,
        trim:true,
        maxLength:50,
        validate: (value)=>{
            return validator.isEmail(value);
        }
    },
    password :{
        type : String,
        required:true,
        minLength:12,
        validate:(value)=>{
            if(!validator.isStrongPassword(value)){
                throw new Error("Please enter a strong password");
            }
        }
    },
    age :{
        type: Number,
        min : 18
    },
    gender :{
        type : String,
        lowercase : true,
        validate: (value)=>{
            const arr =["male","female","others"];
            if(!arr.includes(value)){
                throw new Error ("Gender is not valid");
            }
        }
    },
    photoUrl:{
        type:String,
        maxLength:100,
        trim :true
    },

    about:{
        type : String,
        default : "This is bio section"
    },
    skills:{
        type :[String],
        validate:(value)=>{
            if(value.length>10){
                throw new Error ("Upto 10 skills can be added.");
            }
        }
    }

},{
    timestamps : true
})

const User = mongoose.model("User",userSchema);
module.exports = {User};