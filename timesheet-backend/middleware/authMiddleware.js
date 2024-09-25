// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_hardcoded_jwt_secret_key'; // Must match the secret used in auth routes

module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.headers.authorization;

  // Check if no token
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Split the header to get the token
  const tokenParts = authHeader.split(' ');

  // Check token format
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token format is invalid' });
  }

  const token = tokenParts[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user; // Attach user payload to request
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
