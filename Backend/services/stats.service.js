const Earthquake = require('../models/Earthquake.model');

const getTotalCount = async () => {
  return await Earthquake.countDocuments({ isDeleted: { $ne: true } });
};

const getHighestMagnitudeRecord = async () => {
  return await Earthquake.findOne({ isDeleted: { $ne: true } }).sort({ mag: -1 });
};

const getDeepestRecord = async () => {
  return await Earthquake.findOne({ isDeleted: { $ne: true } }).sort({ depth: -1 });
};

const getAverageDepth = async () => {
  const result = await Earthquake.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: null, avgDepth: { $avg: '$depth' }, minDepth: { $min: '$depth' }, maxDepth: { $max: '$depth' } } },
    { $project: { _id: 0, avgDepth: { $round: ['$avgDepth', 2] }, minDepth: 1, maxDepth: 1 } },
  ]);
  return result[0] || {};
};

const getAverageMagnitude = async () => {
  const result = await Earthquake.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: null, avgMag: { $avg: '$mag' }, minMag: { $min: '$mag' }, maxMag: { $max: '$mag' } } },
    { $project: { _id: 0, avgMagnitude: { $round: ['$avgMag', 2] }, minMagnitude: '$minMag', maxMagnitude: '$maxMag' } },
  ]);
  return result[0] || {};
};

const getCountByCountry = async () => {
  return await Earthquake.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $addFields: {
        country: { $trim: { input: { $arrayElemAt: [{ $split: ['$place', ', '] }, -1] } } },
      },
    },
    { $group: { _id: '$country', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { country: '$_id', count: 1, _id: 0 } },
  ]);
};

const getCountByType = async () => {
  return await Earthquake.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: '$type', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { type: '$_id', count: 1, _id: 0 } },
  ]);
};

const getCountByNetwork = async () => {
  return await Earthquake.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: '$net', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { network: '$_id', count: 1, _id: 0 } },
  ]);
};

const getReviewedCount = async () => {
  const [reviewed, automatic, total] = await Promise.all([
    Earthquake.countDocuments({ status: 'reviewed', isDeleted: { $ne: true } }),
    Earthquake.countDocuments({ status: 'automatic', isDeleted: { $ne: true } }),
    Earthquake.countDocuments({ isDeleted: { $ne: true } }),
  ]);
  return {
    total,
    reviewed,
    automatic,
    reviewedPercent: total > 0 ? ((reviewed / total) * 100).toFixed(2) : '0.00',
  };
};

const getMonthlyCounts = async () => {
  return await Earthquake.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: { year: { $year: '$time' }, month: { $month: '$time' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 24 },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        count: 1,
      },
    },
  ]);
};

module.exports = {
  getTotalCount,
  getHighestMagnitudeRecord,
  getDeepestRecord,
  getAverageDepth,
  getAverageMagnitude,
  getCountByCountry,
  getCountByType,
  getCountByNetwork,
  getReviewedCount,
  getMonthlyCounts,
};
