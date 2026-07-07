/**
 * @file asyncHandler.util.js
 * @description Async route handler wrapper. Catches promise rejections and forwards to next(err).
 * @module utils/asyncHandler
 */

/**
 * Centralized Async Error Handler
 * Wraps async route handlers to eliminate repetitive try-catch blocks
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;