import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from './config/database.js'; // Import database connection with event listeners
import cartRouter from './routes/cart.js'; 

const app = express();

// CORS middleware
app.use(cors());

// Your routes and other app configuration (e.g., user routes, product routes)


app.use('/cart',cartRouter)





// Server startup **after successfully connecting to the database**
mongoose.connection.once('open', () => {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server listening on port ${port}`));
});

// Handle connection errors gracefully
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1); // Exit gracefully
});

// Add error handling middleware after routes (optional)
app.use((err, req, res, next) => {
  // Handle errors here, send appropriate response or log
  console.error('Server error:', err);
  res.status(500).json({ error: 'Something went wrong' });
});




