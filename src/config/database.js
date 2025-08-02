const {mongoose,Schema} = require("mongoose");
 // returns a promise so we wrap it inside a function

const connectDb = async ()=>{
    await mongoose.connect("mongodb+srv://shreyaagg2038:uDyk0ikcu65sbznF@namastenode.00fhyzw.mongodb.net/devTinder");
}
module.exports = {connectDb};

