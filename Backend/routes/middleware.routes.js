/**
 * @file middleware.routes.js
 * @description Express router for middleware demonstration and testing endpoints.
 *              Used to test logger, auth, rate limiter, error handler, and cache middlewares.
 * @module routes/middleware
 */

const express = require('express');
const router = express.Router();
const { sendSuccess } = require('../utils/response.util');

// Middleware Logger Demo
router.get('/logger', (req, res) => {
  return sendSuccess(res, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    timestamp: new Date().toISOString(),
    headers: req.headers,
    message: 'Logger middleware is active on every request (check your console)',
  }, 'Logger middleware demonstration');
});

// Auth Middleware Demo
router.get('/auth', (req, res) => {
  const authHeader = req.headers.authorization;
  return sendSuccess(res, {
    hasAuthHeader: !!authHeader,
    authHeaderPresent: authHeader ? 'Bearer token detected' : 'No Authorization header found',
    tip: 'Send a Bearer token in the Authorization header to test auth middleware',
  }, 'Auth middleware demonstration');
});

// Rate Limiting Middleware Demo
router.get('/rate-limit', (req, res) => {
  return sendSuccess(res, {
    message: 'You have not been rate limited yet',
    tip: 'Make more than 100 requests per minute to trigger the rate limiter',
    headers: {
      'X-RateLimit-Limit': res.getHeader('X-RateLimit-Limit'),
      'X-RateLimit-Remaining': res.getHeader('X-RateLimit-Remaining'),
    },
  }, 'Rate limiter middleware demonstration');
});

// Error Handler Demo
router.get('/error-handler', (req, res, next) => {
  const err = new Error('This is a deliberately triggered test error');
  err.statusCode = 500;
  next(err); // Pass to global error handler
});

// Request Time Demo
router.get('/request-time', (req, res) => {
  return sendSuccess(res, {
    requestTime: req.requestTime,
    tip: 'Check the X-Response-Time header in the response for processing duration',
    responseTimeHeader: res.getHeader('X-Response-Time') || 'Will be set on response finish',
  }, 'Request timing middleware demonstration');
});

// Cache Demo (simple in-memory demonstration)
const cache = new Map();
router.get('/cache', (req, res) => {
  const cacheKey = 'demo_cache';
  if (cache.has(cacheKey)) {
    return sendSuccess(res, {
      source: 'cache',
      data: cache.get(cacheKey),
      tip: 'This response came from in-memory cache',
    }, 'Cache middleware demonstration (HIT)');
  }
  const data = { generatedAt: new Date().toISOString(), randomValue: Math.random() };
  cache.set(cacheKey, data);
  setTimeout(() => cache.delete(cacheKey), 30000); // Clear after 30 seconds
  return sendSuccess(res, {
    source: 'database',
    data,
    tip: 'This response was freshly generated. Hit again within 30s to see cache.',
  }, 'Cache middleware demonstration (MISS)');
});

module.exports = router;
