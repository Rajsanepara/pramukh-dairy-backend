import mongoose from "mongoose"

const schema = new mongoose.Schema({

clientId:{
type:mongoose.Schema.Types.ObjectId,
ref:"Client"
},

date:String,
savar:Number,
sanj:Number

})

export default mongoose.model("MilkEntry",schema)