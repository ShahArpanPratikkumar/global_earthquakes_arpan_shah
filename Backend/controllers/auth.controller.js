/**
 * @file auth.controller.js
 * @description Express controller for POST /register and POST /login authentication endpoints.
 * @module controllers/auth
 */

const asyncHandler = require('../utils/asyncHandler.util');
const { sendSuccess, sendCreated, sendUnauthorized, sendBadRequest } = require('../utils/response.util');
const authService = require('../services/auth.service');
const {
  validateRegister,
  validateLogin,
  validateChangePassword,
} = require('../middlewares/validate.middleware');

exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return sendCreated(res, result, 'User registered successfully');
});

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return sendSuccess(res, result, 'Login successful');
});

exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  await authService.logout(req.user._id, refreshToken);
  return sendSuccess(res, null, 'Logged out successfully');
});

exports.getProfile = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user._id);
  return sendSuccess(res, profile, 'User profile fetched successfully');
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const profile = await authService.updateProfile(req.user._id, req.body);
  return sendSuccess(res, profile, 'Profile updated successfully');
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return sendBadRequest(res, 'Email is required');
  const result = await authService.forgotPassword(email);
  return sendSuccess(res, result, 'Password reset link sent (check email in production)');
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return sendBadRequest(res, 'Token and new password are required');
  await authService.resetPassword(token, newPassword);
  return sendSuccess(res, null, 'Password reset successfully');
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user._id, currentPassword, newPassword);
  return sendSuccess(res, null, 'Password changed successfully');
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return sendBadRequest(res, 'Email and OTP are required');
  await authService.verifyEmail(email, otp);
  return sendSuccess(res, null, 'Email verified successfully');
});

exports.sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return sendBadRequest(res, 'Email is required');
  const result = await authService.sendOtp(email);
  return sendSuccess(res, result, 'OTP sent successfully');
});

// HEAD - verify session headers
exports.headProfile = asyncHandler(async (req, res) => {
  res.set('X-User-Id', req.user._id.toString());
  res.set('X-User-Role', req.user.role);
  res.status(200).end();
});

// OPTIONS - login endpoint
exports.optionsLogin = (req, res) => {
  res.set('Allow', 'POST, OPTIONS');
  return sendSuccess(res, {
    allowedMethods: ['POST', 'OPTIONS'],
    endpoint: '/auth/login',
    requiredFields: ['email', 'password'],
  });
};