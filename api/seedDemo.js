require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedDemoUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'test_user@mail.com' });
    if (existingUser) {
      console.log('Demo user already exists');
      return;
    }

    // Create demo user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password7809', salt);

    const demoUser = new User({
      name: 'Demo User',
      email: 'test_user@mail.com',
      password: hashedPassword
    });

    await demoUser.save();
    console.log('Demo user created successfully!');
    console.log('Email: test_user@mail.com');
    console.log('Password: password7809');

  } catch (error) {
    console.error('Error creating demo user:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDemoUser();