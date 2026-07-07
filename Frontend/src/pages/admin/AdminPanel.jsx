import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { getRiskColor, getMagnitudeLabel } from '../../utils/riskCalculator';

// ── Stat Card ──────────────────────────────────────────────────────────────
function AdminStatCard({ icon, label, value, sub, color }) {
  return (
    <div className="earth-glass rounded-2xl p-5 border border-earth-700/40 shadow-earth">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{sub}</span>
      </div>
      <p className="font-display text-3xl font-bold text-earth-100 mb-1">{value}</p>
      <p className="text-earth-500 text-xs font-medium">{label}</p>
    </div>
  );
}

// ── Tab Button ─────────────────────────────────────────────────────────────
function Tab({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? 'bg-earth-600/50 text-earth-200 shadow-inner'
          : 'text-earth-500 hover:text-earth-200 hover:bg-earth-700/40'
      }`}
    >
      <span>{icon}</span> {label}
    </button>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const [tab,       setTab]       = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [reports,   setReports]   = useState(null);
  const [earthquakes, setEarthquakes] = useState([]);
  const [eqMeta,    setEqMeta]    = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading,   setLoading]   = useState(true);

  // Guard: redirect non-admins
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Admin access required.');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fetch based on active tab
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (tab === 'dashboard' && !dashboard) {
          const res = await api.get('/admin/dashboard');
          setDashboard(res.data.data);
        }
        if (tab === 'analytics' && !analytics) {
          const res = await api.get('/admin/analytics');
          setAnalytics(res.data.data);
        }
        if (tab === 'reports' && !reports) {
          const res = await api.get('/admin/reports');
          setReports(res.data.data);
        }
        if (tab === 'earthquakes') {
          const res = await api.get('/admin/earthquakes', { params: { page: eqMeta.page, limit: 15 } });
          setEarthquakes(res.data.data || []);
          setEqMeta(res.data.meta || { total: 0, page: 1, totalPages: 1 });
        }
      } catch (err) {
        toast.error(err.message || 'Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tab, eqMeta.page]);

  // ── Render: Dashboard Tab ────────────────────────────────────────────────
  const renderDashboard = () => {
    if (loading || !dashboard) return <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}</div>;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <AdminStatCard icon="🌍" label="Total Earthquakes in DB" value={(dashboard.total || 0).toLocaleString()} sub="Total" color="bg-earth-800 text-earth-300" />
          <AdminStatCard icon="⚡" label="Highest Magnitude Ever" value={`M ${dashboard.highestMagnitude?.mag || '—'}`} sub="Peak" color="bg-red-900/50 text-red-300" />
          <AdminStatCard icon="📅" label="Monthly Trend Points" value={dashboard.recentTrend?.length || 0} sub="Months" color="bg-olive-500/20 text-olive-400" />
        </div>

        {/* Monthly Trend Table */}
        {dashboard.recentTrend?.length > 0 && (
          <div className="earth-glass rounded-2xl border border-earth-700/40 overflow-hidden">
            <div className="px-5 py-3 border-b border-earth-700/40 flex items-center gap-2">
              <span>📅</span>
              <h3 className="font-bold text-earth-200 text-sm">Monthly Earthquake Counts</h3>
            </div>
            <div className="divide-y divide-earth-800/40">
              {dashboard.recentTrend.map((m, idx) => {
                const label = m.year ? `${m.year}-${String(m.month).padStart(2, '0')}` : (m._id || 'N/A');
                return (
                  <div key={m.year ? `${m.year}-${m.month}` : idx} className="flex items-center justify-between px-5 py-3">
                    <span className="text-earth-400 text-sm">{label}</span>
                    <div className="flex items-center gap-3">
                      <div className="h-2 rounded-full bg-earth-400/30" style={{ width: `${Math.min(m.count * 2, 200)}px` }}>
                        <div className="h-full rounded-full bg-earth-400" style={{ width: '100%' }} />
                      </div>
                      <span className="text-earth-200 font-bold text-sm w-12 text-right">{m.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Highest event detail */}
        {dashboard.highestMagnitude && (
          <div className="earth-glass rounded-2xl border border-red-900/40 p-5">
            <h3 className="font-bold text-earth-200 mb-3 flex items-center gap-2"><span>🚨</span> Highest Magnitude Event on Record</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center font-bold font-display text-lg"
                style={{ background: getRiskColor(dashboard.highestMagnitude.mag) + '30', color: getRiskColor(dashboard.highestMagnitude.mag) }}>
                M{parseFloat(dashboard.highestMagnitude.mag).toFixed(1)}
              </div>
              <div>
                <p className="text-earth-200 font-semibold">{dashboard.highestMagnitude.place || 'Unknown'}</p>
                <p className="text-earth-400 text-sm">{new Date(dashboard.highestMagnitude.time).toLocaleString()}</p>
                <p className="text-earth-500 text-xs mt-1">Depth: {dashboard.highestMagnitude.depth} km</p>
              </div>
              <Link to={`/earthquake/${dashboard.highestMagnitude._id}`}
                className="ml-auto earth-btn-outline text-xs px-3 py-1.5">
                Details →
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Render: Analytics Tab ─────────────────────────────────────────────────
  const renderAnalytics = () => {
    if (loading || !analytics) return <div className="skeleton h-64 rounded-2xl" />;
    const { country, network, magnitude, depth } = analytics;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div className="earth-glass rounded-2xl border border-earth-700/40 overflow-hidden">
          <div className="px-5 py-3 border-b border-earth-700/40"><h3 className="font-bold text-earth-200 text-sm">🌍 Top Countries by Earthquakes</h3></div>
          <div className="divide-y divide-earth-800/40 max-h-80 overflow-y-auto">
            {(country || []).slice(0, 15).map((c, i) => (
              <div key={c._id} className="flex items-center justify-between px-5 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-earth-600 text-xs w-5">{i + 1}.</span>
                  <span className="text-earth-300 text-sm">{c._id || 'Unknown'}</span>
                </div>
                <span className="text-earth-400 font-bold text-sm">{c.count?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Networks */}
        <div className="earth-glass rounded-2xl border border-earth-700/40 overflow-hidden">
          <div className="px-5 py-3 border-b border-earth-700/40"><h3 className="font-bold text-earth-200 text-sm">📡 Reporting Networks</h3></div>
          <div className="divide-y divide-earth-800/40 max-h-80 overflow-y-auto">
            {(network || []).map((n) => (
              <div key={n._id} className="flex items-center justify-between px-5 py-2.5">
                <span className="font-mono text-xs text-earth-300 uppercase bg-earth-800 px-2 py-0.5 rounded">{n._id}</span>
                <span className="text-earth-400 font-bold text-sm">{n.count?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Magnitude Distribution */}
        <div className="earth-glass rounded-2xl border border-earth-700/40 overflow-hidden">
          <div className="px-5 py-3 border-b border-earth-700/40"><h3 className="font-bold text-earth-200 text-sm">📊 Magnitude Distribution</h3></div>
          <div className="divide-y divide-earth-800/40 max-h-80 overflow-y-auto">
            {(magnitude || []).map((m) => (
              <div key={m._id} className="flex items-center justify-between px-5 py-2.5">
                <span className="text-earth-300 text-sm">{m._id}</span>
                <span className="text-earth-400 font-bold text-sm">{m.count?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Depth Distribution */}
        <div className="earth-glass rounded-2xl border border-earth-700/40 overflow-hidden">
          <div className="px-5 py-3 border-b border-earth-700/40"><h3 className="font-bold text-earth-200 text-sm">⬇️ Depth Distribution</h3></div>
          <div className="divide-y divide-earth-800/40 max-h-80 overflow-y-auto">
            {(depth || []).map((d) => (
              <div key={d._id} className="flex items-center justify-between px-5 py-2.5">
                <span className="text-earth-300 text-sm">{d._id} km</span>
                <span className="text-earth-400 font-bold text-sm">{d.count?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── Render: Reports Tab ──────────────────────────────────────────────────
  const renderReports = () => {
    if (loading || !reports) return <div className="skeleton h-64 rounded-2xl" />;
    const { summary, monthlyTrend } = reports;
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminStatCard icon="🌍" label="Total Records" value={(summary?.total || 0).toLocaleString()} sub="All" color="bg-earth-800 text-earth-300" />
          <AdminStatCard icon="📊" label="Avg Magnitude" value={`M ${parseFloat(summary?.avgMag || 0).toFixed(2)}`} sub="Avg" color="bg-olive-500/20 text-olive-400" />
          <AdminStatCard icon="⬇️" label="Avg Depth" value={`${parseFloat(summary?.avgDepth || 0).toFixed(1)} km`} sub="Depth" color="bg-blue-900/30 text-blue-300" />
          <AdminStatCard icon="✅" label="Reviewed Events" value={(summary?.reviewed || 0).toLocaleString()} sub="Reviewed" color="bg-green-900/30 text-green-300" />
        </div>

        {/* Monthly Table */}
        <div className="earth-glass rounded-2xl border border-earth-700/40 overflow-hidden">
          <div className="px-5 py-4 border-b border-earth-700/40 flex items-center justify-between">
            <h3 className="font-bold text-earth-200">📅 Monthly Activity Report</h3>
            <span className="text-earth-500 text-xs">{monthlyTrend?.length || 0} months tracked</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-earth-700/60">
                <tr className="text-earth-400 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Month</th>
                  <th className="px-5 py-3 text-right">Events</th>
                  <th className="px-5 py-3 text-right hidden md:table-cell">Bar</th>
                </tr>
              </thead>
              <tbody>
                {(monthlyTrend || []).map((m, idx) => {
                  const maxCount = Math.max(...(monthlyTrend || []).map(x => x.count));
                  const pct = Math.round((m.count / maxCount) * 100);
                  const label = m.year ? `${m.year}-${String(m.month).padStart(2, '0')}` : (m._id || 'N/A');
                  return (
                    <tr key={m.year ? `${m.year}-${m.month}` : idx} className="border-b border-earth-800/30 last:border-0 hover:bg-earth-800/20">
                      <td className="px-5 py-3 text-earth-300">{label}</td>
                      <td className="px-5 py-3 text-right font-bold text-earth-200">{m.count?.toLocaleString()}</td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-earth-800">
                            <div className="h-full rounded-full bg-earth-400" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-earth-500 text-xs w-8 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ── Render: Earthquakes Tab ───────────────────────────────────────────────
  const renderEarthquakes = () => {
    if (loading) return <div className="skeleton h-64 rounded-2xl" />;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-earth-400 text-sm">
            Total: <span className="text-earth-200 font-bold">{eqMeta.total?.toLocaleString()}</span> records
            &nbsp;·&nbsp; Page {eqMeta.page} of {eqMeta.totalPages}
          </p>
          <div className="flex gap-2">
            <button onClick={() => setEqMeta(m => ({ ...m, page: Math.max(1, m.page - 1) }))}
              disabled={eqMeta.page <= 1}
              className="earth-btn-outline text-xs px-3 py-1.5 disabled:opacity-40">← Prev</button>
            <button onClick={() => setEqMeta(m => ({ ...m, page: Math.min(m.totalPages, m.page + 1) }))}
              disabled={eqMeta.page >= eqMeta.totalPages}
              className="earth-btn-outline text-xs px-3 py-1.5 disabled:opacity-40">Next →</button>
          </div>
        </div>

        <div className="earth-glass rounded-2xl border border-earth-700/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-earth-700/60">
                <tr className="text-earth-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Mag</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Depth</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Time</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Network</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {earthquakes.map((eq) => (
                  <tr key={eq._id} className="border-b border-earth-800/30 last:border-0 hover:bg-earth-800/20 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold font-display text-base" style={{ color: getRiskColor(eq.mag) }}>
                        M {parseFloat(eq.mag).toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-earth-300 max-w-xs truncate">{eq.place || 'Unknown'}</td>
                    <td className="px-4 py-3 text-earth-400 hidden md:table-cell">{eq.depth} km</td>
                    <td className="px-4 py-3 text-earth-500 text-xs hidden lg:table-cell">{new Date(eq.time).toLocaleString()}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="font-mono text-[10px] uppercase bg-earth-800 px-1.5 py-0.5 rounded text-earth-400">{eq.net}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        eq.status === 'reviewed'
                          ? 'bg-green-900/30 text-green-400 border-green-800'
                          : 'bg-earth-800/50 text-earth-400 border-earth-700'
                      }`}>
                        {eq.status || 'automatic'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/earthquake/${eq._id}`} className="text-earth-400 hover:text-earth-200 text-xs transition-colors">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Admin Panel | GeoSentinel</title>
        <meta name="description" content="GeoSentinel Admin Panel — manage earthquake records, view analytics, and generate reports." />
      </Helmet>

      <div className="space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-red-900/40 text-red-300 border border-red-800 rounded-md">
                Admin
              </span>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-earth-100">Admin Control Panel</h1>
            </div>
            <p className="text-earth-500 text-sm mt-1">Full system access — manage data, analytics and reports</p>
          </div>
          <div className="text-right">
            <p className="text-earth-400 text-xs">Logged in as</p>
            <p className="text-earth-200 font-semibold text-sm">{user?.name}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap border-b border-earth-800/60 pb-3">
          <Tab active={tab === 'dashboard'}   onClick={() => setTab('dashboard')}   icon="⚡" label="Dashboard"   />
          <Tab active={tab === 'earthquakes'} onClick={() => setTab('earthquakes')} icon="📋" label="All Records"  />
          <Tab active={tab === 'analytics'}   onClick={() => setTab('analytics')}   icon="📊" label="Analytics"   />
          <Tab active={tab === 'reports'}     onClick={() => setTab('reports')}     icon="📄" label="Reports"     />
        </div>

        {/* Content */}
        {tab === 'dashboard'   && renderDashboard()}
        {tab === 'earthquakes' && renderEarthquakes()}
        {tab === 'analytics'   && renderAnalytics()}
        {tab === 'reports'     && renderReports()}
      </div>
    </>
  );
}
