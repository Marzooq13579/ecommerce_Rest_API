import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId,
     ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId,
         ref: 'Product', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  shippingAddress: {
    name: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  paymentDetails: {
    cardNumber: { type: String },
   
  },
  orderStatus: { type: String },
  trackingNumber: { type: String },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
