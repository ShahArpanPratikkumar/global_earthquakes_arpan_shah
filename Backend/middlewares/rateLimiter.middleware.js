/**
 * @file rateLimiter.middleware.js
 * @description Rate limiting middleware using express-rate-limit. Limits 100 requests per 15 minutes.
 * @module middlewares/rateLimiter
 */

const rateLimit = require('express-rate-limit');

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
  });

// General API rate limiter: 100 requests per minute
const generalLimiter = createLimiter(
  60 * 1000,
  100,
  'Too many requests from this IP. Please try again after a minute.'
);

// Auth rate limiter: 10 requests per 15 minutes (brute-force prevention)
const authLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  'Too many authentication attempts. Please try again after 15 minutes.'
);

// Search rate limiter: 30 requests per minute
const searchLimiter = createLimiter(
  60 * 1000,
  30,
  'Too many search requests. Please slow down.'
);

// Admin rate limiter: 50 requests per minute
const adminLimiter = createLimiter(
  60 * 1000,
  50,
  'Too many admin requests from this IP.'
);

// Analytics rate limiter: 200 requests per minute (increased from 20 — React dev double-mount fires 8 simultaneous requests)
const analyticsLimiter = createLimiter(
  60 * 1000,
  200,
  'Analytics API rate limit reached. Please wait before making more requests.'
);

// Export rate limiter: 5 requests per minute
const exportLimiter = createLimiter(
  60 * 1000,
  5,
  'Export rate limit reached. Please wait a minute before exporting again.'
);

// Stats rate limiter: 30 requests per minute
const statsLimiter = createLimiter(
  60 * 1000,
  30,
  'Statistics API rate limit reached.'
);

module.exports = {
  generalLimiter,
  authLimiter,
  searchLimiter,
  adminLimiter,
  analyticsLimiter,
  exportLimiter,
  statsLimiter,
};