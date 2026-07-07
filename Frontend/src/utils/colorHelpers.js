/**
 * @file colorHelpers.js
 * @description Color utility functions for dynamic chart and map styling.
 *              Generates consistent color palettes for data visualization.
 */

/**
 * Predefined chart color palette (matches dark theme design system).
 */
export const CHART_COLORS = [
  '#f97316', // orange-500 (primary)
  '#3b82f6', // blue-500 (secondary)
  '#22c55e', // green-500
  '#a855f7', // purple-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f59e0b', // amber-500
  '#6366f1', // indigo-500
  '#10b981', // emerald-500
  '#ef4444', // red-500
];

/**
 * Returns a color from the palette by index (cycles if out of range).
 * @param {number} index
 * @returns {string} Hex color string
 */
export function getChartColor(index) {
  return CHART_COLORS[index % CHART_COLORS.length];
}

/**
 * Converts a hex color to an rgba string.
 * @param {string} hex - Hex color (e.g., "#f97316")
 * @param {number} alpha - Opacity (0-1)
 * @returns {string}
 */
export function hexToRgba(hex, alpha = 1) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Returns an interpolated color between red and green based on a 0–1 scale.
 * Used for risk score visualization.
 * @param {number} score - Value between 0 (safe) and 1 (high risk)
 * @returns {string} Hex color
 */
export function riskScoreColor(score) {
  const clamped = Math.min(1, Math.max(0, score));
  const r = Math.round(255 * clamped);
  const g = Math.round(255 * (1 - clamped));
  return `rgb(${r}, ${g}, 50)`;
}
