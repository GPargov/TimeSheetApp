// routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Timesheet = require('../models/Timesheet');
const User = require('../models/User');

// Middleware to check admin role
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Access denied: Admins only' });
  }
  next();
};

// @route   GET /admin/employees
// @desc    Get all employees
// @access  Private (Admin)
router.get('/employees', auth, adminAuth, async (req, res) => {
  try {
    const employees = await User.find({ role: 'user' }).select('-password');
    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /admin/timesheets/:userId
// @desc    Get timesheets for a specific user
// @access  Private (Admin)
router.get('/timesheets/:userId', auth, adminAuth, async (req, res) => {
  try {
    const timesheets = await Timesheet.find({ userId: req.params.userId }).sort({
      date: -1,
    });
    res.json(timesheets);
  } catch (err) {
    console.error('Error fetching timesheets:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
