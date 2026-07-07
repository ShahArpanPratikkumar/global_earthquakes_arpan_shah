const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/earthquake.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validateCreateEarthquake, validateUpdateEarthquake, validatePagination } = require('../middlewares/validate.middleware');
const { generalLimiter } = require('../middlewares/rateLimiter.middleware');

// Apply general rate limiter to all earthquake routes
router.use(generalLimiter);

// ─── HEAD / OPTIONS (must be before parameterized routes) ────────────────────
router.head('/', ctrl.headAll);
router.options('/', ctrl.optionsAll);
router.options('/:id', ctrl.optionsById);

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
router.get('/system/health', ctrl.healthCheck);
router.head('/system/health', ctrl.healthCheck);
router.options('/system/health', (req, res) => {
  res.set('Allow', 'GET, HEAD, OPTIONS');
  res.status(200).json({ allowedMethods: ['GET', 'HEAD', 'OPTIONS'] });
});

// ─── SORT ROUTES (must come before /:id to avoid conflicts) ──────────────────
router.get('/sort/magnitude-desc', validatePagination, ctrl.sortByMagnitudeDesc);
router.get('/sort/time-desc', validatePagination, ctrl.sortByTimeDesc);

// ─── BULK OPERATIONS ──────────────────────────────────────────────────────────
router.post('/bulk-create', validateCreateEarthquake, ctrl.bulkCreate);
router.patch('/bulk-update', ctrl.bulkUpdate);
router.delete('/bulk-delete', ctrl.bulkDelete);

// ─── INFORMATION / FILTER ROUTES (static paths before /:id) ──────────────────
router.get('/high-magnitude', validatePagination, ctrl.getHighMagnitude);
router.get('/deep', validatePagination, ctrl.getDeep);
router.get('/shallow', validatePagination, ctrl.getShallow);
router.get('/recent', validatePagination, ctrl.getRecent);
router.get('/reviewed', validatePagination, ctrl.getReviewed);
router.get('/high-gap', validatePagination, ctrl.getHighGap);
router.get('/high-rms', validatePagination, ctrl.getHighRms);
router.get('/oceanic', validatePagination, ctrl.getOceanic);
router.get('/critical', validatePagination, ctrl.getCritical);
router.get('/random', ctrl.getRandom);

// ─── FILTER ROUTES (under /filter prefix) ─────────────────────────────────────
router.get('/filter/high-magnitude', validatePagination, ctrl.getHighMagnitude);
router.get('/filter/low-magnitude', validatePagination, async (req, res) => {
  req.query.maxMagnitude = '2.5';
  return ctrl.getAll(req, res);
});
router.get('/filter/deep', validatePagination, ctrl.getDeep);
router.get('/filter/shallow', validatePagination, ctrl.getShallow);
router.get('/filter/high-gap', validatePagination, ctrl.getHighGap);
router.get('/filter/high-rms', validatePagination, ctrl.getHighRms);
router.get('/filter/reviewed', validatePagination, ctrl.getReviewed);
router.get('/filter/oceanic', validatePagination, ctrl.getOceanic);
router.get('/filter/recent', validatePagination, ctrl.getRecent);
router.get('/filter/critical', validatePagination, ctrl.getCritical);

// ─── PARAMETERIZED INFORMATION ROUTES ────────────────────────────────────────
router.get('/place/:place', validatePagination, ctrl.getByPlace);
router.get('/country/:country', validatePagination, ctrl.getByCountry);
router.head('/country/:country', async (req, res) => {
  const Earthquake = require('../models/Earthquake.model');
  const count = await Earthquake.countDocuments({
    place: { $regex: req.params.country, $options: 'i' },
    isDeleted: { $ne: true },
  });
  res.set('X-Total-Count', count.toString());
  res.status(200).end();
});
router.get('/type/:type', validatePagination, ctrl.getByType);
router.get('/status/:status', validatePagination, ctrl.getByStatus);
router.get('/mag-type/:magType', validatePagination, ctrl.getByMagType);
router.get('/network/:net', validatePagination, ctrl.getByNetwork);
router.get('/magnitude/:mag', validatePagination, ctrl.getByMagnitude);
router.get('/depth/:depth', validatePagination, ctrl.getByDepth);
router.get('/date/:date', validatePagination, ctrl.getByDate);
router.get('/year/:year', validatePagination, ctrl.getByYear);
router.get('/month/:month', validatePagination, ctrl.getByMonth);

// ─── EXISTS CHECK ──────────────────────────────────────────────────────────────
router.get('/exists/:id', ctrl.exists);

// ─── MAIN CRUD ROUTES ─────────────────────────────────────────────────────────
router.get('/', validatePagination, ctrl.getAll);
router.post('/', validateCreateEarthquake, ctrl.create);

// ─── SINGLE RECORD ROUTES (/:id - must be last) ───────────────────────────────
router.get('/:id', ctrl.getById);
router.head('/:id', ctrl.headById);
router.put('/:id', validateCreateEarthquake, ctrl.replace);
router.patch('/:id', validateUpdateEarthquake, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
