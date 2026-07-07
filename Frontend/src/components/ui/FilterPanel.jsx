/**
 * @file FilterPanel.jsx
 * @description Advanced filter panel for earthquake data filtering.
 *              Provides magnitude range, date range, and region/network dropdowns.
 */

import React, { useState } from 'react';

/**
 * @param {{
 *   onFilterChange: (filters: Object) => void,
 *   className?: string
 * }} props
 */
const FilterPanel = ({ onFilterChange, className = '' }) => {
  const [filters, setFilters] = useState({
    minMagnitude: '',
    maxMagnitude: '',
    startDate: '',
    endDate: '',
    region: '',
    sortBy: 'time',
    sortOrder: 'desc',
  });

  const handleChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    const reset = {
      minMagnitude: '', maxMagnitude: '',
      startDate: '', endDate: '', region: '',
      sortBy: 'time', sortOrder: 'desc',
    };
    setFilters(reset);
    onFilterChange(reset);
  };

  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-xl p-5 ${className}`} role="search" aria-label="Filter earthquakes">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Filters</h3>
        <button onClick={handleReset} className="text-xs text-slate-400 hover:text-orange-400 transition-colors" aria-label="Reset all filters">
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="minMag" className="block text-xs text-slate-400 mb-1">Min Magnitude</label>
          <input id="minMag" type="number" min="0" max="10" step="0.1" value={filters.minMagnitude}
            onChange={(e) => handleChange('minMagnitude', e.target.value)}
            placeholder="0.0"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="maxMag" className="block text-xs text-slate-400 mb-1">Max Magnitude</label>
          <input id="maxMag" type="number" min="0" max="10" step="0.1" value={filters.maxMagnitude}
            onChange={(e) => handleChange('maxMagnitude', e.target.value)}
            placeholder="10.0"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-xs text-slate-400 mb-1">Start Date</label>
          <input id="startDate" type="date" value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-xs text-slate-400 mb-1">End Date</label>
          <input id="endDate" type="date" value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
