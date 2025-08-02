const authAdmin = (req,res,next)=>{
    console.log("Authenticating admin");
    const token = "xyz";
    const isAdmin = token === "xyz";
    if(isAdmin){
        next();
    }
    else{
       res.status(401).send("Sorry ACCESS ONLY TO ADMIN");
    }
}

const userAdmin = (req,res,next)=>{
    console.log("Authenticating user");
    const token = "xyzggg";
    const isUser = token === "xyzggg";
    if(isUser){
        next();
    }
    else{
       res.status(401).send("Sorry ACCESS ONLY TO Users");
    }
}

module.exports = {
    authAdmin,
    userAdmin
}