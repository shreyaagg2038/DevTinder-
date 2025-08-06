const mongoose = require ("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId :{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId :{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status:{
        type:  String,
    enum: {
      values: ['ignored', 'interested','accepted','rejected'],
      message: '${VALUE} is not valid status'
    },
    required:true,
    }
},{
    timestamps : true
})

connectionRequestSchema.pre('save',function(next){
    //console.log(this);
    const from = this.fromUserId;
    const to= this.toUserId;
    if(this.fromUserId.equals(this.toUserId)){
        throw new Error("Cannot send request to itself");
    }
    next();
})
const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = {ConnectionRequest};