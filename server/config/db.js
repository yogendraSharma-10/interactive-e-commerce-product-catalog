const mongoose = require('mongoose');

/**
 * @function connectDB
 * @description Establishes a connection to the MongoDB database using Mongoose.
 *              The connection URI is retrieved from environment variables for security and flexibility.
 *              Includes robust error handling and logging for production environments.
 */
const connectDB = async () => {
  try {
    // Ensure MONGO_URI is set in the environment variables
    if (!process.env.MONGO_URI) {
      console.error('FATAL ERROR: MONGO_URI is not defined in environment variables.');
      process.exit(1); // Exit the process if critical environment variable is missing
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,       // Use the new URL parser
      useUnifiedTopology: true,    // Use the new server discovery and monitoring engine
      // useCreateIndex: true,     // Deprecated in Mongoose 6.x
      // useFindAndModify: false,  // Deprecated in Mongoose 6.x
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000,      // Close sockets after 45 seconds of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;