const { User } = require('../models/User');
// const bcrypt = require('bcryptjs'); // Used in User model
const jwt = require('jsonwebtoken');
const { sendToken } = require('../utils/sendToken');
const { catchAsyncErrors } = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');

class AuthController {
  // Signup: Create a new user
  signup = catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }] });
      if (existingUser) {
        return next(new ErrorHandler('User already exit',400));
      }
      const user = new User({ email, password });
      await user.save();
      sendToken(user, 201, res)

    } catch (error) {
      next(error);
    }
  });

  // Login: Authenticate a user
  login = catchAsyncErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check if password matches
      const isPasswordValid = user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      sendToken(user, 200, res);
    } catch (error) {
      next(error);
    }
  });

  // Get current logged in user
  getCurrentUser = catchAsyncErrors(async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  });
}

module.exports = new AuthController();