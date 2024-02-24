import mongoose from 'mongoose';


const addressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
 
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique:true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: addressSchema },
  phoneNumber: { type: Number },
},
{timestamps:true});

const User=mongoose.model('User', userSchema);
export default User;
