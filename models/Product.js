
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String },
  price: { type: Number, required: true },
  images: { type: [String] },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  stock: { type: Number },
  brand: { type: String },
  seller:{type: mongoose.Schema.Types.ObjectId,ref:'User'}
});

const Product = mongoose.model('Product', productSchema);

export default Product;
