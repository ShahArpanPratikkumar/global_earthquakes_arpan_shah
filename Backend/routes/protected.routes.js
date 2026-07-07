const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const { validateCreateEarthquake, validateUpdateEarthquake } = require('../middlewares/validate.middleware');
const asyncHandler = require('../utils/asyncHandler.util');
const { sendSuccess, sendNotFound, sendCreated } = require('../utils/response.util');
const eqService = require('../services/earthquake.service');

// All protected routes require JWT auth
router.use(protect);

// Protected add earthquake record
router.post('/earthquakes', validateCreateEarthquake, asyncHandler(async (req, res) => {
  const eq = await eqService.createEarthquake(req.body);
  return sendCreated(res, eq, 'Protected: Earthquake created');
}));

// Protected update earthquake record
router.patch('/earthquakes/:id', validateUpdateEarthquake, asyncHandler(async (req, res) => {
  const eq = await eqService.updateEarthquake(req.params.id, req.body);
  if (!eq) return sendNotFound(res, `Earthquake '${req.params.id}' not found`);
  return sendSuccess(res, eq, 'Protected: Earthquake updated');
}));

// Protected delete earthquake record
router.delete('/earthquakes/:id', asyncHandler(async (req, res) => {
  const eq = await eqService.deleteEarthquake(req.params.id);
  if (!eq) return sendNotFound(res, `Earthquake '${req.params.id}' not found`);
  return sendSuccess(res, null, 'Protected: Earthquake deleted');
}));

module.exports = router;
