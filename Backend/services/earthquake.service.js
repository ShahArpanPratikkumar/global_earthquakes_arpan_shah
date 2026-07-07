/**
 * @file earthquake.service.js
 * @description Earthquake CRUD service. Handles all database operations with filters and pagination.
 * @module services/earthquake
 */

const Earthquake = require('../models/Earthquake.model');
const { paginate, getSortObject } = require('../utils/pagination.util');
const { buildFilter } = require('../utils/filterBuilder.util');

// ─── CRUD ────────────────────────────────────────────────────────────────────

const getAllEarthquakes = async (query) => {
  const filter = buildFilter(query);
  const { page = 1, limit = 10, sort } = query;
  const sortObj = getSortObject(sort);
  return await paginate(Earthquake, filter, { page, limit, sort: sortObj });
};

const getEarthquakeById = async (id) => {
  return await Earthquake.findOne({ id });
};

const getEarthquakeByMongoId = async (mongoId) => {
  return await Earthquake.findById(mongoId);
};

const createEarthquake = async (data) => {
  return await Earthquake.create(data);
};

const replaceEarthquake = async (id, data) => {
  return await Earthquake.findOneAndReplace({ id }, data, { new: true, runValidators: true });
};

const updateEarthquake = async (id, data) => {
  return await Earthquake.findOneAndUpdate({ id }, data, { new: true, runValidators: true });
};

const deleteEarthquake = async (id) => {
  // Soft delete
  return await Earthquake.findOneAndUpdate(
    { id },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
};

const checkExists = async (id) => {
  const count = await Earthquake.countDocuments({ id });
  return count > 0;
};

// ─── BULK OPERATIONS ─────────────────────────────────────────────────────────

const bulkCreate = async (records) => {
  return await Earthquake.insertMany(records, { ordered: false });
};

const bulkUpdate = async (updates) => {
  const ops = updates.map(({ id, data }) => ({
    updateOne: { filter: { id }, update: { $set: data }, upsert: false },
  }));
  return await Earthquake.bulkWrite(ops);
};

const bulkDelete = async (ids) => {
  return await Earthquake.updateMany(
    { id: { $in: ids } },
    { isDeleted: true, deletedAt: new Date() }
  );
};

// ─── INFORMATION QUERIES ──────────────────────────────────────────────────────

const getByPlace = async (place, query = {}) => {
  const { page = 1, limit = 10 } = query;
  const filter = { place: { $regex: place, $options: 'i' } };
  return await paginate(Earthquake, filter, { page, limit, sort: { time: -1 } });
};

const getByCountry = async (country, query = {}) => {
  const { page = 1, limit = 10 } = query;
  const filter = { place: { $regex: country, $options: 'i' } };
  return await paginate(Earthquake, filter, { page, limit, sort: { time: -1 } });
};

const getByType = async (type, query = {}) => {
  const { page = 1, limit = 10 } = query;
  const filter = { type: { $regex: type, $options: 'i' } };
  return await paginate(Earthquake, filter, { page, limit, sort: { time: -1 } });
};

const getByStatus = async (status, query = {}) => {
  const validStatuses = ['automatic', 'reviewed', 'deleted'];
  if (!validStatuses.includes(status.toLowerCase())) {
    throw Object.assign(new Error(`Invalid status: '${status}'. Valid values: automatic, reviewed`), { statusCode: 400 });
  }
  const { page = 1, limit = 10 } = query;
  return await paginate(Earthquake, { status: status.toLowerCase() }, { page, limit, sort: { time: -1 } });
};

const getByMagType = async (magType, query = {}) => {
  const { page = 1, limit = 10 } = query;
  const filter = { magType: { $regex: `^${magType}$`, $options: 'i' } };
  return await paginate(Earthquake, filter, { page, limit, sort: { mag: -1 } });
};

const getByNetwork = async (net, query = {}) => {
  const { page = 1, limit = 10 } = query;
  const filter = { net: { $regex: `^${net}$`, $options: 'i' } };
  return await paginate(Earthquake, filter, { page, limit, sort: { time: -1 } });
};

const getHighMagnitude = async (query = {}) => {
  const { page = 1, limit = 10 } = query;
  return await paginate(Earthquake, { mag: { $gte: 6.0 } }, { page, limit, sort: { mag: -1 } });
};

const getDeepEarthquakes = async (query = {}) => {
  const { page = 1, limit = 10 } = query;
  return await paginate(Earthquake, { depth: { $gte: 300 } }, { page, limit, sort: { depth: -1 } });
};

const getShallowEarthquakes = async (query = {}) => {
  const { page = 1, limit = 10 } = query;
  return await paginate(Earthquake, { depth: { $lt: 70 } }, { page, limit, sort: { depth: 1 } });
};

const getRecent = async (query = {}) => {
  const { page = 1, limit = 10 } = query;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return await paginate(Earthquake, { time: { $gte: thirtyDaysAgo } }, { page, limit, sort: { time: -1 } });
};

const getReviewed = async (query = {}) => {
  const { page = 1, limit = 10 } = query;
  return await paginate(Earthquake, { status: 'reviewed' }, { page, limit, sort: { time: -1 } });
};

const getHighGap = async (query = {}) => {
  const { page = 1, limit = 10 } = query;
  return await paginate(Earthquake, { gap: { $gte: 180 } }, { page, limit, sort: { gap: -1 } });
};

const getHighRms = async (query = {}) => {
  const { page = 1, limit = 10 } = query;
  return await paginate(Earthquake, { rms: { $gte: 1.0 } }, { page, limit, sort: { rms: -1 } });
};

const getOceanic = async (query = {}) => {
  const { page = 1, limit = 10 } = query;
  const filter = {
    $or: [
      { place: { $regex: 'ocean', $options: 'i' } },
      { place: { $regex: 'sea', $options: 'i' } },
      { place: { $regex: 'ridge', $options: 'i' } },
    ],
  };
  return await paginate(Earthquake, filter, { page, limit, sort: { time: -1 } });
};

const getCritical = async (query = {}) => {
  const { page = 1, limit = 10 } = query;
  return await paginate(
    Earthquake,
    { mag: { $gte: 7.0 }, depth: { $lt: 70 } },
    { page, limit, sort: { mag: -1 } }
  );
};

// ─── ROUTE PARAMETER QUERIES ──────────────────────────────────────────────────

const getByMagnitude = async (mag, query = {}) => {
  const magNum = parseFloat(mag);
  if (isNaN(magNum)) throw Object.assign(new Error('Invalid magnitude value'), { statusCode: 400 });
  const { page = 1, limit = 10 } = query;
  return await paginate(
    Earthquake,
    { mag: { $gte: magNum - 0.5, $lte: magNum + 0.5 } },
    { page, limit, sort: { mag: -1 } }
  );
};

const getByDepth = async (depth, query = {}) => {
  const depthNum = parseFloat(depth);
  if (isNaN(depthNum)) throw Object.assign(new Error('Invalid depth value'), { statusCode: 400 });
  const { page = 1, limit = 10 } = query;
  return await paginate(
    Earthquake,
    { depth: { $gte: depthNum - 10, $lte: depthNum + 10 } },
    { page, limit, sort: { depth: 1 } }
  );
};

const getByDate = async (date, query = {}) => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) throw Object.assign(new Error('Invalid date format'), { statusCode: 400 });
  const nextDay = new Date(dateObj);
  nextDay.setDate(nextDay.getDate() + 1);
  const { page = 1, limit = 10 } = query;
  return await paginate(
    Earthquake,
    { time: { $gte: dateObj, $lt: nextDay } },
    { page, limit, sort: { time: -1 } }
  );
};

const getByYear = async (year, query = {}) => {
  const yearNum = parseInt(year);
  if (isNaN(yearNum)) throw Object.assign(new Error('Invalid year value'), { statusCode: 400 });
  const { page = 1, limit = 10 } = query;
  return await paginate(
    Earthquake,
    {
      time: {
        $gte: new Date(`${yearNum}-01-01T00:00:00Z`),
        $lte: new Date(`${yearNum}-12-31T23:59:59Z`),
      },
    },
    { page, limit, sort: { time: -1 } }
  );
};

const getByMonth = async (month, query = {}) => {
  const monthNum = parseInt(month);
  if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    throw Object.assign(new Error('Month must be between 1 and 12'), { statusCode: 400 });
  }
  const { page = 1, limit = 10 } = query;
  return await paginate(
    Earthquake,
    { $expr: { $eq: [{ $month: '$time' }, monthNum] } },
    { page, limit, sort: { time: -1 } }
  );
};

// ─── SORT ROUTES ──────────────────────────────────────────────────────────────

const getSortedByMagnitudeDesc = async (query = {}) => {
  const { page = 1, limit = 10 } = query;
  return await paginate(Earthquake, {}, { page, limit, sort: { mag: -1 } });
};

const getSortedByTimeDesc = async (query = {}) => {
  const { page = 1, limit = 10 } = query;
  return await paginate(Earthquake, {}, { page, limit, sort: { time: -1 } });
};

// ─── RANDOM ───────────────────────────────────────────────────────────────────

const getRandom = async () => {
  const count = await Earthquake.countDocuments();
  const random = Math.floor(Math.random() * count);
  return await Earthquake.findOne().skip(random);
};

module.exports = {
  getAllEarthquakes,
  getEarthquakeById,
  getEarthquakeByMongoId,
  createEarthquake,
  replaceEarthquake,
  updateEarthquake,
  deleteEarthquake,
  checkExists,
  bulkCreate,
  bulkUpdate,
  bulkDelete,
  getByPlace,
  getByCountry,
  getByType,
  getByStatus,
  getByMagType,
  getByNetwork,
  getHighMagnitude,
  getDeepEarthquakes,
  getShallowEarthquakes,
  getRecent,
  getReviewed,
  getHighGap,
  getHighRms,
  getOceanic,
  getCritical,
  getByMagnitude,
  getByDepth,
  getByDate,
  getByYear,
  getByMonth,
  getSortedByMagnitudeDesc,
  getSortedByTimeDesc,
  getRandom,
};