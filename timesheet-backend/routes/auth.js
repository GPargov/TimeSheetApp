const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

// Import User model
const User = require('../models/User');

const JWT_SECRET = 'your_hardcoded_jwt_secret_key'; // Must match authMiddleware.js

// Register Route
router.post(
  '/register',
  [
    check('name', 'Name is required').trim().not().isEmpty(),
    check('email', 'Please include a valid email').trim().isEmail(),
    check('password', 'Password must be at least 6 characters').trim().isLength({ min: 6 }),
    check('role', 'Role must be either user or admin').trim().isIn(['user', 'admin']), // Role validation
  ],
  async (req, res) => {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data
    const { name, email, password, role } = req.body; // Include role

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      // Create user with role
      user = new User({ name, email, password, role });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user
      await user.save();

      // Payload for JWT
      const payload = { user: { id: user.id, role: user.role } }; // Include role in JWT payload

      // Sign JWT
      jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token }); // Return token as a string
      });
    } catch (err) {
      console.error('Error in /auth/register:', err.message);
      res.status(500).send('Server error');
    }
  }
);

// Login Route
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').trim().isEmail(),
    check('password', 'Password is required').trim().exists(),
  ],
  async (req, res) => {
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data
    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Payload for JWT
      const payload = { user: { id: user.id, role: user.role } }; // Include role in JWT payload

      // Sign JWT
      jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token }); // Return token as a string
      });
    } catch (err) {
      console.error('Error in /auth/login:', err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
