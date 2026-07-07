/**
 * @file earthquake.controller.js
 * @description Express controller for earthquake CRUD endpoints. Handles list, detail, create, update, delete.
 * @module controllers/earthquake
 */

const asyncHandler = require('../utils/asyncHandler.util');
const {
  sendSuccess, sendCreated, sendNotFound, sendBadRequest, sendPaginated,
} = require('../utils/response.util');
const eqService = require('../services/earthquake.service');

// ─── CRUD ─────────────────────────────────────────────────────────────────────

exports.getAll = asyncHandler(async (req, res) => {
  const result = await eqService.getAllEarthquakes(req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Try MongoDB ObjectId first (from dashboard navigation using _id),
  // then fall back to the USGS string id field
  let eq = null;
  const mongoose = require('mongoose');
  if (mongoose.Types.ObjectId.isValid(id)) {
    eq = await eqService.getEarthquakeByMongoId(id);
  }
  if (!eq) {
    eq = await eqService.getEarthquakeById(id);
  }
  if (!eq) return sendNotFound(res, `Earthquake with ID '${id}' not found`);
  return sendSuccess(res, eq);
});

exports.create = asyncHandler(async (req, res) => {
  const eq = await eqService.createEarthquake(req.body);
  return sendCreated(res, eq, 'Earthquake record created successfully');
});

exports.replace = asyncHandler(async (req, res) => {
  const eq = await eqService.replaceEarthquake(req.params.id, req.body);
  if (!eq) return sendNotFound(res, `Earthquake with ID '${req.params.id}' not found`);
  return sendSuccess(res, eq, 'Earthquake record replaced successfully');
});

exports.update = asyncHandler(async (req, res) => {
  const eq = await eqService.updateEarthquake(req.params.id, req.body);
  if (!eq) return sendNotFound(res, `Earthquake with ID '${req.params.id}' not found`);
  return sendSuccess(res, eq, 'Earthquake record updated successfully');
});

exports.remove = asyncHandler(async (req, res) => {
  const eq = await eqService.deleteEarthquake(req.params.id);
  if (!eq) return sendNotFound(res, `Earthquake with ID '${req.params.id}' not found`);
  return sendSuccess(res, null, `Earthquake record '${req.params.id}' deleted successfully`);
});

exports.exists = asyncHandler(async (req, res) => {
  const exists = await eqService.checkExists(req.params.id);
  return sendSuccess(res, { exists, id: req.params.id });
});

// ─── BULK ─────────────────────────────────────────────────────────────────────

exports.bulkCreate = asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body)) return sendBadRequest(res, 'Request body must be an array of earthquake records');
  if (req.body.length === 0) return sendBadRequest(res, 'No records provided for bulk create');
  const result = await eqService.bulkCreate(req.body);
  return sendCreated(res, { inserted: result.length }, `${result.length} earthquake records created`);
});

exports.bulkUpdate = asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body)) return sendBadRequest(res, 'Request body must be an array of { id, data } objects');
  const result = await eqService.bulkUpdate(req.body);
  return sendSuccess(res, { modifiedCount: result.modifiedCount }, 'Bulk update completed');
});

exports.bulkDelete = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) return sendBadRequest(res, 'Request body must contain an array of ids');
  const result = await eqService.bulkDelete(ids);
  return sendSuccess(res, { deletedCount: result.modifiedCount }, `${result.modifiedCount} records deleted`);
});

// ─── INFORMATION ROUTES ───────────────────────────────────────────────────────

exports.getByPlace = asyncHandler(async (req, res) => {
  const result = await eqService.getByPlace(req.params.place, req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getByCountry = asyncHandler(async (req, res) => {
  const result = await eqService.getByCountry(req.params.country, req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getByType = asyncHandler(async (req, res) => {
  const result = await eqService.getByType(req.params.type, req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getByStatus = asyncHandler(async (req, res) => {
  const result = await eqService.getByStatus(req.params.status, req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getByMagType = asyncHandler(async (req, res) => {
  const result = await eqService.getByMagType(req.params.magType, req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getByNetwork = asyncHandler(async (req, res) => {
  const result = await eqService.getByNetwork(req.params.net, req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getHighMagnitude = asyncHandler(async (req, res) => {
  const result = await eqService.getHighMagnitude(req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getDeep = asyncHandler(async (req, res) => {
  const result = await eqService.getDeepEarthquakes(req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getShallow = asyncHandler(async (req, res) => {
  const result = await eqService.getShallowEarthquakes(req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getRecent = asyncHandler(async (req, res) => {
  const result = await eqService.getRecent(req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getReviewed = asyncHandler(async (req, res) => {
  const result = await eqService.getReviewed(req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getHighGap = asyncHandler(async (req, res) => {
  const result = await eqService.getHighGap(req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getHighRms = asyncHandler(async (req, res) => {
  const result = await eqService.getHighRms(req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getOceanic = asyncHandler(async (req, res) => {
  const result = await eqService.getOceanic(req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getCritical = asyncHandler(async (req, res) => {
  const result = await eqService.getCritical(req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

// ─── PARAMETER ROUTES ────────────────────────────────────────────────────────

exports.getByMagnitude = asyncHandler(async (req, res) => {
  const result = await eqService.getByMagnitude(req.params.mag, req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getByDepth = asyncHandler(async (req, res) => {
  const result = await eqService.getByDepth(req.params.depth, req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getByDate = asyncHandler(async (req, res) => {
  const result = await eqService.getByDate(req.params.date, req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getByYear = asyncHandler(async (req, res) => {
  const result = await eqService.getByYear(req.params.year, req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.getByMonth = asyncHandler(async (req, res) => {
  const result = await eqService.getByMonth(req.params.month, req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

// ─── SORT ROUTES ──────────────────────────────────────────────────────────────

exports.sortByMagnitudeDesc = asyncHandler(async (req, res) => {
  const result = await eqService.getSortedByMagnitudeDesc(req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

exports.sortByTimeDesc = asyncHandler(async (req, res) => {
  const result = await eqService.getSortedByTimeDesc(req.query);
  return sendPaginated(res, result.data, result.meta.total, result.meta.page, result.meta.limit);
});

// ─── RANDOM ───────────────────────────────────────────────────────────────────

exports.getRandom = asyncHandler(async (req, res) => {
  const eq = await eqService.getRandom();
  if (!eq) return sendNotFound(res, 'No earthquake records found');
  return sendSuccess(res, eq, 'Random earthquake record');
});

// ─── HEAD / OPTIONS ───────────────────────────────────────────────────────────

exports.headAll = asyncHandler(async (req, res) => {
  const count = await require('../models/Earthquake.model').countDocuments({ isDeleted: { $ne: true } });
  res.set('X-Total-Count', count.toString());
  res.set('X-Resource-Type', 'Earthquake');
  res.status(200).end();
});

exports.headById = asyncHandler(async (req, res) => {
  const exists = await eqService.checkExists(req.params.id);
  if (!exists) return res.status(404).end();
  res.set('X-Resource-Id', req.params.id);
  res.status(200).end();
});

exports.optionsAll = (req, res) => {
  res.set('Allow', 'GET, POST, HEAD, OPTIONS');
  res.set('Access-Control-Allow-Methods', 'GET, POST, HEAD, OPTIONS');
  return sendSuccess(res, {
    allowedMethods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
    endpoint: '/earthquakes',
    description: 'Earthquake collection endpoint',
  });
};

exports.optionsById = (req, res) => {
  res.set('Allow', 'GET, PUT, PATCH, DELETE, HEAD, OPTIONS');
  return sendSuccess(res, {
    allowedMethods: ['GET', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    endpoint: '/earthquakes/:id',
    description: 'Single earthquake resource endpoint',
  });
};

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────

exports.healthCheck = asyncHandler(async (req, res) => {
  const dbState = require('mongoose').connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  return sendSuccess(res, {
    status: 'ok',
    environment: process.env.NODE_ENV,
    database: states[dbState] || 'unknown',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }, 'API is healthy');
});