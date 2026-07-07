require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User.model');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    const email = 'arpan@example.com';
    let user = await User.findOne({ email });
    if (user) {
      console.log('👤 User already exists, upgrading to admin & verified...');
      user.role = 'admin';
      user.isVerified = true;
      await user.save();
    } else {
      console.log('👤 Creating new admin user...');
      user = await User.create({
        name: 'Arpan Shah',
        email: email,
        password: 'Password123',
        role: 'admin',
        isVerified: true
      });
    }

    console.log('✨ Admin user configured successfully:');
    console.log(`   Email: ${user.email}`);
    console.log('   Password: Password123');
    console.log(`   Role: ${user.role}`);
    console.log(`   Verified: ${user.isVerified}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin user:', err.message);
    process.exit(1);
  }
};

seedAdmin();
