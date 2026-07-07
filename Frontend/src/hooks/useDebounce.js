/**
 * @file useDebounce.js
 * @description Custom React hook that debounces a value by a specified delay.
 *              Prevents excessive API calls during rapid user input (e.g., search).
 *
 * @example
 *   const debouncedSearch = useDebounce(searchQuery, 400);
 *   useEffect(() => { fetchEarthquakes(debouncedSearch); }, [debouncedSearch]);
 */

import { useState, useEffect } from 'react';

/**
 * Debounces a value by the given delay in milliseconds.
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {*} The debounced value
 */
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the timer if value changes before delay elapses
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
