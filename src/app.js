const express = require('express');

const app = express();

app.get("/user",(req,res)=>{
    res.send({firstname:"Shreya",lastName:"Aggarwal"});
})
app.post("/user",(req,res)=>{
    res.send("Data saved successfully to DB");
})
app.put("/user",(req,res)=>{
    res.send("Data updated successfully to DB");
})
app.delete("/user",(req,res)=>{
    res.send("Data deleted successfully from DB");
})
app.patch("/user",(req,res)=>{
    res.send("Data patch modified successfully to DB");
})
app.use("/admin",(req,res)=>{
    res.send("Hello from the admin.")
})

app.listen(3000,()=>{
    console.log("Server is successfully listening on port 3000");
})