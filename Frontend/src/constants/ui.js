/**
 * @file ui.js
 * @description UI configuration constants.
 *              Defines animation durations, breakpoints, and component config values.
 */

export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

export const TOAST = {
  DURATION: 4000,
  MAX_TOASTS: 5,
  POSITIONS: {
    TOP_RIGHT: 'top-right',
    TOP_LEFT: 'top-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_LEFT: 'bottom-left',
  },
};

export const TABLE = {
  DEFAULT_SORT_FIELD: 'time',
  DEFAULT_SORT_ORDER: 'desc',
};

export const MAP = {
  DEFAULT_CENTER: [20, 0],
  DEFAULT_ZOOM: 2,
  MAX_ZOOM: 18,
  MIN_ZOOM: 1,
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
};
