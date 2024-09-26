require('dotenv').config(); // Load environment variables first

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Ensure the path is correct

const createAdmin = async () => {
  try {
    // Debugging: Print environment variables
    console.log('MONGO_URI:', process.env.MONGO_URI); // Check if this logs the correct value
    console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
    console.log('ADMIN_NAME:', process.env.ADMIN_NAME);

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the .env file.');
    }

    // Connect to MongoDB using the MONGO_URI from .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Hash the admin password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, saltRounds);

    // Create the admin user
    const adminUser = new User({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
