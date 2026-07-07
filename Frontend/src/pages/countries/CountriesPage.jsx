import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountryAnalysis, setSearchQuery, setSortBy } from '../../store/slices/countrySlice';
import { getCountryRiskLevel } from '../../utils/riskCalculator';

export default function CountriesPage() {
  const dispatch = useDispatch();
  const { analysis, analysisLoading, analysisError, searchQuery, sortBy } = useSelector((s) => s.country);

  useEffect(() => { dispatch(fetchCountryAnalysis()); }, [dispatch]);

  const filtered = [...analysis]
    .filter((c) => c._id?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'totalEarthquakes') return b.totalEarthquakes - a.totalEarthquakes;
      if (sortBy === 'avgMagnitude')     return b.avgMagnitude - a.avgMagnitude;
      if (sortBy === 'maxMagnitude')     return b.maxMagnitude - a.maxMagnitude;
      return 0;
    });

  return (
    <div className="min-h-screen bg-earth-950 text-earth-100">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <h1 className="section-title text-earth-100 mb-2">🌎 Country Explorer</h1>
        <p className="section-subtitle">
          Seismic risk profiles for <span className="text-earth-300 font-semibold">{analysis.length}</span> countries
          — ranked by earthquake activity
        </p>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 mb-8 flex flex-wrap gap-4">
        <div className="flex-1 min-w-64 relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-500 text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search countries…"
            className="earth-input pl-9 bg-earth-900 border-earth-700 text-earth-100 placeholder-earth-600"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          className="earth-input bg-earth-900 border-earth-700 text-earth-200 w-auto"
        >
          <option value="totalEarthquakes">Sort: Most Earthquakes</option>
          <option value="avgMagnitude">Sort: Avg Magnitude</option>
          <option value="maxMagnitude">Sort: Max Magnitude</option>
        </select>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {analysisLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array(12).fill(0).map((_, i) => <div key={i} className="skeleton h-44 rounded-2xl" />)}
          </div>
        ) : analysisError ? (
          <div className="text-center py-16">
            <p className="text-red-400 text-lg">⚠️ {analysisError}</p>
            <button onClick={() => dispatch(fetchCountryAnalysis())} className="earth-btn-outline mt-4 text-earth-300 border-earth-600">
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((country, i) => {
              const risk = getCountryRiskLevel(country.avgMagnitude, country.totalEarthquakes);
              return (
                <Link
                  key={country._id}
                  to={`/countries/${encodeURIComponent(country._id)}`}
                  className="earth-glass-dark rounded-2xl p-5 border border-earth-700/30
                    hover:border-earth-500/50 transition-all group"
                >
                  {/* Rank + risk */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-earth-600 text-xs font-bold">#{i + 1}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${risk.color}`}>
                      {risk.level}
                    </span>
                  </div>

                  {/* Country name */}
                  <h3 className="font-display font-bold text-earth-100 text-base mb-4 group-hover:text-earth-300 transition-colors truncate">
                    {country._id || 'Unknown'}
                  </h3>

                  {/* Stats */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-earth-500">Total Events</span>
                      <span className="text-earth-200 font-semibold">{country.totalEarthquakes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-earth-500">Avg Magnitude</span>
                      <span className="text-earth-200 font-semibold">M {(country.avgMagnitude || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-earth-500">Max Recorded</span>
                      <span className="font-semibold" style={{ color: country.maxMagnitude >= 7 ? '#ef4444' : country.maxMagnitude >= 5 ? '#f97316' : '#22c55e' }}>
                        M {(country.maxMagnitude || 0).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-earth-500">Avg Depth</span>
                      <span className="text-earth-200 font-semibold">{(country.avgDepth || 0).toFixed(0)} km</span>
                    </div>
                  </div>

                  {/* Progress bar — relative to max */}
                  <div className="mt-4 h-1 rounded-full bg-earth-800">
                    <div
                      className="h-1 rounded-full bg-gradient-to-r from-earth-600 to-earth-400 transition-all"
                      style={{ width: `${Math.min(100, (country.totalEarthquakes / (filtered[0]?.totalEarthquakes || 1)) * 100)}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
