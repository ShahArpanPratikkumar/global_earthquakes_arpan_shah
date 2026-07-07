const asyncHandler = require('../utils/asyncHandler.util');
const { sendSuccess, sendBadRequest } = require('../utils/response.util');
const Earthquake = require('../models/Earthquake.model');
const { paginate } = require('../utils/pagination.util');

/**
 * Full-text and regex-based search across earthquake records
 * GET /search/earthquakes?q=japan
 */
exports.search = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;

  if (!q || q.trim() === '') {
    return sendBadRequest(res, 'Search query (q) is required and cannot be empty');
  }

  const searchTerm = q.trim();

  // Map special keywords to field-specific filters
  const specialKeywords = {
    'deep': { depth: { $gte: 300 } },
    'shallow': { depth: { $lt: 70 } },
    'critical': { mag: { $gte: 7.0 }, depth: { $lt: 70 } },
    'high-magnitude': { mag: { $gte: 6.0 } },
    'reviewed': { status: 'reviewed' },
    'automatic': { status: 'automatic' },
    'gap': { gap: { $gte: 180 } },
  };

  let filter;

  if (specialKeywords[searchTerm.toLowerCase()]) {
    filter = specialKeywords[searchTerm.toLowerCase()];
  } else {
    // Regex search across place, type, status, net, magType fields
    const regex = { $regex: searchTerm, $options: 'i' };
    filter = {
      $or: [
        { place: regex },
        { type: regex },
        { status: regex },
        { net: regex },
        { magType: regex },
        { id: regex },
      ],
    };
  }

  const result = await paginate(Earthquake, filter, {
    page,
    limit,
    sort: { time: -1 },
  });

  return res.status(200).json({
    success: true,
    message: `Search results for "${searchTerm}"`,
    query: searchTerm,
    data: result.data,
    meta: result.meta,
  });
});

// OPTIONS handler for search
exports.optionsSearch = (req, res) => {
  res.set('Allow', 'GET, OPTIONS');
  return sendSuccess(res, {
    allowedMethods: ['GET', 'OPTIONS'],
    endpoint: '/search/earthquakes',
    queryParams: ['q (required)', 'page', 'limit'],
    description: 'Keyword search across earthquake records',
  });
};
