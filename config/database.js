import mongoose from 'mongoose';

const config = {
  uri: process.env.MONGODB_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

// Connect to MongoDB
mongoose.connect(config.uri, config.options)
  .then(() => {
    console.log('Connected to MongoDB');
    // Trigger the 'open' event for server startup
    mongoose.connection.emit('open');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit gracefully if connection fails
  });

export default mongoose;

// No need for additional event listeners as we emit the 'open' event manually above