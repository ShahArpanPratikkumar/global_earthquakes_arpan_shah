/**
 * @file api.js
 * @description API endpoint path constants for the Frontend service layer.
 *              Centralizes all REST API paths to prevent hardcoded URL strings.
 */

const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },

  // Earthquakes
  EARTHQUAKES: {
    LIST: '/earthquakes',
    DETAIL: (id) => `/earthquakes/${id}`,
    CREATE: '/earthquakes',
    UPDATE: (id) => `/earthquakes/${id}`,
    DELETE: (id) => `/earthquakes/${id}`,
    SEARCH: '/search',
  },

  // Analytics
  ANALYTICS: {
    TRENDS: '/analytics/trends',
    HEATMAP: '/analytics/heatmap',
    RISK: '/analytics/risk',
  },

  // Stats
  STATS: {
    SUMMARY: '/stats/summary',
    BY_MAGNITUDE: '/stats/by-magnitude',
  },
};

export default API_ENDPOINTS;
