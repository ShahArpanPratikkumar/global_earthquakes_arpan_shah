/**
 * Reusable Pagination Utility
 * Handles page/limit extraction and returns paginated results with metadata
 */
const paginate = async (model, filter = {}, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = { time: -1 },
    projection = {},
    populate = null,
  } = options;

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  // Always exclude soft-deleted records unless the filter explicitly requests them
  const safeFilter = { isDeleted: { $ne: true }, ...filter };

  const [data, total] = await Promise.all([
    model.find(safeFilter, projection).sort(sort).skip(skip).limit(limitNum),
    model.countDocuments(safeFilter),
  ]);

  const totalPages = Math.ceil(total / limitNum);

  return {
    data,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };
};

/**
 * Extract pagination params from query string
 */
const getPaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  return { page: Math.max(1, page), limit: Math.min(100, Math.max(1, limit)) };
};

/**
 * Build sort object from sort query param
 */
const getSortObject = (sortParam, order = 'asc') => {
  const sortMap = {
    magnitude: { mag: order === 'desc' ? -1 : 1 },
    depth: { depth: order === 'desc' ? -1 : 1 },
    time: { time: order === 'desc' ? -1 : 1 },
    gap: { gap: order === 'desc' ? -1 : 1 },
    rms: { rms: order === 'desc' ? -1 : 1 },
    horizontalError: { horizontalError: order === 'desc' ? -1 : 1 },
    depthError: { depthError: order === 'desc' ? -1 : 1 },
    place: { place: order === 'desc' ? -1 : 1 },
  };
  return sortMap[sortParam] || { time: -1 };
};

module.exports = { paginate, getPaginationParams, getSortObject };
