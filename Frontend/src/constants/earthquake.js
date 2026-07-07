/**
 * @file earthquake.js
 * @description Earthquake classification constants.
 *              Defines magnitude thresholds, severity labels, and color codes
 *              used across components for consistent visual representation.
 */

export const MAGNITUDE_THRESHOLDS = {
  MICRO: 2.0,
  MINOR: 3.0,
  LIGHT: 4.0,
  MODERATE: 5.0,
  STRONG: 6.0,
  MAJOR: 7.0,
  GREAT: 8.0,
};

export const MAGNITUDE_LABELS = {
  MICRO: 'Micro',
  MINOR: 'Minor',
  LIGHT: 'Light',
  MODERATE: 'Moderate',
  STRONG: 'Strong',
  MAJOR: 'Major',
  GREAT: 'Great',
};

export const MAGNITUDE_COLORS = {
  MICRO: '#22c55e',     // green-500
  MINOR: '#86efac',     // green-300
  LIGHT: '#fbbf24',     // amber-400
  MODERATE: '#f97316',  // orange-500
  STRONG: '#ef4444',    // red-500
  MAJOR: '#b91c1c',     // red-700
  GREAT: '#7f1d1d',     // red-900
};

/**
 * Returns severity classification for a given magnitude value.
 * @param {number} magnitude - Earthquake magnitude
 * @returns {{ label: string, color: string, severity: string }}
 */
export function classifyMagnitude(magnitude) {
  if (magnitude < MAGNITUDE_THRESHOLDS.MICRO) return { label: MAGNITUDE_LABELS.MICRO, color: MAGNITUDE_COLORS.MICRO, severity: 'micro' };
  if (magnitude < MAGNITUDE_THRESHOLDS.MINOR) return { label: MAGNITUDE_LABELS.MINOR, color: MAGNITUDE_COLORS.MINOR, severity: 'minor' };
  if (magnitude < MAGNITUDE_THRESHOLDS.LIGHT) return { label: MAGNITUDE_LABELS.LIGHT, color: MAGNITUDE_COLORS.LIGHT, severity: 'light' };
  if (magnitude < MAGNITUDE_THRESHOLDS.MODERATE) return { label: MAGNITUDE_LABELS.MODERATE, color: MAGNITUDE_COLORS.MODERATE, severity: 'moderate' };
  if (magnitude < MAGNITUDE_THRESHOLDS.STRONG) return { label: MAGNITUDE_LABELS.STRONG, color: MAGNITUDE_COLORS.STRONG, severity: 'strong' };
  if (magnitude < MAGNITUDE_THRESHOLDS.MAJOR) return { label: MAGNITUDE_LABELS.MAJOR, color: MAGNITUDE_COLORS.MAJOR, severity: 'major' };
  return { label: MAGNITUDE_LABELS.GREAT, color: MAGNITUDE_COLORS.GREAT, severity: 'great' };
}
