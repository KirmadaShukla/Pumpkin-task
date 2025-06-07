const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { isAuthenticated } = require('../middleware/auth');

// GET /api/chat/messages/:otherUserId - Fetch messages with a specific user
router.get('/messages/:otherUserId', isAuthenticated, chatController.getMessages);

// POST /api/chat/search - Search users by email or mobile
router.post('/search', isAuthenticated, chatController.searchUser);

// GET /api/chat/users - Get all users
router.get('/users', isAuthenticated, chatController.getUsers);

module.exports = router;