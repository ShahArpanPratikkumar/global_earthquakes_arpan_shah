import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import earthquakeService from '../../services/earthquakeService';
import PremiumEarth from '../../components/ui/PremiumEarth';

// Animated number counter
function Counter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const step = target / (duration / 16);
    let cur = 0;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      setCount(Math.floor(cur));
      if (cur >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function HomePage() {
  const [stats,   setStats]   = useState({ total: 0, avgMag: 0, avgDepth: 0, highest: 0 });
  const [recent,  setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [countRes, magRes, depthRes, highRes, recentRes] = await Promise.allSettled([
          earthquakeService.getStatsCount(),
          earthquakeService.getStatsAvgMagnitude(),
          earthquakeService.getStatsAvgDepth(),
          earthquakeService.getStatsHighestMagnitude(),
          earthquakeService.getRecent(8),
        ]);

        setStats({
          total:    countRes.value?.data?.total          ?? 0,
          avgMag:   magRes.value?.data?.avgMagnitude     ?? 0,
          avgDepth: depthRes.value?.data?.avgDepth       ?? 0,
          highest:  highRes.value?.data?.highestMagnitude ?? 0,
        });
        setRecent(recentRes.value?.data ?? []);
      } finally { setLoading(false); }
    })();
  }, []);

  const getMagColor = (m) => {
    if (m >= 7) return 'text-red-400';
    if (m >= 5) return 'text-orange-400';
    if (m >= 3) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="bg-earth-950 text-earth-100">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C19A6B 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        {/* Glow blobs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-earth-400/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-olive-500/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center py-24">
          {/* Text */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-earth-700/60 bg-earth-800/50 text-earth-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live Seismic Monitoring
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-gradient-earth">Earth's Pulse</span>
              <br />
              <span className="text-earth-100">Monitored</span>
              <br />
              <span className="text-earth-400">In Real Time</span>
            </h1>

            <p className="text-earth-400 text-lg leading-relaxed max-w-lg">
              GeoSentinel delivers global earthquake intelligence — tracking seismic events, analysing patterns, and helping communities prepare and respond.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard" className="earth-btn-primary px-7 py-3.5 text-base">
                🚀 Open Dashboard
              </Link>
              <Link to="/map" className="earth-btn-outline px-7 py-3.5 text-base">
                🗺️ View Live Map
              </Link>
            </div>
          </div>

          {/* Globe */}
          <div className="flex justify-center relative">
            <PremiumEarth width={400} height={400} />
            
            {/* Floating alert markers (visual only) */}
            <div className="absolute inset-0 pointer-events-none">
              {[
                { top: '15%', left: '20%', delay: '0s',   mag: 5.2 },
                { top: '50%', right: '10%', delay: '1s',  mag: 7.1 },
                { bottom: '20%', left: '30%', delay: '2s', mag: 3.8 },
              ].map((m, i) => (
                <div key={i} className="absolute quake-marker" style={{ top: m.top, left: m.left, right: m.right, bottom: m.bottom, animationDelay: m.delay }}>
                  <div className={`w-3 h-3 rounded-full ${m.mag >= 6 ? 'bg-red-500' : m.mag >= 4 ? 'bg-orange-400' : 'bg-yellow-400'}`}
                    style={{ '--tw-shadow-color': 'currentColor' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-earth-600 animate-bounce">
          <span className="text-xs">Scroll to explore</span>
          <span>↓</span>
        </div>
      </section>

      {/* ── Live Stats ───────────────────────────────────────────────── */}
      <section className="border-y border-earth-800/60 bg-earth-900/50">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {loading
            ? Array(4).fill(0).map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="skeleton h-10 w-32 mx-auto" />
                  <div className="skeleton h-4 w-24 mx-auto" />
                </div>
              ))
            : [
                { label: 'Earthquakes Tracked',    value: stats.total,    suffix: '',   prefix: '' },
                { label: 'Avg Magnitude',           value: stats.avgMag,   suffix: '',   prefix: 'M ' },
                { label: 'Avg Depth',               value: stats.avgDepth, suffix: ' km', prefix: '' },
                { label: 'Highest Recorded',        value: stats.highest,  suffix: '',   prefix: 'M ' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display text-4xl font-bold text-gradient-earth">
                    {s.prefix}<Counter target={typeof s.value === 'number' ? Math.round(s.value * 10) / 10 : 0} suffix={s.suffix} />
                  </p>
                  <p className="text-earth-500 text-sm mt-1">{s.label}</p>
                </div>
              ))
          }
        </div>
      </section>

      {/* ── Recent Major Earthquakes ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="section-title text-earth-100">Recent Seismic Events</h2>
            <p className="section-subtitle">Latest earthquakes from our global monitoring network</p>
          </div>
          <Link to="/earthquakes" className="earth-btn-outline text-sm text-earth-300 border-earth-600 hidden sm:block">
            View All →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {loading
            ? Array(6).fill(0).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)
            : recent.slice(0, 8).map((eq) => (
                <Link key={eq._id} to={`/earthquake/${eq._id}`}
                  className="earth-glass-dark rounded-2xl p-4 flex items-center gap-4 hover:border-earth-600/50 border border-transparent transition-all group">
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm font-display
                    ${eq.mag >= 6 ? 'bg-red-900/60 text-red-300' : eq.mag >= 4 ? 'bg-orange-900/60 text-orange-300' : 'bg-earth-800 text-earth-300'}`}>
                    M{parseFloat(eq.mag).toFixed(1)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-earth-200 text-sm font-medium truncate group-hover:text-earth-100 transition-colors">
                      {eq.place || 'Unknown Location'}
                    </p>
                    <div className="flex gap-3 mt-0.5 text-xs text-earth-500">
                      <span>{eq.depth} km depth</span>
                      <span>·</span>
                      <span>{new Date(eq.time).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className="text-earth-600 group-hover:text-earth-400 transition-colors text-lg">→</span>
                </Link>
              ))
          }
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="bg-earth-900/40 border-y border-earth-800/40">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="section-title text-earth-100">Everything You Need</h2>
            <p className="section-subtitle">Comprehensive earthquake intelligence in one platform</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🗺️', title: 'Interactive World Map',    desc: 'Visualise earthquake epicentres on a live map, filtered by magnitude and time range.',     to: '/map'       },
              { icon: '🌎', title: 'Country Explorer',         desc: 'Drill into any country\'s seismic history — totals, averages, risk levels, and top events.',  to: '/countries' },
              { icon: '📊', title: 'Deep Analytics',           desc: 'Magnitude distributions, depth profiles, network coverage, and monthly trend charts.',       to: '/analytics' },
              { icon: '📰', title: 'News & Briefings',         desc: 'Daily seismic activity summaries formatted as news briefings powered by live backend data.', to: '/news'      },
              { icon: '📚', title: 'Learn Center',             desc: 'Interactive educational content about plate tectonics, fault lines, and disaster preparedness.',to: '/learn'    },
              { icon: '🤝', title: 'NGO Directory',            desc: 'Connect with 14+ global relief organisations working in earthquake-affected communities.',    to: '/ngos'      },
            ].map((f) => (
              <Link key={f.title} to={f.to}
                className="earth-glass-dark rounded-2xl p-6 border border-earth-700/30 hover:border-earth-500/50 transition-all group">
                <span className="text-3xl mb-3 block">{f.icon}</span>
                <h3 className="font-display font-bold text-earth-200 mb-2 group-hover:text-earth-100 transition-colors">{f.title}</h3>
                <p className="text-earth-500 text-sm leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-earth-100 mb-4">
          Start Monitoring Today
        </h2>
        <p className="text-earth-400 text-lg mb-8 max-w-xl mx-auto">
          Create your free account and get instant access to real-time earthquake data, analytics, and alerts from around the world.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="earth-btn-primary px-8 py-3.5 text-base">🌍 Get Started Free</Link>
          <Link to="/learn"    className="earth-btn-outline px-8 py-3.5 text-base text-earth-300 border-earth-600">📚 Learn More</Link>
        </div>
      </section>

    </div>
  );
}
