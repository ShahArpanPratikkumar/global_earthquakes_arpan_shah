const jwt = require('jsonwebtoken');
const { sendUnauthorized, sendForbidden } = require('../utils/response.util');
const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler.util');

// Fail-fast: ensure JWT_SECRET is configured at startup
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET environment variable is not set. Authentication will fail.');
  process.exit(1);
}

/**
 * JWT Authentication Middleware
 * Verifies JWT token from Authorization header and attaches user to req
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer scheme)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendUnauthorized(res, 'No token provided. Please login to access this resource.');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database (exclude password)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendUnauthorized(res, 'User associated with this token no longer exists.');
    }

    if (!user.isActive) {
      return sendForbidden(res, 'Your account has been deactivated.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendUnauthorized(res, 'Token has expired. Please login again.');
    }
    if (error.name === 'JsonWebTokenError') {
      return sendUnauthorized(res, 'Invalid token. Please login again.');
    }
    return sendUnauthorized(res, 'Token verification failed.');
  }
});

/**
 * Optional Auth Middleware
 * Attaches user if token exists but doesn't block if missing
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      req.user = null;
    }
  }
  next();
});

/**
 * Admin Role Guard Middleware
 * Must be used AFTER protect middleware
 * Blocks access if the authenticated user is not an admin
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return sendForbidden(res, 'Admin access required. You do not have permission to perform this action.');
};

module.exports = { protect, optionalAuth, isAdmin };
