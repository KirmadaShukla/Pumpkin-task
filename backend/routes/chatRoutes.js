const express = require('express');
const router = express.Router();
const chatController = require('../controllers/charController');
const { isAuthenticated } = require('../middleware/auth');

// POST /api/chat/search - Search users by email or mobile
router.post('/search', isAuthenticated, chatController.searchUser);

// GET /api/chat/messages - Fetch offline messages for the authenticated user
router.get('/messages', isAuthenticated, chatController.getOfflineMessages);

module.exports = router;