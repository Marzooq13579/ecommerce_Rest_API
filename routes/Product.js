import Product from "../models/Product.js";
import  Express  from "express";
const productrouter=Express.Router();
import cloudinary from 'cloudinary'
//const cloudinary=require('cloudinary').v2 
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
  });

const addProduct=async (req,res,next)=>{
try{
const {title,desc,price,category,stock,brand,seller}=req.body;
const image=req.files.image;
const upld=await cloudinary.uploader.upload(image.tempFilePath);
if(upld){
const product=new Product({title,desc,price,category,stock,brand,images:upld.secure_url,seller});
await product.save().then((pro)=>{
    res.status(201).json({status:true,message:"Product created",pro});
}).catch((err)=>{res.status(500).json(err)})}else{
    res.status(500).json({status:false,message:"Can't Upload Image"})
}
}catch(err){
    next(err);
}
}
const deleteProduct=async (req,res,next)=>{
    try{
        const {id}=req.params;
        const {seller}=req.body;
        const findPro=await Product.findOne({_id:id});
        if(!findPro){
            res.status(500).json({status:false,message:"Product Is Not Available"});
        }
    if(findPro.seller!=seller){
        res.status(500).json({status:false,message:"Can't authenticate user"});
    }
    await Product.findByIdAndDelete({_id:id}).then(()=>{
        res.status(200).json({status:true,message:"Product Deleted"});  
    }).catch((err)=>{
        res.status(500).json({status:false,message:"Can't Delete Product"});
    })
    }
    catch(err){
next(err);
    }
}

const Update=async(req,res,next)=>{
    try{
const {id}=req.params;
const findP=await Product.findById(id);
if(!findP){
    res.status(500).json({status:false,message:"Product Is Not Available"});
}
const {title,desc,price,category,stock,brand,seller}=req.body;
const image=req.files.image;
if(image){
    const upld=await cloudinary.uploader.upload(image.tempFilePath);
    if(upld){
   await Product.findByIdAndUpdate(id,{title,desc,price,category,stock,brand,images:upld.secure_url,seller},{new:true,runValidators:true,useFindAndModify:false}).then((data)=>{
    res.status(200).json({status:true,messgae:"Product updated",data});
   }).catch((err)=>{ res.status(200).json({status:false,messgae:"Product is not updated"})})

   }
    else{
        res.status(500).json({status:false,message:"Can't Upload Image"})
    } 
}else{
    await Product.findByIdAndUpdate(id,{title,desc,price,category,stock,brand,seller},{new:true,runValidators:true,useFindAndModify:false}).then((data)=>{
        res.status(200).json({status:true,messgae:"Product updated",data});
       }).catch((err)=>{ res.status(200).json({status:false,messgae:"Product is not updated"})})
    
}

    }
    catch(err){
next(err);
    }
}
productrouter.delete('/delete/:id',deleteProduct);
productrouter.post('/create',addProduct);
export default productrouter;

