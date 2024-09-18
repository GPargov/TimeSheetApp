const express = require('express');
const Timesheet = require('../models/Timesheet');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to verify JWT and admin role
const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin endpoint to get all timesheets
router.get('/timesheets', auth, async (req, res) => {
  try {
    const timesheets = await Timesheet.find().populate('userId', 'name');
    res.json(timesheets);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
