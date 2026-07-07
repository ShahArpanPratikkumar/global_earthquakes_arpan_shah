/**
 * @file numberFormatter.js
 * @description Number and unit formatting utility functions.
 *              Provides consistent numeric display across charts, tables, and cards.
 */

/**
 * Formats a number with thousands separators.
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Formats depth in kilometers.
 * @param {number} depthKm
 * @returns {string}
 */
export function formatDepth(depthKm) {
  return `${depthKm.toFixed(1)} km`;
}

/**
 * Formats a magnitude value to 1 decimal place.
 * @param {number} magnitude
 * @returns {string}
 */
export function formatMagnitude(magnitude) {
  return typeof magnitude === 'number' ? magnitude.toFixed(1) : 'N/A';
}

/**
 * Formats geographic coordinates.
 * @param {number} lat
 * @param {number} lng
 * @returns {string}
 */
export function formatCoordinates(lat, lng) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lng).toFixed(4)}°${lngDir}`;
}

/**
 * Compacts large numbers (e.g., 1200 → "1.2K", 1500000 → "1.5M").
 * @param {number} num
 * @returns {string}
 */
export function compactNumber(num) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
}
