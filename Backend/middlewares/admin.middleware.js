const { sendForbidden } = require('../utils/response.util');

/**
 * Admin Role Middleware
 * Must be used AFTER protect middleware
 * Restricts access to admin-only routes
 */
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return sendForbidden(res, 'Access denied. Authentication required.');
  }

  if (req.user.role !== 'admin') {
    return sendForbidden(res, 'Access denied. Admin privileges required.');
  }

  next();
};

/**
 * Role-Based Access Control Middleware
 * Accepts multiple allowed roles
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendForbidden(res, 'Access denied. Authentication required.');
    }

    if (!roles.includes(req.user.role)) {
      return sendForbidden(
        res,
        `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`
      );
    }

    next();
  };
};

module.exports = { adminOnly, authorizeRoles };
