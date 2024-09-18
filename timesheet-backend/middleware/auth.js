const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const tokenPart = token.split(' ')[1]; // Split the Bearer token and get the token part
    const decoded = jwt.verify(tokenPart, 'secret');
    req.user = decoded; // Attach the decoded user information to the request object
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
