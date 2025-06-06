const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/ErrorHandler');
const { catchAsyncErrors } = require('./catchAsyncError');
const { User } = require('../models/User');

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies || req.headers.authorization;

    if (!token) {
        return next(new ErrorHandler("Login first to access this resource", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid token. Please log in again.", 401));
    }
});