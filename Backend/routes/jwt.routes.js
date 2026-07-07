const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/jwt.controller');
const { protect } = require('../middlewares/auth.middleware');
const { generalLimiter } = require('../middlewares/rateLimiter.middleware');

router.use(generalLimiter);

// Public JWT operations
router.post('/generate-token', ctrl.generateToken);
router.post('/verify-token', ctrl.verifyToken);
router.post('/refresh-token', ctrl.refreshToken);

// Protected JWT operations
router.delete('/revoke-token', protect, ctrl.revokeToken);
router.get('/profile', protect, ctrl.getProfile);
router.get('/dashboard', protect, ctrl.getDashboard);
router.get('/private-earthquakes', protect, ctrl.getPrivateEarthquakes);
router.get('/private-analytics', protect, ctrl.getPrivateAnalytics);

// OPTIONS
router.options('/profile', ctrl.optionsProfile);

module.exports = router;
