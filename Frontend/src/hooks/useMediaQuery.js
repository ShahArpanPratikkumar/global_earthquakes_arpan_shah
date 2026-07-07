/**
 * @file useMediaQuery.js
 * @description Custom React hook to subscribe to CSS media query changes.
 *              Enables responsive logic directly inside React components.
 *
 * @example
 *   const isMobile = useMediaQuery('(max-width: 768px)');
 *   const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
 */

import { useState, useEffect } from 'react';

/**
 * @param {string} query - A valid CSS media query string
 * @returns {boolean} Whether the media query currently matches
 */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);

    // Use addEventListener for modern browsers
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export default useMediaQuery;
