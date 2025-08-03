const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required : true,
        minLength : 4,
        maxLength: 50
    },
    lastName :{
        type : String ,
        minLength:4,
        maxLength:50
    },
    email :{
        type : String,
        required: true,
        unique: true,
        trim:true,
        maxLength:50
    },
    password :{
        type : String,
        required:true,
        minLength:12,
        maxLength:30,
        validate:(value)=>{
           return  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/.test(value);
        }
    },
    age :{
        type: Number,
        min : 18
    },
    gender :{
        type : String,
        validate: (value)=>{
            const arr =["male","female","others"];
            if(!arr.includes(value)){
                throw new Error ("Gender is not valid");
            }
        }
    },
    photoUrl:{
        type:String,
        default : "This is bio section",
        maxLength:100,
        trim :true
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