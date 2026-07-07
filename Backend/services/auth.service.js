const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User.model');

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
};

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw Object.assign(new Error('User with this email already exists'), { statusCode: 409 });
  }

  const user = await User.create({ name, email, password });
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token
  user.refreshTokens = [refreshToken];
  await user.save({ validateBeforeSave: false });

  return { user: user.toPublicProfile(), accessToken, refreshToken };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password +refreshTokens');
  if (!user) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  }

  if (!user.isActive) {
    throw Object.assign(new Error('Your account has been deactivated'), { statusCode: 403 });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokens = [...(user.refreshTokens || []).slice(-4), refreshToken]; // Keep last 5
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return { user: user.toPublicProfile(), accessToken, refreshToken };
};

const logout = async (userId, refreshToken) => {
  const user = await User.findById(userId).select('+refreshTokens');
  if (user) {
    user.refreshTokens = (user.refreshTokens || []).filter((t) => t !== refreshToken);
    await user.save({ validateBeforeSave: false });
  }
  return true;
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  return user.toPublicProfile();
};

const updateProfile = async (userId, updates) => {
  const allowedFields = ['name'];
  const filtered = {};
  allowedFields.forEach((f) => { if (updates[f] !== undefined) filtered[f] = updates[f]; });

  const user = await User.findByIdAndUpdate(userId, filtered, { new: true, runValidators: true });
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  return user.toPublicProfile();
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw Object.assign(new Error('Current password is incorrect'), { statusCode: 400 });

  user.password = newPassword;
  await user.save();
  return true;
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw Object.assign(new Error('No user found with this email'), { statusCode: 404 });

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save({ validateBeforeSave: false });

  // In production, send email. For now, return token for demo purposes.
  return { resetToken, message: 'Password reset token generated (send via email in production)' };
};

const resetPassword = async (resetToken, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) throw Object.assign(new Error('Invalid or expired reset token'), { statusCode: 400 });

  user.password = newPassword;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();
  return true;
};

const sendOtp = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw Object.assign(new Error('No user found with this email'), { statusCode: 404 });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await user.save({ validateBeforeSave: false });

  // In production, send OTP via email/SMS
  return { otp, message: 'OTP generated (send via email/SMS in production)' };
};

const verifyEmail = async (email, otp) => {
  const user = await User.findOne({ email }).select('+otp +otpExpires');
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  if (!user.otp || user.otp !== otp) throw Object.assign(new Error('Invalid OTP'), { statusCode: 400 });
  if (user.otpExpires < new Date()) throw Object.assign(new Error('OTP has expired'), { statusCode: 400 });

  user.isVerified = true;
  user.otp = null;
  user.otpExpires = null;
  await user.save({ validateBeforeSave: false });
  return true;
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshTokens');
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw Object.assign(new Error('Invalid refresh token'), { statusCode: 401 });
    }
    const newAccessToken = generateAccessToken(user._id);
    return { accessToken: newAccessToken };
  } catch (error) {
    throw Object.assign(new Error('Invalid or expired refresh token'), { statusCode: 401 });
  }
};

const revokeToken = async (userId, refreshToken) => {
  const user = await User.findById(userId).select('+refreshTokens');
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  user.refreshTokens = (user.refreshTokens || []).filter((t) => t !== refreshToken);
  await user.save({ validateBeforeSave: false });
  return true;
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  sendOtp,
  verifyEmail,
  generateAccessToken,
  generateRefreshToken,
  refreshAccessToken,
  revokeToken,
};
