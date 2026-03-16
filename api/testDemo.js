require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const testDemoUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Find demo user
    const demoUser = await User.findOne({ email: 'test_user@mail.com' });
    if (!demoUser) {
      console.log('❌ Demo user not found!');
      return;
    }

    console.log('✅ Demo user found:');
    console.log('   Name:', demoUser.name);
    console.log('   Email:', demoUser.email);

    // Test password
    const isPasswordValid = await bcrypt.compare('password7809', demoUser.password);
    if (isPasswordValid) {
      console.log('✅ Demo password is correct');
    } else {
      console.log('❌ Demo password is incorrect');
    }

  } catch (error) {
    console.error('Error testing demo user:', error);
  } finally {
    mongoose.connection.close();
  }
};

testDemoUser();