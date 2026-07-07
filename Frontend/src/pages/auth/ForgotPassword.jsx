import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import PremiumEarth from '../../components/ui/PremiumEarth';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent! Check your email.');
    } catch (err) {
      toast.error(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
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
            <h1 className="font-display text-3xl font-bold text-earth-800 dark:text-earth-100">
              Forgot Password?
            </h1>
            <p className="mt-2 text-earth-500 dark:text-earth-400 text-sm">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          <div className="earth-glass rounded-2xl p-8 shadow-earth-lg">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="text-6xl">📬</div>
                <h2 className="font-display text-xl font-bold text-earth-100">Check Your Email</h2>
                <p className="text-earth-400 text-sm leading-relaxed">
                  We sent a password reset link to <strong className="text-earth-300">{email}</strong>.
                  The link expires in 1 hour.
                </p>
                <div className="pt-2 space-y-3">
                  <button
                    onClick={() => { setSent(false); setEmail(''); }}
                    className="earth-btn-outline w-full py-3 text-sm"
                  >
                    Send Again
                  </button>
                  <Link to="/login" className="block earth-btn-primary w-full py-3 text-sm text-center">
                    Back to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-earth-700 dark:text-earth-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="earth-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full earth-btn-primary py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading
                    ? <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Sending…</>
                    : '📧 Send Reset Link'}
                </button>

                <p className="text-center text-sm text-earth-500 dark:text-earth-400">
                  Remember your password?{' '}
                  <Link to="/login" className="font-semibold text-earth-600 dark:text-earth-300 hover:text-earth-700 transition-colors">
                    Sign In
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:flex w-1/2 xl:w-3/5 relative bg-hero-gradient items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #C19A6B 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div className="relative z-10 flex flex-col items-center gap-8">
          <PremiumEarth width={288} height={288} />
          <div className="text-center max-w-sm px-6">
            <h2 className="font-display text-2xl font-bold text-earth-100 mb-3">Account Recovery</h2>
            <p className="text-earth-400 text-sm leading-relaxed">
              Secure password reset via email verification. Your account and seismic data remain fully protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
