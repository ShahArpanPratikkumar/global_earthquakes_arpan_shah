/**
 * @file messages.js
 * @description Standardized API response message strings.
 *              Ensures consistent user-facing messages across all endpoints.
 */

const MESSAGES = {
  // Auth messages
  AUTH: {
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logged out successfully',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'An account with this email already exists',
    UNAUTHORIZED: 'Authentication required. Please log in.',
    FORBIDDEN: 'You do not have permission to perform this action',
    TOKEN_EXPIRED: 'Session expired. Please log in again.',
    TOKEN_INVALID: 'Invalid authentication token',
  },

  // Earthquake messages
  EARTHQUAKE: {
    FETCH_SUCCESS: 'Earthquakes retrieved successfully',
    FETCH_ONE_SUCCESS: 'Earthquake details retrieved successfully',
    CREATE_SUCCESS: 'Earthquake record created successfully',
    UPDATE_SUCCESS: 'Earthquake record updated successfully',
    DELETE_SUCCESS: 'Earthquake record deleted successfully',
    NOT_FOUND: 'Earthquake record not found',
    INVALID_MAGNITUDE: 'Magnitude must be a number between 0 and 10',
  },

  // Analytics messages
  ANALYTICS: {
    FETCH_SUCCESS: 'Analytics data retrieved successfully',
    STATS_SUCCESS: 'Statistics retrieved successfully',
  },

  // General messages
  GENERAL: {
    SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
    VALIDATION_ERROR: 'Validation failed. Please check your input.',
    NOT_FOUND: 'The requested resource was not found.',
    RATE_LIMITED: 'Too many requests. Please slow down.',
    SUCCESS: 'Operation completed successfully',
  },
};

module.exports = MESSAGES;
