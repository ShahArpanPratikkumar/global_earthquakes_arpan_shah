/**
 * @file routes.js
 * @description Application route path constants.
 *              Centralizes all frontend route strings to prevent typos and
 *              simplify future route restructuring.
 */

const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  LEARN: '/learn',
  NEWS: '/news',
  NGOS: '/ngos',
  SAVE_EARTH: '/save-earth',

  // Protected routes
  DASHBOARD: '/dashboard',
  EARTHQUAKES: '/earthquakes',
  EARTHQUAKE_DETAIL: (id) => `/earthquakes/${id}`,
  MAP: '/map',
  ANALYTICS: '/analytics',
  COUNTRIES: '/countries',
  SEISMIC_REPORTS: '/seismic-reports',
  PROFILE: '/profile',
  SETTINGS: '/settings',

  // Admin routes
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_EARTHQUAKES: '/admin/earthquakes',
};

export default ROUTES;
