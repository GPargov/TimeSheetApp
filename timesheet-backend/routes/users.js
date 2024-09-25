// routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// @route   POST /users/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').trim().not().isEmpty(),
    check('email', 'Please include a valid email').trim().isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).trim().isLength({ min: 6 }),
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract user data from request body
    const { name, email, password } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Create new user instance
      user = new User({
        name,
        email,
        password,
      });

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save the user to the database
      await user.save();

      // Return JSON Web Token (JWT)
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        'your_jwt_secret', // Replace with your JWT secret
        { expiresIn: 360000 }, // Optional: Adjust the expiration time
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('Error in /users/register:', err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET /users/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // Ensure the user is authorized to access this profile
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error in /users/:id:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
