// server.js
const express = require('express');
const connectDB = require('./config/db'); // Assuming you have a separate file for database connection
const cors = require('cors');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use('/auth', require('./routes/auth')); // Authentication routes
app.use('/users', require('./routes/users')); // User routes
app.use('/timesheet', require('./routes/timesheet')); // Timesheet routes
app.use('/leave', require('./routes/leave')); // Leave routes
app.use('/admin', require('./routes/admin')); // Admin routes
// Add other routes as needed

// Default Route
app.get('/login', (req, res) => res.send('API Running'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
