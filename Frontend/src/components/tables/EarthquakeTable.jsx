/**
 * @file EarthquakeTable.jsx
 * @description Advanced paginated earthquake table with sortable columns and magnitude badges.
 * @module components/tables/EarthquakeTable
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  fetchEarthquakes, 
  setPage, 
  setSort, 
  setFilters, 
  resetFilters 
} from '../../store/slices/earthquakeSlice';
import { SeverityBadge, DepthBadge } from '../ui/Badge';
import { TableSkeleton } from '../ui/Skeleton';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown,
  Search, 
  RotateCcw, 
  Eye, 
  FilterX,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const EarthquakeTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    earthquakes, 
    meta, 
    loading, 
    error, 
    sort, 
    filters 
  } = useSelector((state) => state.earthquakes);

  const [localCountry, setLocalCountry] = useState(filters.country);
  const [localPlace, setLocalPlace] = useState(filters.place);
  const [localMagRange, setLocalMagRange] = useState(filters.magRange);
  const [localDepthRange, setLocalDepthRange] = useState(filters.depthRange);

  // Load earthquakes based on current sort, page, and filters
  useEffect(() => {
    dispatch(fetchEarthquakes({
      page: meta.page,
      limit: meta.limit,
      sort,
      country: filters.country,
      place: filters.place,
      magRange: filters.magRange,
      depthRange: filters.depthRange
    }));
  }, [dispatch, meta.page, meta.limit, sort, filters]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      dispatch(setPage(newPage));
    }
  };

  const handleSortChange = (field) => {
    let nextSort = 'time-desc';
    if (field === 'magnitude') {
      nextSort = sort === 'magnitude-desc' ? 'time-desc' : 'magnitude-desc';
    } else if (field === 'depth') {
      nextSort = sort === 'depth-desc' ? 'time-desc' : 'depth-desc';
    } else if (field === 'time') {
      nextSort = sort === 'time-desc' ? 'magnitude-desc' : 'time-desc';
    }
    dispatch(setSort(nextSort));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    dispatch(setFilters({
      country: localCountry,
      place: localPlace,
      magRange: localMagRange,
      depthRange: localDepthRange
    }));
  };

  const handleClearFilters = () => {
    setLocalCountry('');
    setLocalPlace('');
    setLocalMagRange('');
    setLocalDepthRange('');
    dispatch(resetFilters());
  };

  const getSortIcon = (field) => {
    if (field === 'magnitude' && sort.includes('magnitude')) {
      return sort.endsWith('desc') ? <ChevronDown size={14} /> : <ChevronUp size={14} />;
    }
    if (field === 'depth' && sort.includes('depth')) {
      return sort.endsWith('desc') ? <ChevronDown size={14} /> : <ChevronUp size={14} />;
    }
    if (field === 'time' && sort.includes('time')) {
      return sort.endsWith('desc') ? <ChevronDown size={14} /> : <ChevronUp size={14} />;
    }
    return <ChevronsUpDown size={14} className="opacity-40" />;
  };

  const handleRetry = () => {
    dispatch(fetchEarthquakes({
      page: meta.page,
      limit: meta.limit,
      sort,
      country: filters.country,
      place: filters.place,
      magRange: filters.magRange,
      depthRange: filters.depthRange
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Filters Sidebar / Panel */}
      <form onSubmit={applyFilters} className="glass-panel border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5 items-end">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Country</label>
          <input 
            type="text"
            value={localCountry}
            onChange={(e) => setLocalCountry(e.target.value)}
            placeholder="e.g. Japan, Turkey"
            className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Place Detail</label>
          <input 
            type="text"
            value={localPlace}
            onChange={(e) => setLocalPlace(e.target.value)}
            placeholder="e.g. islands, region"
            className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Magnitude Filter</label>
          <select
            value={localMagRange}
            onChange={(e) => setLocalMagRange(e.target.value)}
            className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
          >
            <option value="">All Magnitudes</option>
            <option value="high">Strong/Critical (M6.0+)</option>
            <option value="critical">Critical Shallow (M7.0+)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Depth Filter</label>
          <select
            value={localDepthRange}
            onChange={(e) => setLocalDepthRange(e.target.value)}
            className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-100 outline-none focus:border-primary-500"
          >
            <option value="">All Depths</option>
            <option value="deep">Deep Earthquakes (300km+)</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <button 
            type="submit"
            className="flex-1 text-sm bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-3 rounded-lg transition-all"
          >
            Apply Filters
          </button>
          
          <button 
            type="button"
            onClick={handleClearFilters}
            className="p-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
            title="Reset Filters"
          >
            <FilterX size={18} />
          </button>
        </div>
      </form>

      {/* Main Table View */}
      <div className="glass-panel border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-glass-light dark:shadow-glass">
        {loading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : error ? (
          <div className="p-12 text-center flex flex-col items-center">
            <p className="text-red-500 font-semibold mb-4">Error loading data: {error}</p>
            <button 
              onClick={handleRetry} 
              className="flex items-center space-x-2 text-sm bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              <RotateCcw size={16} />
              <span>Retry Fetching</span>
            </button>
          </div>
        ) : earthquakes.length === 0 ? (
          <div className="p-16 text-center text-slate-500 dark:text-slate-400">
            <p className="text-lg font-bold">No Earthquakes Found</p>
            <p className="text-sm mt-1">Try resetting the query filter fields above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-900/40 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Place</th>
                  <th 
                    className="px-5 py-4 cursor-pointer hover:text-primary-500 select-none"
                    onClick={() => handleSortChange('magnitude')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Magnitude</span>
                      {getSortIcon('magnitude')}
                    </div>
                  </th>
                  <th 
                    className="px-5 py-4 cursor-pointer hover:text-primary-500 select-none"
                    onClick={() => handleSortChange('depth')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Depth</span>
                      {getSortIcon('depth')}
                    </div>
                  </th>
                  <th 
                    className="px-5 py-4 cursor-pointer hover:text-primary-500 select-none"
                    onClick={() => handleSortChange('time')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Time</span>
                      {getSortIcon('time')}
                    </div>
                  </th>
                  <th className="px-5 py-4">Network</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {earthquakes.map((eq) => (
                  <tr 
                    key={eq._id || eq.id}
                    className="hover:bg-slate-100/30 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-slate-400 select-all">{eq.id}</td>
                    <td className="px-5 py-4 max-w-[200px] truncate" title={eq.place}>
                      {eq.place || 'Unknown Location'}
                    </td>
                    <td className="px-5 py-4">
                      <SeverityBadge mag={eq.mag} />
                    </td>
                    <td className="px-5 py-4">
                      <DepthBadge depth={eq.depth} />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {new Date(eq.time).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {eq.net}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => navigate(`/earthquake/${eq._id || eq.id}`)}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        <Eye size={14} />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Server-Side Pagination Controls */}
        {!loading && !error && earthquakes.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-800 px-5 py-4 gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Showing page <span className="font-bold text-slate-800 dark:text-slate-200">{meta.page}</span> of <span className="font-bold text-slate-800 dark:text-slate-200">{meta.totalPages}</span> ({meta.total} records total)
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={!meta.hasPrevPage}
                className="flex items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-850"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={!meta.hasNextPage}
                className="flex items-center justify-center p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-850"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default EarthquakeTable;