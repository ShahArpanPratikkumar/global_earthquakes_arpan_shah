import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchDashboardStats, fetchEarthquakes } from '../../store/slices/earthquakeSlice';
import { getRiskColor, getMagnitudeLabel, getDepthLabel } from '../../utils/riskCalculator';

// Mini stat card
function StatCard({ icon, label, value, sub, color, loading }) {
  return (
    <div className="earth-glass rounded-2xl p-5 border border-earth-200/60 dark:border-earth-700/40 shadow-earth">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{sub}</span>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="skeleton h-8 w-24 rounded-lg" />
          <div className="skeleton h-3 w-32 rounded" />
        </div>
      ) : (
        <>
          <p className="font-display text-3xl font-bold text-earth-800 dark:text-earth-100 mb-1">{value}</p>
          <p className="text-earth-500 dark:text-earth-400 text-xs font-medium">{label}</p>
        </>
      )}
    </div>
  );
}

export default function Dashboard() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { stats, statsLoading, error, earthquakes, loading: listLoading } = useSelector((s) => s.earthquakes);
  const { user }  = useSelector((s) => s.auth);

  const load = () => {
    dispatch(fetchDashboardStats());
    dispatch(fetchEarthquakes({ page: 1, limit: 8 }));
  };

  useEffect(() => { load(); }, [dispatch]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-earth-800 dark:text-earth-100">
            {greeting}, {user?.name?.split(' ')[0] || 'Analyst'} 👋
          </h1>
          <p className="text-earth-500 dark:text-earth-400 text-sm mt-1">
            Global seismic monitoring — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={load}
          disabled={statsLoading}
          className="earth-btn-outline text-sm flex items-center gap-2 self-start"
        >
          <span className={statsLoading ? 'animate-spin inline-block' : ''}>🔄</span>
          Refresh
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-5 py-3 text-sm text-red-700 dark:text-red-400">
          ⚠️ {error} —{' '}
          <button onClick={load} className="underline font-semibold">retry</button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="🌍" loading={statsLoading}
          label="Total Earthquakes Tracked"
          value={(stats.totalCount || 0).toLocaleString()}
          sub="Live count"
          color="bg-earth-100 dark:bg-earth-800/60 text-earth-600 dark:text-earth-300"
        />
        <StatCard
          icon="📊" loading={statsLoading}
          label="Average Magnitude (all events)"
          value={`M ${stats.avgMagnitude || '—'}`}
          sub="Avg"
          color="bg-olive-400/10 text-olive-600 dark:text-olive-400"
        />
        <StatCard
          icon="🚨" loading={statsLoading}
          label="High Magnitude Events (M6+)"
          value={(stats.highMagnitudeCount || 0).toLocaleString()}
          sub="Alert"
          color="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
        />
        <StatCard
          icon="⬇️" loading={statsLoading}
          label="Deep Crustal Tremors (300km+)"
          value={(stats.deepCount || 0).toLocaleString()}
          sub="Deep"
          color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent earthquakes */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-bold text-earth-800 dark:text-earth-100">
              🕐 Recent Seismic Events
            </h2>
            <Link to="/earthquakes" className="text-xs text-earth-500 hover:text-earth-700 dark:hover:text-earth-300 transition-colors font-medium">
              View all →
            </Link>
          </div>

          <div className="earth-glass rounded-2xl border border-earth-200/60 dark:border-earth-700/40 overflow-hidden shadow-earth">
            {listLoading ? (
              <div className="p-5 space-y-3">
                {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
              </div>
            ) : earthquakes.length === 0 ? (
              <div className="py-16 text-center text-earth-400">
                <p className="text-3xl mb-2">📋</p>
                <p className="text-sm">No recent events found</p>
              </div>
            ) : (
              <div className="divide-y divide-earth-100/60 dark:divide-earth-800/40">
                {earthquakes.map((eq) => (
                  <button
                    key={eq._id || eq.id}
                    onClick={() => navigate(`/earthquake/${eq._id || eq.id}`)}
                    className="w-full text-left flex items-center gap-4 px-5 py-3.5 hover:bg-earth-50/50 dark:hover:bg-earth-800/20 transition-colors group"
                  >
                    {/* Magnitude badge */}
                    <div
                      className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-bold font-display text-sm"
                      style={{ background: getRiskColor(eq.mag) + '20', color: getRiskColor(eq.mag) }}
                    >
                      M{parseFloat(eq.mag).toFixed(1)}
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <p className="text-earth-800 dark:text-earth-200 text-sm font-semibold truncate group-hover:text-earth-600 dark:group-hover:text-earth-100 transition-colors">
                        {eq.place || 'Unknown Location'}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-earth-400">
                        <span className="uppercase font-mono bg-earth-100 dark:bg-earth-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          {eq.net}
                        </span>
                        <span>{getDepthLabel(eq.depth)} · {eq.depth} km</span>
                        <span className="hidden sm:inline">· {new Date(eq.time).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        eq.mag >= 6   ? 'bg-red-50    dark:bg-red-900/30   text-red-600    dark:text-red-400    border-red-200    dark:border-red-800'
                        : eq.mag >= 4 ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800'
                        : 'bg-green-50  dark:bg-green-900/30  text-green-600  dark:text-green-400  border-green-200  dark:border-green-800'
                      }`}>
                        {getMagnitudeLabel(eq.mag)}
                      </span>
                      <span className="text-earth-400 group-hover:text-earth-600 dark:group-hover:text-earth-200 transition-colors text-sm">→</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status panel + quick links */}
        <div className="space-y-4">
          {/* Status */}
          <div>
            <h2 className="font-display text-lg font-bold text-earth-800 dark:text-earth-100 mb-3">
              📡 System Status
            </h2>
            <div className="earth-glass rounded-2xl border border-earth-200/60 dark:border-earth-700/40 p-5 space-y-4 shadow-earth">
              {[
                { label: 'Backend API',       status: 'Online',         color: 'bg-green-400' },
                { label: 'MongoDB Database',  status: 'Connected',      color: 'bg-green-400' },
                { label: 'Data Ingestion',    status: 'Active',         color: 'bg-green-400' },
                { label: 'Analytics Engine',  status: 'Processing',     color: 'bg-earth-400 animate-pulse' },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-earth-600 dark:text-earth-400 text-xs font-medium">{s.label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${s.color}`} />
                    <span className="text-earth-700 dark:text-earth-200 text-xs font-semibold">{s.status}</span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-earth-100 dark:border-earth-800">
                <p className="text-[10px] text-earth-400 text-center">
                  Backend: localhost:5000 · MongoDB
                </p>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h2 className="font-display text-base font-bold text-earth-800 dark:text-earth-100 mb-3">
              ⚡ Quick Access
            </h2>
            <div className="space-y-2">
              {[
                { icon: '📊', label: 'View Analytics',        to: '/analytics' },
                { icon: '🗺️', label: 'Live Earthquake Map',   to: '/map'       },
                { icon: '🌎', label: 'Country Explorer',      to: '/countries' },
                { icon: '📰', label: 'Seismic News',          to: '/news'      },
                { icon: '🤝', label: 'NGO Directory',         to: '/ngos'      },
              ].map((l) => (
                <Link key={l.to} to={l.to}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl
                    bg-earth-50/80 dark:bg-earth-800/40 border border-earth-100 dark:border-earth-700/40
                    hover:bg-earth-100 dark:hover:bg-earth-700/40 hover:border-earth-300 dark:hover:border-earth-600
                    transition-all text-sm text-earth-700 dark:text-earth-300 font-medium group">
                  <span>{l.icon}</span>
                  <span className="flex-1">{l.label}</span>
                  <span className="text-earth-400 group-hover:text-earth-600 dark:group-hover:text-earth-200 transition-colors">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
