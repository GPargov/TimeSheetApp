const express = require('express');
const Timesheet = require('../models/Timesheet');
const auth = require('../middleware/auth'); // Import auth middleware
const router = express.Router();

// Create a timesheet
router.post('/create', auth, async (req, res) => {
  const { date, startTime, endTime, breakTime } = req.body;
  try {
    const timesheet = new Timesheet({
      date,
      startTime,
      endTime,
      breakTime,
      userId: req.user.userId
    });
    await timesheet.save();
    res.json(timesheet);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get timesheets for a user
// Get timesheets for a specific user or all timesheets if admin
router.get('/', auth, async (req, res) => {
  try {
    let timesheets;
    
    // If the user is an admin, fetch all timesheets and include user details (name)
    if (req.user.role === 'admin') {
      timesheets = await Timesheet.find().populate('userId', 'name'); // Populate user name
    } else {
      // If the user is not an admin, fetch only their timesheets
      timesheets = await Timesheet.find({ userId: req.user.userId });
    }

    res.json(timesheets);
  } catch (err) {
    res.status(500).send('Server error');
  }
});


module.exports = router;
