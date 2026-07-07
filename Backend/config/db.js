const mongoose = require('mongoose');
const autoSeed = require('./autoSeed');

const connectDB = async () => {
  let mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('\n❌ MongoDB Connection Error: MONGO_URI environment variable is missing!');
    console.error('Please define MONGO_URI in your .env file or Render environment settings.\n');
    process.exit(1);
  }

  // Clean the connection string to handle quotes or leading/trailing spaces
  mongoUri = mongoUri.trim().replace(/^["']|["']$/g, '');

  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    console.error('\n❌ MongoDB Connection Error: Invalid connection string scheme!');
    console.error('Expected connection string to start with "mongodb://" or "mongodb+srv://".');
    console.error(`Received value: "${mongoUri}"\n`);
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
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

