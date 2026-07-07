/**
 * @file jwt.controller.js
 * @description Express controller for JWT token refresh and verification endpoints.
 * @module controllers/jwt
 */

const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler.util');
const { sendSuccess, sendBadRequest, sendUnauthorized } = require('../utils/response.util');
const authService = require('../services/auth.service');
const eqService = require('../services/earthquake.service');
const analyticsService = require('../services/analytics.service');

exports.generateToken = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) return sendBadRequest(res, 'userId is required to generate a token');
  const accessToken = authService.generateAccessToken(userId);
  const refreshToken = authService.generateRefreshToken(userId);
  return sendSuccess(res, { accessToken, refreshToken, expiresIn: process.env.JWT_EXPIRES_IN }, 'Token generated successfully');
});

exports.verifyToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) return sendBadRequest(res, 'Token is required');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return sendSuccess(res, { valid: true, decoded }, 'Token is valid');
  } catch (err) {
    return sendSuccess(res, { valid: false, reason: err.message }, 'Token is invalid or expired');
  }
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return sendBadRequest(res, 'Refresh token is required');
  const result = await authService.refreshAccessToken(refreshToken);
  return sendSuccess(res, result, 'Access token refreshed successfully');
});

exports.revokeToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return sendBadRequest(res, 'Refresh token is required');
  await authService.revokeToken(req.user._id, refreshToken);
  return sendSuccess(res, null, 'Token revoked successfully');
});

exports.getProfile = asyncHandler(async (req, res) => {
  return sendSuccess(res, req.user.toPublicProfile ? req.user.toPublicProfile() : req.user, 'JWT protected profile');
});

exports.getDashboard = asyncHandler(async (req, res) => {
  const [total, highMag, recent] = await Promise.all([
    require('../services/stats.service').getTotalCount(),
    require('../services/stats.service').getHighestMagnitudeRecord(),
    require('../services/stats.service').getMonthlyCounts(),
  ]);
  return sendSuccess(res, {
    user: req.user.toPublicProfile ? req.user.toPublicProfile() : req.user,
    stats: { total, recentMonthlyTrend: recent.slice(0, 3), highestMagnitude: highMag },
  }, 'JWT protected dashboard');
});

exports.getPrivateEarthquakes = asyncHandler(async (req, res) => {
  const result = await eqService.getAllEarthquakes(req.query);
  return sendSuccess(res, result.data, 'Private earthquake records (JWT protected)', 200, result.meta);
});

exports.getPrivateAnalytics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getCountryAnalysis();
  return sendSuccess(res, data, 'Private analytics (JWT protected)');
});

// OPTIONS
exports.optionsProfile = (req, res) => {
  res.set('Allow', 'GET, OPTIONS');
  return sendSuccess(res, {
    allowedMethods: ['GET', 'OPTIONS'],
    endpoint: '/jwt/profile',
    description: 'JWT protected profile endpoint',
    requiresAuth: true,
  });
};