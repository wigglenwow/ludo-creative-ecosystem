const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Bring in your token protection shield middleware
// (This decodes the JWT token and verifies who is making the request)
const { protect } = require('../middleware/authMiddleware'); 

// =========================================================================
// 1. PUBLIC AUTHENTICATION ENDPOINTS
// =========================================================================
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// =========================================================================
// 2. PROTECTED USER ENDPOINTS (Requires valid Bearer Token headers)
// =========================================================================

// Verification check path to automatically handle user state persist on refresh
router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// The upgrade execution bridge that opens up the Dashboard submission panels
router.put('/upgrade-seller', protect, authController.upgradeToSeller);

module.exports = router;