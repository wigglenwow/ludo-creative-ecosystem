const jwt = require('jsonwebtoken');
const User = require('../models/User');

// MIDDLEWARE 1: Verify if the user is logged in at all (Authentication)
exports.protect = async (req, res, next) => {
  let token;

  // Check if the request contains a Bearer token in the headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from string "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify the token using your secret vault key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from Atlas using the ID embedded in the token (excluding password)
      req.user = await User.findById(decoded.id).select('-passwordHash');
      
      // Pass the request to the next block of logic
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token verification failed." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided." });
  }
};

// MIDDLEWARE 2: Restrict access based on specific roles (Authorization)
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is part of the permitted roles array
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: Your current role (${req.user.role}) does not have permission to perform this action.` 
      });
    }
    next();
  };
};