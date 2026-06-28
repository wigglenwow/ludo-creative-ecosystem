const express = require('express');
const router = express.Router();
const { getSellerDashboard } = require('../controllers/analyticsController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, restrictTo('seller'), getSellerDashboard);

module.exports = router;