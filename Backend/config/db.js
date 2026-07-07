/**
 * @file db.js
 * @description MongoDB connection setup using Mongoose. Handles connect/disconnect events.
 * @module config/db
 */

const mongoose = require('mongoose');
const autoSeed = require('./autoSeed');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Automatically seed data and admin if needed
    autoSeed();
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;