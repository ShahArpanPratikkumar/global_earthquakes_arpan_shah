const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/search.controller');
const { searchLimiter } = require('../middlewares/rateLimiter.middleware');
const { validatePagination } = require('../middlewares/validate.middleware');

router.use(searchLimiter);

router.get('/earthquakes', validatePagination, ctrl.search);
router.options('/earthquakes', ctrl.optionsSearch);

module.exports = router;
