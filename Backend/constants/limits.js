/**
 * @file limits.js
 * @description API limit configuration constants.
 *              Centralizes pagination, rate-limiting, and query limit values.
 */

const LIMITS = {
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    MIN_LIMIT: 1,
  },

  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000,   // 15 minutes
    MAX_REQUESTS: 100,
    MAX_AUTH_REQUESTS: 10,        // Stricter limit for auth routes
  },

  // File/payload limits
  PAYLOAD: {
    JSON_LIMIT: '10kb',
  },

  // Earthquake filters
  EARTHQUAKE: {
    MIN_MAGNITUDE: 0,
    MAX_MAGNITUDE: 10,
    MIN_DEPTH_KM: 0,
    MAX_DEPTH_KM: 700,
  },

  // JWT
  JWT: {
    ACCESS_TOKEN_EXPIRY: '7d',
    REFRESH_TOKEN_EXPIRY: '30d',
  },
};

module.exports = LIMITS;
