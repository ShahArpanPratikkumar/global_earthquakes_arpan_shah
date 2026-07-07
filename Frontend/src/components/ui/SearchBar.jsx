/**
 * @file SearchBar.jsx
 * @description Reusable search input component with debounced onChange.
 *              Includes clear button and keyboard accessibility.
 */

import React, { useState } from 'react';
import useDebounce from '../../hooks/useDebounce';

/**
 * @param {{
 *   onSearch: (query: string) => void,
 *   placeholder?: string,
 *   debounceMs?: number,
 *   className?: string
 * }} props
 */
const SearchBar = ({ onSearch, placeholder = 'Search earthquakes...', debounceMs = 400, className = '' }) => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, debounceMs);

  React.useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className={`relative flex items-center ${className}`} role="search">
      <span className="absolute left-3 text-slate-500" aria-hidden="true">🔍</span>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className="w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 text-slate-400 hover:text-white transition-colors"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
