// routes/leave.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const LeaveApplication = require('../models/LeaveApplication');
const User = require('../models/User');

// @route   GET /leave/balance/:userId
// @desc    Get leave balance for a user
// @access  Private
router.get('/balance/:userId', auth, async (req, res) => {
  try {
    // Verify that the user is authorized to access this information
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Calculate the leave balance (this is a placeholder logic)
    // You need to define how the leave balance is calculated
    const totalLeavesAllowed = 30; // For example
    const leavesTaken = await LeaveApplication.countDocuments({
      userId: req.params.userId,
      status: 'Approved',
    });

    const leaveBalance = totalLeavesAllowed - leavesTaken;

    res.json({ leaveBalance });
  } catch (err) {
    console.error('Error fetching leave balance:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
