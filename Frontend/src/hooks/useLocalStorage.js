/**
 * @file useLocalStorage.js
 * @description Custom React hook for persistent state via localStorage.
 *              Automatically syncs React state with localStorage on every change.
 *
 * @example
 *   const [theme, setTheme] = useLocalStorage('theme', 'dark');
 */

import { useState, useEffect } from 'react';

/**
 * @param {string} key - localStorage key
 * @param {*} initialValue - Default value if key not found
 * @returns {[*, Function]} State value and setter function
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: Failed to read key "${key}" from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      // Allow value to be a function (same API as useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`useLocalStorage: Failed to write key "${key}" to localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
