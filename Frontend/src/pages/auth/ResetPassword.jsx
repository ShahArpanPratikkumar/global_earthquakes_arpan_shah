import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import PremiumEarth from '../../components/ui/PremiumEarth';

export default function ResetPassword() {
  const [searchParams]        = useSearchParams();
  const navigate              = useNavigate();
  const [token,    setToken]  = useState(searchParams.get('token') || '');
  const [form,     setForm]   = useState({ newPassword: '', confirmPassword: '' });
  const [showPwd,  setShowPwd]= useState(false);
  const [loading,  setLoading]= useState(false);
  const [success,  setSuccess]= useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: form.newPassword });
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  const strength = (pwd) => {
    if (!pwd) return { label: '', color: '', pct: 0 };
    let score = 0;
    if (pwd.length >= 8)  score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    if (score <= 1) return { label: 'Weak',   color: 'bg-red-500',    pct: 20  };
    if (score <= 2) return { label: 'Fair',   color: 'bg-orange-400', pct: 40  };
    if (score <= 3) return { label: 'Good',   color: 'bg-yellow-400', pct: 65  };
    if (score <= 4) return { label: 'Strong', color: 'bg-green-400',  pct: 85  };
    return              { label: 'Excellent', color: 'bg-green-500',  pct: 100 };
  };

  const str = strength(form.newPassword);

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-earth-50 dark:bg-earth-950">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <span className="text-3xl">🌍</span>
              <span className="font-display font-bold text-2xl text-earth-800 dark:text-earth-100">GeoSentinel</span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-earth-800 dark:text-earth-100">Reset Password</h1>
            <p className="mt-2 text-earth-500 dark:text-earth-400 text-sm">
              Enter your reset token and choose a new password.
            </p>
          </div>

          <div className="earth-glass rounded-2xl p-8 shadow-earth-lg">
            {success ? (
              <div className="text-center space-y-4">
                <div className="text-6xl">✅</div>
                <h2 className="font-display text-xl font-bold text-earth-100">Password Updated!</h2>
                <p className="text-earth-400 text-sm">Redirecting you to login in 3 seconds…</p>
                <Link to="/login" className="block earth-btn-primary w-full py-3 text-sm text-center mt-4">
                  Go to Login →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Token field (if not in URL) */}
                {!searchParams.get('token') && (
                  <div>
                    <label className="block text-sm font-semibold text-earth-700 dark:text-earth-300 mb-1.5">
                      Reset Token
                    </label>
                    <input
                      type="text"
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Paste your reset token here"
                      className="earth-input font-mono text-xs"
                    />
                    <p className="text-xs text-earth-500 mt-1">Find this token in your reset email</p>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-earth-700 dark:text-earth-300 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      name="newPassword"
                      type={showPwd ? 'text' : 'password'}
                      required
                      value={form.newPassword}
                      onChange={onChange}
                      placeholder="••••••••"
                      className="earth-input pr-10"
                    />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600 text-sm transition-colors">
                      {showPwd ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {/* Strength Bar */}
                  {form.newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="w-full h-1.5 rounded-full bg-earth-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${str.color}`}
                          style={{ width: `${str.pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-earth-500">Strength: <span className="font-semibold text-earth-300">{str.label}</span></p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-earth-700 dark:text-earth-300 mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    name="confirmPassword"
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={form.confirmPassword}
                    onChange={onChange}
                    placeholder="••••••••"
                    className={`earth-input ${form.confirmPassword && form.newPassword !== form.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  />
                  {form.confirmPassword && form.newPassword !== form.confirmPassword && (
                    <p className="text-xs text-red-400 mt-1">⚠ Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || (form.confirmPassword && form.newPassword !== form.confirmPassword)}
                  className="w-full earth-btn-primary py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading
                    ? <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Resetting…</>
                    : '🔐 Reset Password'}
                </button>

                <p className="text-center text-sm text-earth-500 dark:text-earth-400">
                  <Link to="/forgot-password" className="font-semibold text-earth-600 dark:text-earth-300 hover:text-earth-700 transition-colors">
                    ← Request new reset link
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="hidden lg:flex w-1/2 xl:w-3/5 relative bg-hero-gradient items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #C19A6B 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <div className="relative z-10 flex flex-col items-center gap-8">
          <PremiumEarth width={288} height={288} />
          <div className="text-center max-w-sm px-6">
            <h2 className="font-display text-2xl font-bold text-earth-100 mb-3">Secure Recovery</h2>
            <p className="text-earth-400 text-sm leading-relaxed">
              Create a strong password to protect your earthquake monitoring account and all your saved data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
