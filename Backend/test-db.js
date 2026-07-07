const mongoose = require('mongoose');
const Earthquake = require('./models/Earthquake.model');
require('dotenv').config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/global_earthquakes');
    const count = await Earthquake.countDocuments();
    console.log('Total Earthquakes:', count);
    const top = await Earthquake.find().sort({ mag: -1 }).limit(1);
    console.log('Top Earthquake:', top);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
