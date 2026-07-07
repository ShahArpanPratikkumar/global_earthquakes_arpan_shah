/**
 * @file stats.routes.js
 * @description Express router for earthquake statistics summary endpoints.
 * @module routes/stats
 */

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/stats.controller');
const { statsLimiter } = require('../middlewares/rateLimiter.middleware');

router.use(statsLimiter);

router.get('/count', ctrl.getCount);
router.head('/count', ctrl.headCount);
router.get('/highest-magnitude', ctrl.getHighestMagnitude);
router.get('/deepest', ctrl.getDeepest);
router.get('/average-depth', ctrl.getAverageDepth);
router.get('/average-magnitude', ctrl.getAverageMagnitude);
router.get('/country-count', ctrl.getCountByCountry);
router.get('/type-count', ctrl.getCountByType);
router.get('/network-count', ctrl.getCountByNetwork);
router.get('/reviewed-count', ctrl.getReviewedCount);
router.get('/monthly-count', ctrl.getMonthlyCount);

module.exports = router;