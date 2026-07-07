import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/slices/authSlice';
import PremiumEarth from '../../components/ui/PremiumEarth';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm]   = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [show, setShow]   = useState(false);
  const [localError, setLocalError] = useState('');

  const onChange = (e) => { setLocalError(''); setForm((p) => ({ ...p, [e.target.name]: e.target.value })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    const result = await dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
    if (registerUser.fulfilled.match(result)) navigate('/dashboard');
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex">
      {/* Left — Visual */}
      <div className="hidden lg:flex w-2/5 relative bg-hero-gradient items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #C19A6B 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center">
          <PremiumEarth width={224} height={224} />
          <div>
            <h2 className="font-display text-2xl font-bold text-earth-100 mb-2">Join GeoSentinel</h2>
            <p className="text-earth-400 text-sm leading-relaxed">
              Access real-time earthquake data, interactive maps, and global seismic analytics.
            </p>
          </div>
          {[
            { icon: '🌍', text: 'Live earthquake monitoring' },
            { icon: '📊', text: 'Advanced analytics & charts' },
            { icon: '🗺️', text: 'Interactive world map' },
            { icon: '🔔', text: 'Risk-level alerts' },
          ].map((f) => (
            <div key={f.text} className="flex items-center gap-3 earth-glass-dark rounded-xl px-4 py-2.5 w-full">
              <span className="text-lg">{f.icon}</span>
              <span className="text-earth-300 text-sm text-left">{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-earth-50 dark:bg-earth-950 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <span className="text-3xl">🌍</span>
              <span className="font-display font-bold text-2xl text-earth-800 dark:text-earth-100">GeoSentinel</span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-earth-800 dark:text-earth-100">Create account</h1>
            <p className="mt-2 text-earth-500 dark:text-earth-400 text-sm">Start monitoring earthquakes worldwide</p>
          </div>

          <div className="earth-glass rounded-2xl p-8 shadow-earth-lg">
            {displayError && (
              <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                ⚠️ {displayError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-earth-700 dark:text-earth-300 mb-1.5">Full Name</label>
                <input name="name" type="text" required value={form.name} onChange={onChange} placeholder="Jane Doe" className="earth-input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-earth-700 dark:text-earth-300 mb-1.5">Email Address</label>
                <input name="email" type="email" required value={form.email} onChange={onChange} placeholder="you@example.com" className="earth-input" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-earth-700 dark:text-earth-300 mb-1.5">Password</label>
                <div className="relative">
                  <input name="password" type={show ? 'text' : 'password'} required value={form.password}
                    onChange={onChange} placeholder="Min. 8 characters" className="earth-input pr-10" />
                  <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600 text-sm">
                    {show ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-earth-700 dark:text-earth-300 mb-1.5">Confirm Password</label>
                <input name="confirmPassword" type="password" required value={form.confirmPassword}
                  onChange={onChange} placeholder="Repeat password" className="earth-input" />
              </div>

              <button type="submit" disabled={loading}
                className="w-full earth-btn-primary py-3 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading
                  ? <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Creating account…</>
                  : '→ Create Account'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-earth-500 dark:text-earth-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-earth-600 dark:text-earth-300 hover:text-earth-700 transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
