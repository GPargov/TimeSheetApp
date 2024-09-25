// routes/timesheet.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Ensure this path is correct
const Timesheet = require('../models/Timesheet'); // Ensure this path is correct

/**
 * @route   POST /timesheet/create
 * @desc    Create a new timesheet
 * @access  Private
 */
router.post('/create', auth, async (req, res) => {
  try {
    const { date, startTime, endTime, breakTime } = req.body;

    // Basic validation
    if (!date || !startTime || !endTime || breakTime === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newTimesheet = new Timesheet({
      userId: req.user.id, // Extracted from auth middleware
      date,
      startTime,
      endTime,
      breakTime,
    });

    const savedTimesheet = await newTimesheet.save();
    res.json(savedTimesheet);
  } catch (err) {
    console.error('Error creating timesheet:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /timesheet
 * @desc    Get all timesheets for the authenticated user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const timesheets = await Timesheet.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(timesheets);
  } catch (err) {
    console.error('Error fetching timesheets:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
