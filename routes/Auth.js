import express from "express";
import Jwt  from "jsonwebtoken";


const route=express.Router();
//import User from './models/User.js';
import User from '../models/User.js'
import CryptoJS from "crypto-js"; 
import Verify from "../MiddleWare/Verify.js";
const register=async (req,res,next)=>{
    try{
const {username,email,password,phone,address}=req.body;
//res.json(req.body)
 const crptyPass=await CryptoJS.AES.encrypt(password,"Secret");
 const user=new User({name:username,email,password:crptyPass,address,phone});
 const savedUser=await user.save();
 if(savedUser){
//const tok=await Jwt.sign
const tok=Jwt.sign({user:savedUser._id},"Secret",{expiresIn:"1h"});
res.status(201).cookie("token",tok,{httpOnly:true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 5)}).json({status:true,message:"User Registerd"});
    //res.status(201).json(savedUser);
 }else{
    res.status(500).json({status:false,message:"error occured"});
 }
 

    }
    catch(err){
        next(err);
    }
}

const login=async (req,res,next)=>{
    try {
        const { email, password } = req.body;
        //const {token}=req.cookies;
        //res.json(token)
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // Decrypt the stored password
        const bytes = CryptoJS.AES.decrypt(user.password, "Secret");
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
        // Compare decrypted password with the provided password
        if (password === decryptedPassword) {
            // Passwords match, issue JWT token
            const token = Jwt.sign({ userId: user._id }, "Secret", { expiresIn: "1h" });
            res.cookie("token", token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 5) }).json({ status: true, message: "Login successful" });
        } else {
            // Passwords don't match
            res.status(401).json({ status: false, message: "Invalid credentials" });
        }

    } catch (err) {
        next(err);
    }
}

const LogOut=async (req,res,next)=>{
    try{
        //res.json(req.user);
          const {token}=req.headers;
     
  if(!token){
    res.json({status:false,message:"User not present"});
  }
  else{
     res.cookie("token", "", { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 5) }).json({ status: true, message: "Logout successful" });
  }


    }
    catch(err){
        next(err);
    }
}


route.post('/register',register);
route.post('/login',login)
route.get('/logout',Verify,LogOut)
export default route;