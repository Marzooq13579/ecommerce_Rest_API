import express from "express";
import CartItem from "../models/CartItem.js";
const router = express.Router();


router.get("/items", async (req, res) => {
  try {
    const userId = req.user.user._id;
    const cartItems = await CartItem.find({ user: userId }).populate("product");
    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart items" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.user._id; 

    const existingItem = await CartItem.findOne({
      user: userId,
      product: productId,
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.json({ message: "Product quantity updated" });
    }

    const newCartItem = new CartItem({
      user: userId,
      product: productId,
      quantity,
    });
    await newCartItem.save();
    res.json({ message: "Product added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product to cart" });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    const updatedItem = await CartItem.findByIdAndUpdate(
      cartItemId,
      { quantity },
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating cart item" });
  }
});

router.delete("/remove/:id", async (req, res) => {
  try {
    const cartItemId = req.params.id;

    await CartItem.findByIdAndDelete(cartItemId);
    res.json({ message: "Cart item removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing cart item" });
  }
});

export default router;
