import express from "express"
import MilkEntry from "../models/MilkEntry.js"

const router = express.Router()

router.post("/save",async(req,res)=>{

const {clientId,date,savar,sanj}=req.body

let entry = await MilkEntry.findOne({clientId,date})

if(entry){

entry.savar=savar
entry.sanj=sanj

await entry.save()

}else{

entry = new MilkEntry({

clientId,
date,
savar,
sanj

})

await entry.save()

}

res.json(entry)

})

router.get("/day/:date",async(req,res)=>{

const data = await MilkEntry.find({

date:req.params.date

}).populate("clientId")

res.json(data)

})

export default router