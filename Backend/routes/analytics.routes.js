const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/analytics.controller');
const { protect } = require('../middlewares/auth.middleware');
const { analyticsLimiter } = require('../middlewares/rateLimiter.middleware');

router.use(analyticsLimiter);

router.get('/highest-magnitude', ctrl.getHighestMagnitude);
router.head('/highest-magnitude', ctrl.headHighestMagnitude);
router.get('/deepest', ctrl.getDeepest);
router.get('/recent-activity', ctrl.getRecentActivity);
router.get('/location-analysis', ctrl.getLocationAnalysis);
router.get('/country-analysis', ctrl.getCountryAnalysis);
router.get('/network-analysis', ctrl.getNetworkAnalysis);
router.get('/magnitude-analysis', ctrl.getMagnitudeAnalysis);
router.get('/depth-analysis', ctrl.getDepthAnalysis);
router.get('/error-analysis', ctrl.getErrorAnalysis);
router.get('/monthly-analysis', ctrl.getMonthlyAnalysis);

// Specific requested endpoints
router.get('/', ctrl.getAnalyticsRoot);
router.get('/dashboard', ctrl.getAnalyticsDashboard);
router.get('/overview', ctrl.getAnalyticsOverview);
router.get('/stats', ctrl.getAnalyticsStats);

module.exports = router;
