const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authLimiter, generalLimiter } = require('../middlewares/rateLimiter.middleware');
const {
  validateRegister,
  validateLogin,
  validateChangePassword,
} = require('../middlewares/validate.middleware');

// Public routes with auth rate limiting
router.post('/register', authLimiter, validateRegister, ctrl.register);
router.post('/login', authLimiter, validateLogin, ctrl.login);
router.post('/forgot-password', authLimiter, ctrl.forgotPassword);
router.post('/reset-password', authLimiter, ctrl.resetPassword);
router.post('/verify-email', authLimiter, ctrl.verifyEmail);
router.post('/send-otp', authLimiter, ctrl.sendOtp);

// OPTIONS
router.options('/login', ctrl.optionsLogin);

// Protected routes (require JWT)
router.post('/logout', protect, ctrl.logout);
router.get('/profile', protect, ctrl.getProfile);
router.head('/profile', protect, ctrl.headProfile);
router.patch('/profile', protect, ctrl.updateProfile);
router.post('/change-password', protect, validateChangePassword, ctrl.changePassword);

module.exports = router;
