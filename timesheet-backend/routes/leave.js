// routes/leave.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Ensure the path is correct
const Leave = require('../models/Leave'); // Assuming you have a Leave model

/**
 * @route   POST /leave/apply
 * @desc    Apply for leave
 * @access  Private
 */
router.post('/apply', auth, async (req, res) => {
  try {
    const { startDate, endDate, leaveType, reason } = req.body;

    // Basic validation
    if (!startDate || !endDate || !leaveType || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new leave application
    const newLeave = new Leave({
      userId: req.user.id, // Extracted from auth middleware
      startDate,
      endDate,
      leaveType,
      reason,
      status: 'Pending', // Initial status
    });

    const savedLeave = await newLeave.save();
    res.json(savedLeave);
  } catch (err) {
    console.error('Error applying for leave:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /leave
 * @desc    Get all leave applications for the authenticated user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user.id }).sort({ startDate: -1 });
    res.json(leaves);
  } catch (err) {
    console.error('Error fetching leave applications:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
