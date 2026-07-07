const mongoose = require('mongoose');

const earthquakeSchema = new mongoose.Schema(
  {
    time: {
      type: Date,
      required: [true, 'Time is required'],
      index: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    depth: {
      type: Number,
      required: [true, 'Depth is required'],
      min: [0, 'Depth cannot be negative'],
      index: true,
    },
    mag: {
      type: Number,
      required: [true, 'Magnitude is required'],
      index: true,
    },
    magType: {
      type: String,
      trim: true,
      index: true,
    },
    nst: {
      type: Number,
      default: null,
    },
    gap: {
      type: Number,
      default: null,
      index: true,
    },
    dmin: {
      type: Number,
      default: null,
    },
    rms: {
      type: Number,
      default: null,
      index: true,
    },
    net: {
      type: String,
      trim: true,
      index: true,
    },
    id: {
      type: String,
      unique: true,
      required: [true, 'Earthquake ID is required'],
      trim: true,
      index: true,
    },
    updated: {
      type: Date,
      default: null,
    },
    place: {
      type: String,
      required: [true, 'Place is required'],
      trim: true,
      index: true,
    },
    type: {
      type: String,
      trim: true,
      default: 'earthquake',
      index: true,
    },
    horizontalError: {
      type: Number,
      default: null,
    },
    depthError: {
      type: Number,
      default: null,
    },
    magError: {
      type: Number,
      default: null,
    },
    magNst: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['automatic', 'reviewed', 'deleted'],
        message: 'Status must be automatic, reviewed, or deleted',
      },
      default: 'automatic',
      index: true,
    },
    locationSource: {
      type: String,
      trim: true,
      default: null,
    },
    magSource: {
      type: String,
      trim: true,
      default: null,
    },
    // Soft delete flag (Good-to-Have)
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt (Good-to-Have: Timestamp Tracking)
    versionKey: false,
  }
);

// Compound indexes for common query patterns
earthquakeSchema.index({ mag: -1, time: -1 });
earthquakeSchema.index({ depth: -1, time: -1 });
earthquakeSchema.index({ place: 'text', type: 'text', status: 'text' }); // Text index for search
earthquakeSchema.index({ net: 1, status: 1 });
earthquakeSchema.index({ time: -1, status: 1 });

// Exclude soft-deleted records by default
earthquakeSchema.pre(/^find/, function (next) {
  if (!this.getOptions().includeSoftDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
  next();
});

const Earthquake = mongoose.model('Earthquake', earthquakeSchema);

module.exports = Earthquake;
