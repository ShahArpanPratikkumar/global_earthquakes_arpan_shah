/**
 * @file dateFormatter.js
 * @description Date and time formatting utility functions.
 *              Provides consistent date display across the entire application.
 */

/**
 * Formats an ISO date string to a human-readable date.
 * @param {string|Date} date
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string}
 * @example formatDate('2024-01-15T10:30:00Z') // "January 15, 2024"
 */
export function formatDate(date, options = {}) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

/**
 * Formats an ISO date string to date + time.
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDateTime(date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });
}

/**
 * Returns a relative time string (e.g., "3 minutes ago").
 * @param {string|Date} date
 * @returns {string}
 */
export function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

/**
 * Formats a date as YYYY-MM-DD for API query params.
 * @param {string|Date} date
 * @returns {string}
 */
export function toISODate(date) {
  return new Date(date).toISOString().split('T')[0];
}
