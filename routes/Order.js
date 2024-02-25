import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// Create Order
router.post("/createOrder", async (req, res, next) => {
  try {
    const { user, items, shippingAddress, paymentDetails, orderStatus, trackingNumber } = req.body;
    const order = new Order({
      user,
      items,
      shippingAddress,
      paymentDetails,
      orderStatus,
      trackingNumber
    });
    const savedOrder = await order.save();
    res.status(201).json({ status: true, message: "Order created", data: savedOrder });
  } catch (error) {
    next(error);
  }
});

// Read All Orders
router.get("/getOrderDetails", async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ status: true, message: "All orders", data: orders });
  } catch (error) {
    next(error);
  }
});

// Read Order by ID
router.get("/getOrderById/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ status: false, message: "Order not found" });
    }
    res.status(200).json({ status: true, message: "Order found", data: order });
  } catch (error) {
    next(error);
  }
});

// Update Order by ID
router.put("/updateOrderBy/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const updatedOrderData = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updatedOrderData, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ status: false, message: "Order not found" });
    }
    res.status(200).json({ status: true, message: "Order updated", data: updatedOrder });
  } catch (error) {
    next(error);
  }
});

// Delete Order by ID
router.delete("/deleteOrderById/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ status: false, message: "Order not found" });
    }
    res.status(200).json({ status: true, message: "Order deleted", data: deletedOrder });
  } catch (error) {
    next(error);
  }
});

export default router;
