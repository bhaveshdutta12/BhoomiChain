const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/bhoomichain',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed - running without database:', error.message);
    // Don't exit for hackathon demo - continue without database
    return null;
  }
};

module.exports = connectDB;
