const asyncHandler = require('../utils/asyncHandler.util');
const { sendSuccess } = require('../utils/response.util');
const analyticsService = require('../services/analytics.service');
const statsService = require('../services/stats.service');

exports.getAnalyticsRoot = asyncHandler(async (req, res) => {
  const totalCount = await statsService.getTotalCount();
  const avgMag = await statsService.getAverageMagnitude();
  const avgDepth = await statsService.getAverageDepth();
  return sendSuccess(res, {
    totalCount,
    avgMagnitude: avgMag.avgMagnitude || 0,
    avgDepth: avgDepth.avgDepth || 0,
    message: "Welcome to Earthquake Analytics API. Explore /dashboard, /overview, /stats for detailed reports."
  }, 'Analytics Root Overview');
});

exports.getAnalyticsDashboard = asyncHandler(async (req, res) => {
  const [totalCount, avgMag, avgDepth, highestMag, deepest] = await Promise.all([
    statsService.getTotalCount(),
    statsService.getAverageMagnitude(),
    statsService.getAverageDepth(),
    statsService.getHighestMagnitudeRecord(),
    statsService.getDeepestRecord(),
  ]);

  return sendSuccess(res, {
    totalCount,
    avgMagnitude: avgMag.avgMagnitude || 0,
    avgDepth: avgDepth.avgDepth || 0,
    highestMagnitude: highestMag ? { id: highestMag.id, place: highestMag.place, mag: highestMag.mag, time: highestMag.time } : null,
    deepestRecord: deepest ? { id: deepest.id, place: deepest.place, depth: deepest.depth, time: deepest.time } : null,
  }, 'Dashboard Analytics fetched successfully');
});

exports.getAnalyticsOverview = asyncHandler(async (req, res) => {
  const [totalCount, avgMag, avgDepth, countryCount, typeCount] = await Promise.all([
    statsService.getTotalCount(),
    statsService.getAverageMagnitude(),
    statsService.getAverageDepth(),
    statsService.getCountByCountry(),
    statsService.getCountByType(),
  ]);

  return sendSuccess(res, {
    totalRecords: totalCount,
    avgMagnitude: avgMag.avgMagnitude || 0,
    avgDepth: avgDepth.avgDepth || 0,
    minMagnitude: avgMag.minMagnitude || 0,
    maxMagnitude: avgMag.maxMagnitude || 0,
    minDepth: avgDepth.minDepth || 0,
    maxDepth: avgDepth.maxDepth || 0,
    regionsCount: countryCount.length,
    typesCount: typeCount.length,
    countriesDistribution: countryCount.slice(0, 10),
  }, 'Overview Analytics fetched successfully');
});

exports.getAnalyticsStats = asyncHandler(async (req, res) => {
  const [totalCount, avgMag, avgDepth, networkCount, reviewedCount] = await Promise.all([
    statsService.getTotalCount(),
    statsService.getAverageMagnitude(),
    statsService.getAverageDepth(),
    statsService.getCountByNetwork(),
    statsService.getReviewedCount(),
  ]);

  return sendSuccess(res, {
    totalCount,
    avgMagnitude: avgMag.avgMagnitude || 0,
    avgDepth: avgDepth.avgDepth || 0,
    networksCount: networkCount.length,
    reviewedCount,
    networksDistribution: networkCount,
  }, 'Stats Analytics fetched successfully');
});


exports.getHighestMagnitude = asyncHandler(async (req, res) => {
  const data = await analyticsService.getHighestMagnitude();
  return sendSuccess(res, data, 'Top 10 highest magnitude earthquakes');
});

exports.getDeepest = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDeepestEarthquakes();
  return sendSuccess(res, data, 'Top 10 deepest earthquakes');
});

exports.getRecentActivity = asyncHandler(async (req, res) => {
  const { country } = req.query;
  const data = await analyticsService.getRecentActivity(country);
  return sendSuccess(res, data, 'Daily earthquake activity for the last 90 days');
});

exports.getLocationAnalysis = asyncHandler(async (req, res) => {
  const data = await analyticsService.getLocationAnalysis();
  return sendSuccess(res, data, 'Earthquake location analysis (top 20 locations)');
});

exports.getCountryAnalysis = asyncHandler(async (req, res) => {
  const data = await analyticsService.getCountryAnalysis();
  return sendSuccess(res, data, 'Country-wise earthquake distribution');
});

exports.getNetworkAnalysis = asyncHandler(async (req, res) => {
  const data = await analyticsService.getNetworkAnalysis();
  return sendSuccess(res, data, 'Seismic network distribution analysis');
});

exports.getMagnitudeAnalysis = asyncHandler(async (req, res) => {
  const data = await analyticsService.getMagnitudeAnalysis();
  return sendSuccess(res, data, 'Magnitude distribution analysis');
});

exports.getDepthAnalysis = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDepthAnalysis();
  return sendSuccess(res, data, 'Depth distribution analysis');
});

exports.getErrorAnalysis = asyncHandler(async (req, res) => {
  const data = await analyticsService.getErrorAnalysis();
  return sendSuccess(res, data[0] || {}, 'Earthquake error values analysis');
});

exports.getMonthlyAnalysis = asyncHandler(async (req, res) => {
  const data = await analyticsService.getMonthlyAnalysis();
  return sendSuccess(res, data, 'Monthly earthquake trend analysis');
});

// HEAD handler for analytics
exports.headHighestMagnitude = asyncHandler(async (req, res) => {
  res.set('X-Resource-Type', 'Analytics');
  res.set('X-Endpoint', '/analytics/earthquakes/highest-magnitude');
  res.status(200).end();
});
