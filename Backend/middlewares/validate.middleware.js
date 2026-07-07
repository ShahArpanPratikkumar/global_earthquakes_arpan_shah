const { body, param, query, validationResult } = require('express-validator');
const { sendValidationError } = require('../utils/response.util');

/**
 * Run validation and return errors if any
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendValidationError(res, errors.array().map((e) => ({ field: e.path, message: e.msg })));
  }
  next();
};

/**
 * Earthquake creation validation rules
 */
const validateCreateEarthquake = [
  body('time').notEmpty().withMessage('Time is required').isISO8601().withMessage('Time must be a valid ISO 8601 date'),
  body('latitude')
    .notEmpty().withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('longitude')
    .notEmpty().withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  body('depth')
    .notEmpty().withMessage('Depth is required')
    .isFloat({ min: 0 }).withMessage('Depth must be a non-negative number'),
  body('mag')
    .notEmpty().withMessage('Magnitude is required')
    .isFloat({ min: -2, max: 10 }).withMessage('Magnitude must be between -2 and 10'),
  body('place').notEmpty().withMessage('Place is required').isString().trim(),
  body('id').notEmpty().withMessage('Earthquake ID is required').isString().trim(),
  body('status')
    .optional()
    .isIn(['automatic', 'reviewed', 'deleted']).withMessage('Status must be automatic, reviewed, or deleted'),
  body('rms').optional().isFloat({ min: 0 }).withMessage('RMS must be a non-negative number'),
  body('gap').optional().isFloat({ min: 0, max: 360 }).withMessage('Gap must be between 0 and 360'),
  body('magType').optional().isString().trim(),
  body('net').optional().isString().trim(),
  handleValidation,
];

/**
 * Earthquake update validation (partial)
 */
const validateUpdateEarthquake = [
  body('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  body('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  body('depth').optional().isFloat({ min: 0 }).withMessage('Depth must be a non-negative number'),
  body('mag').optional().isFloat({ min: -2, max: 10 }).withMessage('Magnitude must be between -2 and 10'),
  body('status').optional().isIn(['automatic', 'reviewed', 'deleted']).withMessage('Invalid status value'),
  body('rms').optional().isFloat({ min: 0 }).withMessage('RMS must be a non-negative number'),
  body('gap').optional().isFloat({ min: 0, max: 360 }).withMessage('Gap must be between 0 and 360'),
  handleValidation,
];

/**
 * User registration validation
 */
const validateRegister = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .trim(),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  handleValidation,
];

/**
 * User login validation
 */
const validateLogin = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

/**
 * Magnitude parameter validation
 */
const validateMagnitudeParam = [
  param('mag')
    .isFloat({ min: -2, max: 10 }).withMessage('Magnitude must be a valid number between -2 and 10'),
  handleValidation,
];

/**
 * Depth parameter validation
 */
const validateDepthParam = [
  param('depth')
    .isFloat({ min: 0 }).withMessage('Depth must be a valid non-negative number'),
  handleValidation,
];

/**
 * Pagination query validation
 */
const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidation,
];

/**
 * Password change validation
 */
const validateChangePassword = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain uppercase, lowercase, and number'),
  handleValidation,
];

module.exports = {
  validateCreateEarthquake,
  validateUpdateEarthquake,
  validateRegister,
  validateLogin,
  validateMagnitudeParam,
  validateDepthParam,
  validatePagination,
  validateChangePassword,
  handleValidation,
};
