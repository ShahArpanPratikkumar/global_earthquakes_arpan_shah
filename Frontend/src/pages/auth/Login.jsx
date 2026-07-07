import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/slices/authSlice';
import PremiumEarth from '../../components/ui/PremiumEarth';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm]   = useState({ email: '', password: '' });
  const [show, setShow]   = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-earth-50 dark:bg-earth-950">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <span className="text-3xl">🌍</span>
              <span className="font-display font-bold text-2xl text-earth-800 dark:text-earth-100">GeoSentinel</span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-earth-800 dark:text-earth-100">Welcome back</h1>
            <p className="mt-2 text-earth-500 dark:text-earth-400 text-sm">
              Sign in to access your earthquake monitoring dashboard
            </p>
          </div>

          {/* Form card */}
          <div className="earth-glass rounded-2xl p-8 shadow-earth-lg">
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-earth-700 dark:text-earth-300 mb-1.5">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="you@example.com"
                  className="earth-input"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-earth-700 dark:text-earth-300">Password</label>
                </div>
                <div className="relative">
                  <input
                    name="password"
                    type={show ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={onChange}
                    placeholder="••••••••"
                    className="earth-input pr-10"
                  />
                  <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600 text-sm transition-colors">
                    {show ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full earth-btn-primary py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading
                  ? <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Signing in…</>
                  : '→ Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-earth-500 dark:text-earth-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-earth-600 dark:text-earth-300 hover:text-earth-700 transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right — Visual Panel */}
      <div className="hidden lg:flex w-1/2 xl:w-3/5 relative bg-hero-gradient items-center justify-center overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #C19A6B 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />

        {/* Globe */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          <PremiumEarth width={288} height={288} />

          <div className="text-center max-w-sm px-6">
            <h2 className="font-display text-2xl font-bold text-earth-100 mb-3">
              Global Earthquake Intelligence
            </h2>
            <p className="text-earth-400 text-sm leading-relaxed">
              Monitor seismic activity worldwide. Analyze patterns, explore country data, and stay informed with real-time alerts from our global sensor network.
            </p>
          </div>

          {/* Floating stats */}
          <div className="flex gap-4">
            {[
              { label: 'Events Tracked', value: '50K+' },
              { label: 'Countries',      value: '190+' },
              { label: 'Networks',       value: '24/7'  },
            ].map((s) => (
              <div key={s.label} className="earth-glass-dark rounded-2xl px-5 py-3 text-center">
                <p className="text-earth-200 font-bold text-xl font-display">{s.value}</p>
                <p className="text-earth-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
