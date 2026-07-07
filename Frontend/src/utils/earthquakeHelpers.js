/**
 * @file earthquakeHelpers.js
 * @description Earthquake data transformation and helper utilities.
 *              Used to normalize, filter, and sort earthquake records.
 */

import { classifyMagnitude } from '../constants/earthquake';

/**
 * Sorts earthquakes by a given field and direction.
 * @param {Object[]} earthquakes
 * @param {'magnitude'|'time'|'depth'} field
 * @param {'asc'|'desc'} order
 * @returns {Object[]}
 */
export function sortEarthquakes(earthquakes, field = 'time', order = 'desc') {
  return [...earthquakes].sort((a, b) => {
    const valA = a[field] ?? 0;
    const valB = b[field] ?? 0;
    return order === 'desc' ? valB - valA : valA - valB;
  });
}

/**
 * Filters earthquakes by minimum magnitude.
 * @param {Object[]} earthquakes
 * @param {number} minMag
 * @returns {Object[]}
 */
export function filterByMinMagnitude(earthquakes, minMag) {
  return earthquakes.filter((eq) => eq.magnitude >= minMag);
}

/**
 * Groups earthquakes by magnitude severity label.
 * @param {Object[]} earthquakes
 * @returns {Object.<string, Object[]>}
 */
export function groupBySeverity(earthquakes) {
  return earthquakes.reduce((acc, eq) => {
    const { label } = classifyMagnitude(eq.magnitude);
    if (!acc[label]) acc[label] = [];
    acc[label].push(eq);
    return acc;
  }, {});
}

/**
 * Extracts unique country/region names from earthquake records.
 * @param {Object[]} earthquakes
 * @returns {string[]}
 */
export function getUniqueRegions(earthquakes) {
  const regions = new Set(earthquakes.map((eq) => eq.place?.split(', ').pop()).filter(Boolean));
  return [...regions].sort();
}

/**
 * Computes the average magnitude from a list of earthquakes.
 * @param {Object[]} earthquakes
 * @returns {number}
 */
export function averageMagnitude(earthquakes) {
  if (!earthquakes.length) return 0;
  const total = earthquakes.reduce((sum, eq) => sum + (eq.magnitude || 0), 0);
  return parseFloat((total / earthquakes.length).toFixed(2));
}
