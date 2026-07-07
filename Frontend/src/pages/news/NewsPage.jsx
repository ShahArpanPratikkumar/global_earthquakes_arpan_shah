import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import analyticsService from '../../services/analyticsService';
import { getRiskColor } from '../../utils/riskCalculator';
import ImageWithFallback from '../../components/ui/ImageWithFallback';

// 6 real earthquake photos served from backend /local-images static route
const BASE = 'http://localhost:5000/local-images';
const EQ_IMAGES = [
  `${BASE}/eq_destruction_1_1783314320645.png`,   // aerial city rubble
  `${BASE}/eq_crack_ground_1783314333423.png`,     // road crack
  `${BASE}/eq_rescue_1783314343832.png`,           // rescue team at night
  `${BASE}/news_extreme_1783312111822.png`,        // extreme destruction
  `${BASE}/news_major_1783312146152.png`,          // emergency vehicles
  `${BASE}/news_minor_1783312171824.png`,          // seismograph
];

// Pick a unique image per day using date-string hash
function pickImage(dayId) {
  let h = 0;
  for (let i = 0; i < dayId.length; i++) { h = (h * 31 + dayId.charCodeAt(i)) >>> 0; }
  return EQ_IMAGES[h % EQ_IMAGES.length];
}

export default function NewsPage() {
  const [activity,      setActivity]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');
  const [filter,        setFilter]        = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [countriesList, setCountriesList] = useState([]);

  // Fetch country list once on mount
  useEffect(() => {
    analyticsService.getCountryAnalysis()
      .then(res => {
        if (res?.data) {
          setCountriesList(res.data.map(c => c._id).filter(Boolean));
        }
      })
      .catch(console.error);
  }, []);

  // Fetch activity whenever country filter changes
  useEffect(() => {
    (async () => {
      try {
        setError('');
        setLoading(true);
        const res = await analyticsService.getRecentActivity(countryFilter);
        const sorted = [...(res.data || [])].sort(
          (a, b) => new Date(b._id) - new Date(a._id)
        );
        setActivity(sorted);
      } catch (err) {
        setError(err.message || 'Failed to load seismic news.');
      } finally {
        setLoading(false);
      }
    })();
  }, [countryFilter]);

  const getSeverity = (maxMag) => {
    if (maxMag >= 7)   return { label: 'Extreme',  icon: '🚨', cls: 'bg-red-900/60    text-red-300    border-red-700'    };
    if (maxMag >= 5.5) return { label: 'Major',    icon: '⚠️', cls: 'bg-orange-900/60 text-orange-300 border-orange-700' };
    if (maxMag >= 4)   return { label: 'Moderate', icon: '🟡', cls: 'bg-yellow-900/60 text-yellow-300 border-yellow-700' };
    return               { label: 'Minor',    icon: 'ℹ️', cls: 'bg-earth-800/60   text-earth-400  border-earth-600'  };
  };

  const filteredActivity = activity.filter((day) => {
    if (filter === 'all') return true;
    if (filter === 'major') return parseFloat(day.maxMag) >= 5.5;
    if (filter === 'today') {
      const today = new Date().toISOString().slice(0, 10);
      return day._id === today;
    }
    return true;
  });

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-earth-950 text-earth-100">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-earth-700/60 bg-earth-800/50 text-earth-400 text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Live seismic briefings
        </div>
        <h1 className="section-title text-earth-100 mb-2">📰 Seismic News Center</h1>
        <p className="section-subtitle">
          Daily earthquake activity briefings — last {activity.length} days of global seismic monitoring
        </p>
      </div>

      {/* Filters row */}
      <div className="max-w-4xl mx-auto px-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        {/* Date pills */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all',   label: 'All Dates'    },
            { key: 'major', label: 'Major Events' },
            { key: 'today', label: 'Today'        },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === f.key
                  ? 'bg-earth-500/30 text-earth-200 border border-earth-500/50'
                  : 'text-earth-500 border border-earth-700/40 hover:text-earth-300 hover:border-earth-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Country/Region dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-earth-400 text-sm font-medium whitespace-nowrap">🌍 Region</label>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="py-1.5 px-3 text-sm rounded-lg border border-earth-700/60 bg-earth-900 text-earth-200 focus:outline-none focus:border-earth-500 w-52"
          >
            <option value="all">Global (All Regions)</option>
            {countriesList.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6 pb-16 space-y-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-6 earth-glass-dark rounded-2xl p-5 border border-earth-700/30">
              <div className="skeleton h-48 md:w-64 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-4 py-2">
                <div className="skeleton h-6 w-3/4 rounded" />
                <div className="skeleton h-4 w-1/4 rounded" />
                <div className="skeleton h-20 w-full rounded" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="text-center py-16 earth-glass-dark rounded-2xl border border-red-900/50">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="text-red-400 font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 earth-btn-outline border-red-500 text-red-300"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredActivity.length === 0 ? (
          <div className="text-center py-16 text-earth-500 earth-glass-dark rounded-2xl border border-earth-700/30">
            <p className="text-4xl mb-3">📭</p>
            <p>No seismic activity found for this filter.</p>
          </div>
        ) : (
          filteredActivity.map((day) => {
            const sev     = getSeverity(parseFloat(day.maxMag));
            const isToday = day._id === new Date().toISOString().slice(0, 10);

            return (
              <article
                key={day._id}
                className="group flex flex-col md:flex-row gap-6 earth-glass-dark rounded-2xl p-5 border border-earth-700/30 hover:border-earth-500/50 transition-all overflow-hidden relative"
              >
                {/* Real earthquake photo — unique per card via date hash */}
                <div className="md:w-64 h-48 flex-shrink-0 overflow-hidden rounded-xl relative bg-earth-900">
                  <ImageWithFallback
                    src={pickImage(day._id)}
                    alt={`Earthquake event ${day._id}`}
                    fallbackSrc={EQ_IMAGES[0]}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {isToday && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-[10px] font-bold uppercase rounded shadow-lg flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      Live
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2 text-xs font-semibold flex-wrap">
                      <span className="text-earth-400">GeoSentinel Network</span>
                      <span className="text-earth-600">•</span>
                      <span className="text-earth-400">{formatDate(day._id)}</span>
                      <span className={`px-2 py-0.5 rounded-md border ${sev.cls} ml-auto`}>
                        {sev.icon} {sev.label}
                      </span>
                    </div>

                    <h2 className="font-display font-bold text-earth-100 text-xl mb-2 group-hover:text-earth-300 transition-colors">
                      Global Seismic Summary: {day.count} Events Recorded
                    </h2>

                    <p className="text-earth-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      Global monitoring networks tracked {day.count} earthquakes worldwide. The most powerful event registered at{' '}
                      <strong style={{ color: getRiskColor(day.maxMag) }}>
                        M{parseFloat(day.maxMag).toFixed(1)}
                      </strong>
                      , with the daily average resting at M{parseFloat(day.avgMag).toFixed(2)}.{' '}
                      {parseFloat(day.maxMag) >= 6.0
                        ? 'Emergency response teams are on high alert due to significant seismic disturbances.'
                        : 'Activity remains within expected geological norms for this period.'}
                    </p>
                  </div>

                  {/* Metrics + Link */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="bg-earth-800/60 px-3 py-1.5 rounded-lg border border-earth-700/50">
                        <p className="text-[10px] text-earth-500 font-semibold uppercase">Peak Mag</p>
                        <p className="font-display font-bold text-sm" style={{ color: getRiskColor(day.maxMag) }}>
                          M {parseFloat(day.maxMag).toFixed(1)}
                        </p>
                      </div>
                      <div className="bg-earth-800/60 px-3 py-1.5 rounded-lg border border-earth-700/50">
                        <p className="text-[10px] text-earth-500 font-semibold uppercase">Total Events</p>
                        <p className="font-display font-bold text-sm text-earth-200">{day.count}</p>
                      </div>
                    </div>

                    <Link
                      to="/earthquakes"
                      className="text-sm font-semibold text-earth-300 hover:text-white transition-colors flex items-center gap-1"
                    >
                      Read Report{' '}
                      <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
