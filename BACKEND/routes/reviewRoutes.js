const express = require('express');
const router = express.Router();
const { leaveReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, leaveReview);

module.exports = router;