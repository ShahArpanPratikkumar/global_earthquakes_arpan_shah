/**
 * @file stats.controller.js
 * @description Express controller for earthquake statistical summary endpoints.
 * @module controllers/stats
 */

const asyncHandler = require('../utils/asyncHandler.util');
const { sendSuccess } = require('../utils/response.util');
const statsService = require('../services/stats.service');

exports.getCount = asyncHandler(async (req, res) => {
  const total = await statsService.getTotalCount();
  return sendSuccess(res, { total }, 'Total earthquake record count');
});

exports.getHighestMagnitude = asyncHandler(async (req, res) => {
  const data = await statsService.getHighestMagnitudeRecord();
  return sendSuccess(res, data, 'Highest magnitude earthquake record');
});

exports.getDeepest = asyncHandler(async (req, res) => {
  const data = await statsService.getDeepestRecord();
  return sendSuccess(res, data, 'Deepest earthquake record');
});

exports.getAverageDepth = asyncHandler(async (req, res) => {
  const data = await statsService.getAverageDepth();
  return sendSuccess(res, data, 'Average earthquake depth statistics');
});

exports.getAverageMagnitude = asyncHandler(async (req, res) => {
  const data = await statsService.getAverageMagnitude();
  return sendSuccess(res, data, 'Average earthquake magnitude statistics');
});

exports.getCountByCountry = asyncHandler(async (req, res) => {
  const data = await statsService.getCountByCountry();
  return sendSuccess(res, data, 'Earthquake count by country');
});

exports.getCountByType = asyncHandler(async (req, res) => {
  const data = await statsService.getCountByType();
  return sendSuccess(res, data, 'Earthquake count by type');
});

exports.getCountByNetwork = asyncHandler(async (req, res) => {
  const data = await statsService.getCountByNetwork();
  return sendSuccess(res, data, 'Earthquake count by seismic network');
});

exports.getReviewedCount = asyncHandler(async (req, res) => {
  const data = await statsService.getReviewedCount();
  return sendSuccess(res, data, 'Reviewed vs automatic earthquake counts');
});

exports.getMonthlyCount = asyncHandler(async (req, res) => {
  const data = await statsService.getMonthlyCounts();
  return sendSuccess(res, data, 'Monthly earthquake counts');
});

// HEAD handler
exports.headCount = asyncHandler(async (req, res) => {
  const total = await statsService.getTotalCount();
  res.set('X-Total-Count', total.toString());
  res.set('X-Resource-Type', 'EarthquakeStats');
  res.status(200).end();
});