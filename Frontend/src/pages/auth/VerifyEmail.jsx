import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import PremiumEarth from '../../components/ui/PremiumEarth';

export default function VerifyEmail() {
  const navigate              = useNavigate();
  const [email,    setEmail]  = useState('');
  const [otp,      setOtp]    = useState(['', '', '', '', '', '']);
  const [step,     setStep]   = useState('email'); // 'email' | 'otp' | 'done'
  const [loading,  setLoading]= useState(false);
  const inputsRef             = useRef([]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { email });
      toast.success('OTP sent to your email!');
      setStep('otp');
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return; // digits only
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      inputsRef.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { toast.error('Enter the full 6-digit OTP.'); return; }
    setLoading(true);
    try {
      await api.post('/auth/verify-email', { email, otp: code });
      toast.success('Email verified successfully!');
      setStep('done');
    } catch (err) {
      toast.error(err.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { email });
      toast.success('New OTP sent!');
      setOtp(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="font-display text-3xl font-bold text-earth-800 dark:text-earth-100">
              {step === 'email' ? 'Verify Your Email' : step === 'otp' ? 'Enter OTP Code' : 'Email Verified!'}
            </h1>
            <p className="mt-2 text-earth-500 dark:text-earth-400 text-sm">
              {step === 'email' && 'Enter your email to receive a verification code.'}
              {step === 'otp'   && `We sent a 6-digit code to ${email}`}
              {step === 'done'  && 'Your email is verified. You can now log in.'}
            </p>
          </div>

          <div className="earth-glass rounded-2xl p-8 shadow-earth-lg">

            {/* ── Step: Email ──────────────────────────────── */}
            {step === 'email' && (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-earth-700 dark:text-earth-300 mb-1.5">Email Address</label>
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="earth-input"
                  />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full earth-btn-primary py-3 text-base disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading
                    ? <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Sending…</>
                    : '📨 Send OTP Code'}
                </button>
                <p className="text-center text-sm text-earth-500 dark:text-earth-400">
                  Already verified?{' '}
                  <Link to="/login" className="font-semibold text-earth-600 dark:text-earth-300 hover:text-earth-700 transition-colors">
                    Sign In
                  </Link>
                </p>
              </form>
            )}

            {/* ── Step: OTP ────────────────────────────────── */}
            {step === 'otp' && (
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-earth-700 dark:text-earth-300 mb-4 text-center">
                    Enter 6-digit code
                  </label>
                  {/* OTP Boxes */}
                  <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (inputsRef.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-11 h-14 text-center text-xl font-bold rounded-xl border-2 border-earth-700 bg-earth-900 text-earth-100
                          focus:outline-none focus:border-earth-400 focus:ring-2 focus:ring-earth-400/30 transition-all
                          caret-earth-400"
                      />
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading || otp.join('').length < 6}
                  className="w-full earth-btn-primary py-3 text-base disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading
                    ? <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> Verifying…</>
                    : '✅ Verify Email'}
                </button>

                <div className="flex items-center justify-between text-sm text-earth-500">
                  <button type="button" onClick={() => setStep('email')}
                    className="hover:text-earth-300 transition-colors">
                    ← Change email
                  </button>
                  <button type="button" onClick={handleResend} disabled={loading}
                    className="hover:text-earth-300 transition-colors font-semibold text-earth-400">
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            {/* ── Step: Done ───────────────────────────────── */}
            {step === 'done' && (
              <div className="text-center space-y-5">
                <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center mx-auto">
                  <span className="text-4xl">✅</span>
                </div>
                <p className="text-earth-300 text-sm leading-relaxed">
                  Your account is now verified. You can sign in and access the full earthquake monitoring dashboard.
                </p>
                <Link to="/login" className="block earth-btn-primary w-full py-3 text-sm text-center">
                  → Go to Login
                </Link>
              </div>
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
            <h2 className="font-display text-2xl font-bold text-earth-100 mb-3">Secure Account</h2>
            <p className="text-earth-400 text-sm leading-relaxed">
              Email verification ensures your account is protected and you receive timely seismic alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
