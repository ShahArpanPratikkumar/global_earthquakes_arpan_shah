const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/admin.middleware');
const { adminLimiter } = require('../middlewares/rateLimiter.middleware');
const asyncHandler = require('../utils/asyncHandler.util');
const { sendSuccess, sendUnauthorized } = require('../utils/response.util');
const eqService = require('../services/earthquake.service');
const analyticsService = require('../services/analytics.service');
const statsService = require('../services/stats.service');

// Apply rate limiting and auth to all admin routes
router.use(adminLimiter);
router.use(protect);
router.use(adminOnly);

// Admin earthquake management
router.get('/earthquakes', asyncHandler(async (req, res) => {
  const result = await eqService.getAllEarthquakes({ ...req.query, includeSoftDeleted: true });
  return res.status(200).json({
    success: true,
    message: 'Admin: All earthquake records (including soft deleted)',
    data: result.data,
    meta: result.meta,
  });
}));

// Admin analytics dashboard
router.get('/analytics', asyncHandler(async (req, res) => {
  const [country, network, magnitude, depth] = await Promise.all([
    analyticsService.getCountryAnalysis(),
    analyticsService.getNetworkAnalysis(),
    analyticsService.getMagnitudeAnalysis(),
    analyticsService.getDepthAnalysis(),
  ]);
  return sendSuccess(res, { country, network, magnitude, depth }, 'Admin analytics dashboard');
}));

// Admin reports
router.get('/reports', asyncHandler(async (req, res) => {
  const [total, avgMag, avgDepth, reviewed, monthly] = await Promise.all([
    statsService.getTotalCount(),
    statsService.getAverageMagnitude(),
    statsService.getAverageDepth(),
    statsService.getReviewedCount(),
    statsService.getMonthlyCounts(),
  ]);
  return sendSuccess(res, {
    summary: { total, avgMag, avgDepth, reviewed },
    monthlyTrend: monthly,
  }, 'Admin comprehensive report');
}));

// Admin dashboard
router.get('/dashboard', asyncHandler(async (req, res) => {
  const [total, highMag, recent] = await Promise.all([
    statsService.getTotalCount(),
    statsService.getHighestMagnitudeRecord(),
    statsService.getMonthlyCounts(),
  ]);
  return sendSuccess(res, { total, highestMagnitude: highMag, recentTrend: recent }, 'Admin dashboard');
}));

// HEAD for admin
router.head('/earthquakes', asyncHandler(async (req, res) => {
  const count = await statsService.getTotalCount();
  res.set('X-Total-Count', count.toString());
  res.set('X-Admin-Access', 'true');
  res.status(200).end();
}));

// OPTIONS for admin
router.options('/earthquakes', (req, res) => {
  res.set('Allow', 'GET, HEAD, OPTIONS');
  return sendSuccess(res, { allowedMethods: ['GET', 'HEAD', 'OPTIONS'], requiresAuth: true, requiresRole: 'admin' });
});

module.exports = router;
