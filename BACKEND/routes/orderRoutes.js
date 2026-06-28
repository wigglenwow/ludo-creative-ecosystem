const express = require('express');
const router = express.Router();

// Destructure the logic functions directly from the controller file
const { createOrder, getUserOrders } = require('../controllers/orderController');

// Import authentication security shield
const { protect } = require('../middleware/authMiddleware');

// Link endpoints securely to functions
router.post('/checkout', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);

module.exports = router;