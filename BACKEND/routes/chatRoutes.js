const express = require('express');
const router = express.Router();
const { accessChat, getChatMessages, getUserChats, createMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// All chat operations require a verified logged-in user session token
router.post('/', protect, accessChat);
router.get('/', protect, getUserChats);
router.get('/:chatId/messages', protect, getChatMessages);

// 🛠️ NEW PATHWAY: Registers individual text bubble payload posts
router.post('/:chatId/messages', protect, createMessage);

module.exports = router;