/**
 * @file filterBuilder.util.js
 * @description Constructs MongoDB filter objects from Express request query parameters.
 * @module utils/filterBuilder
 */

/**
 * Dynamic Filter Builder Utility
 * Builds MongoDB filter objects dynamically from query parameters
 */
const buildFilter = (query) => {
  const filter = {};

  // Country filter (extracted from 'place' field)
  if (query.country) {
    filter.place = { $regex: query.country, $options: 'i' };
  }

  // Place filter
  if (query.place) {
    filter.place = { $regex: query.place, $options: 'i' };
  }

  // Status filter
  if (query.status) {
    const validStatuses = ['automatic', 'reviewed', 'deleted'];
    if (validStatuses.includes(query.status.toLowerCase())) {
      filter.status = query.status.toLowerCase();
    }
  }

  // Magnitude type filter
  if (query.magType) {
    filter.magType = { $regex: `^${query.magType}$`, $options: 'i' };
  }

  // Seismic network filter
  if (query.network || query.net) {
    filter.net = { $regex: `^${query.network || query.net}$`, $options: 'i' };
  }

  // Magnitude range filters
  if (query.minMagnitude || query.maxMagnitude) {
    filter.mag = {};
    if (query.minMagnitude) filter.mag.$gte = parseFloat(query.minMagnitude);
    if (query.maxMagnitude) filter.mag.$lte = parseFloat(query.maxMagnitude);
  }

  // Depth range filters
  if (query.minDepth || query.maxDepth) {
    filter.depth = {};
    if (query.minDepth) filter.depth.$gte = parseFloat(query.minDepth);
    if (query.maxDepth) filter.depth.$lte = parseFloat(query.maxDepth);
  }

  // Year filter
  if (query.year) {
    const year = parseInt(query.year);
    filter.time = {
      $gte: new Date(`${year}-01-01T00:00:00Z`),
      $lte: new Date(`${year}-12-31T23:59:59Z`),
    };
  }

  // Month filter (1-12)
  if (query.month && !query.year) {
    const month = parseInt(query.month) - 1; // JS months are 0-indexed
    filter.$expr = {
      $eq: [{ $month: '$time' }, parseInt(query.month)],
    };
  }

  // Gap filter
  if (query.minGap) {
    filter.gap = { $gte: parseFloat(query.minGap) };
  }

  // RMS filter
  if (query.minRms) {
    filter.rms = { $gte: parseFloat(query.minRms) };
  }

  // Type filter
  if (query.type) {
    filter.type = { $regex: query.type, $options: 'i' };
  }

  return filter;
};

module.exports = { buildFilter };