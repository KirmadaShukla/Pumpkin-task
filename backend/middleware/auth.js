const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/ErrorHandler');
const { catchAsyncErrors } = require('./catchAsyncError');
const { User } = require('../models/User');

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    let token;

    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    
    console.log("token",token)
    if (!token) {
        return next(new ErrorHandler("Login first to access this resource", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded",decoded)
        req.id = decoded.id;
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid token. Please log in again.", 401));
    }
});