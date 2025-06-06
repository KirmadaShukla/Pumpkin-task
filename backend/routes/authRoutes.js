const express = require('express');
const router = express.Router();
const authController = require('../controllers/indexController');
const { isAuthenticated } = require('../middleware/auth');

// POST /api/auth/signup - Register a new user
router.post('/signup', authController.signup);

// POST /api/auth/login - Login a user
router.post('/login', authController.login);

// GET /api/auth/me - Get current logged in user
router.get('/me', isAuthenticated, authController.getCurrentUser);

module.exports = router;