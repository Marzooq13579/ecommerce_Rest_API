import express, { json, request } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "./config/database.js"; // Import database connection with event listeners
import authRouter from "./routes/Auth.js";
import productRouter from "./routes/Product.js";
import cartRouter from "./routes/cart.js";
import orderRouter from "./routes/Order.js";
import seedAdmin from "./utils/adminSeeder.js";

const app = express();

// CORS middleware
app.use(cors());

app.use(json());

// Your routes and other app configuration (e.g., user routes, product routes)

app.use("/api/auth", authRouter);
app.use("/api/product/", productRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);

// Server startup **after successfully connecting to the database**
mongoose.connection.once("open", () => {
  seedAdmin();
  const port = process.env.PORT || 5010;
  app.listen(port, () => console.log(`Server listening on port ${port}`));
});

// Handle connection errors gracefully
mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
  process.exit(1); // Exit gracefully
});

// Add error handling middleware after routes (optional)
app.use((err, req, res, next) => {
  // Handle errors here, send appropriate response or log
  console.error("Server error:", err);
  let message = "Something went wrong";
  if (err.message) message = err.message;
  res.status(500).json({ error: message });
});
