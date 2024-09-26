// routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Existing auth middleware
const adminAuth = require('../middleware/adminMiddleware'); // Admin authorization middleware
const Leave = require('../models/Leave'); // Assuming Leave model exists
const User = require('../models/User'); // User model
const Timesheet = require('../models/Timesheet');

/**
 * @route   GET /admin/leaves
 * @desc    Get all leave applications
 * @access  Private/Admin
 */
router.get('/leaves', auth, adminAuth, async (req, res) => {
  try {
    const leaves = await Leave.find().populate('userId', ['name', 'email']).sort({ appliedAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error('Error fetching leave applications:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PATCH /admin/leaves/:id
 * @desc    Approve or reject a leave application
 * @access  Private/Admin
 */
router.patch('/leaves/:id', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body; // Expected values: 'Approved' or 'Rejected'

    // Validate status
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find the leave application
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave application not found' });
    }

    // Update status
    leave.status = status;
    await leave.save();

    res.json({ message: `Leave application ${status.toLowerCase()} successfully`, leave });
  } catch (err) {
    console.error('Error updating leave application:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /admin/employees
 * @desc    Get all employees (users with role 'user')
 * @access  Private/Admin
 */
router.get('/employees', auth, adminAuth, async (req, res) => {
  try {
    const employees = await User.find({ role: 'user' }).select('name email');
    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /admin/timesheets/:employeeId
 * @desc    Get all timesheets for a specific employee
 * @access  Private/Admin
 */
router.get('/timesheets/:employeeId', auth, adminAuth, async (req, res) => {
  try {
    const timesheets = await Timesheet.find({ userId: req.params.employeeId }).sort({ date: -1 });
    res.json(timesheets);
  } catch (err) {
    console.error('Error fetching timesheets:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
