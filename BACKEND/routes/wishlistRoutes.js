const express = require('express');
const router = express.Router();
const { toggleWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.post('/toggle', protect, toggleWishlist);

module.exports = router;