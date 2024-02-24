//import { Express } from "express";
import User from "../models/User.js";
import  Jwt  from "jsonwebtoken";
const Verify=async (req,res,next)=>{ 
    try{
const {token}=req.headers;
if(token){

 const id=await Jwt.verify(token,"Secret");
 const user=await User.findOne({_id:id.userId});
req.user=user;
next();

}else{
    res.status(500).json({stauts:false,message:"Authentication failed"});
}
    }
    catch(err){
        res.status(500).json({stauts:false,message:"Authentication failed"});
    }
}

export default Verify;