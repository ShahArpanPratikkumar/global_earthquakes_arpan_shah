import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { fetchProfile } from '../../store/slices/authSlice';
import authService from '../../services/authService';

// ── Field Row ──────────────────────────────────────────────────────────────
function FieldRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-earth-800/40 border border-earth-700/30">
      <span className="text-lg mt-0.5 flex-shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-earth-500 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-semibold text-earth-200 truncate mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const dispatch = useDispatch();
  const { user, profileLoading } = useSelector((s) => s.auth);

  const [tab,      setTab]      = useState('view');   // 'view' | 'edit' | 'password'
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [pwdForm,  setPwdForm]  = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwd,  setShowPwd]  = useState(false);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Sync edit form when user loads
  useEffect(() => {
    if (user) setEditForm({ name: user.name || '', email: user.email || '' });
  }, [user]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) { toast.error('Name cannot be empty.'); return; }
    setSaving(true);
    try {
      await authService.updateProfile({ name: editForm.name, email: editForm.email });
      await dispatch(fetchProfile());
      toast.success('Profile updated successfully!');
      setTab('view');
    } catch (err) {
      toast.error(err.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) { toast.error('Passwords do not match.'); return; }
    if (pwdForm.newPassword.length < 8) { toast.error('New password must be at least 8 characters.'); return; }
    setSaving(true);
    try {
      await authService.changePassword(pwdForm.currentPassword, pwdForm.newPassword);
      toast.success('Password changed successfully!');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTab('view');
    } catch (err) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { key: 'view',     icon: '👤', label: 'View Profile'    },
    { key: 'edit',     icon: '✏️', label: 'Edit Profile'    },
    { key: 'password', icon: '🔒', label: 'Change Password' },
  ];

  return (
    <>
      <Helmet>
        <title>My Profile | GeoSentinel</title>
        <meta name="description" content="View and edit your GeoSentinel profile. Change your name, email, or password." />
      </Helmet>

      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-earth-100">My Profile</h1>
          <p className="text-earth-500 text-sm mt-1">Manage your account details and security settings</p>
        </div>

        {/* Avatar + Name Banner */}
        {user && (
          <div className="earth-glass rounded-2xl border border-earth-700/40 p-6 flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-earth-400 to-earth-700 flex items-center justify-center text-white text-3xl font-bold font-display flex-shrink-0 shadow-lg">
              {(user.name || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-earth-100">{user.name}</h2>
              <p className="text-earth-400 text-sm">{user.email}</p>
              <span className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-earth-600/40 text-earth-300 border border-earth-600/40">
                🛡️ {user.role || 'user'}
              </span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-earth-800/60 pb-3">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-earth-600/50 text-earth-200 shadow-inner'
                  : 'text-earth-500 hover:text-earth-200 hover:bg-earth-700/40'
              }`}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: View ──────────────────────────────────────────────── */}
        {tab === 'view' && (
          profileLoading ? (
            <div className="space-y-3">
              {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
            </div>
          ) : user ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FieldRow icon="👤" label="Full Name"        value={user.name} />
              <FieldRow icon="📧" label="Email Address"    value={user.email} />
              <FieldRow icon="🛡️" label="Account Role"     value={user.role || 'user'} />
              <FieldRow icon="🔑" label="System ID"        value={user._id} />
              <FieldRow icon="📅" label="Member Since"     value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} />
              <FieldRow icon="✅" label="Email Verified"   value={user.isVerified ? '✅ Verified' : '❌ Not Verified'} />
            </div>
          ) : (
            <div className="text-center py-12 text-earth-500">
              <p className="text-3xl mb-3">⚠️</p>
              <p>Failed to load profile.</p>
              <button onClick={() => dispatch(fetchProfile())} className="mt-3 earth-btn-outline text-sm">Retry</button>
            </div>
          )
        )}

        {/* ── Tab: Edit ──────────────────────────────────────────────── */}
        {tab === 'edit' && (
          <form onSubmit={handleEditSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-earth-300 mb-1.5">Full Name</label>
              <input
                type="text" required
                value={editForm.name}
                onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Your full name"
                className="earth-input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-earth-300 mb-1.5">Email Address</label>
              <input
                type="email" required
                value={editForm.email}
                onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className="earth-input"
              />
              <p className="text-xs text-earth-500 mt-1">Changing email may require re-verification.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="earth-btn-primary px-6 py-2.5 text-sm disabled:opacity-60 flex items-center gap-2">
                {saving ? <><div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" /> Saving…</> : '💾 Save Changes'}
              </button>
              <button type="button" onClick={() => setTab('view')} className="earth-btn-outline px-6 py-2.5 text-sm">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* ── Tab: Password ──────────────────────────────────────────── */}
        {tab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-earth-300 mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  name="currentPassword" type={showPwd ? 'text' : 'password'} required
                  value={pwdForm.currentPassword}
                  onChange={(e) => setPwdForm(p => ({ ...p, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  className="earth-input pr-10"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-200 text-sm">
                  {showPwd ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-earth-300 mb-1.5">New Password</label>
              <input
                name="newPassword" type={showPwd ? 'text' : 'password'} required
                value={pwdForm.newPassword}
                onChange={(e) => setPwdForm(p => ({ ...p, newPassword: e.target.value }))}
                placeholder="Min 8 characters"
                className="earth-input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-earth-300 mb-1.5">Confirm New Password</label>
              <input
                name="confirmPassword" type={showPwd ? 'text' : 'password'} required
                value={pwdForm.confirmPassword}
                onChange={(e) => setPwdForm(p => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Repeat new password"
                className={`earth-input ${pwdForm.confirmPassword && pwdForm.newPassword !== pwdForm.confirmPassword ? 'border-red-500' : ''}`}
              />
              {pwdForm.confirmPassword && pwdForm.newPassword !== pwdForm.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">⚠ Passwords do not match</p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving || (pwdForm.confirmPassword && pwdForm.newPassword !== pwdForm.confirmPassword)}
                className="earth-btn-primary px-6 py-2.5 text-sm disabled:opacity-60 flex items-center gap-2">
                {saving ? <><div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" /> Changing…</> : '🔒 Change Password'}
              </button>
              <button type="button" onClick={() => setTab('view')} className="earth-btn-outline px-6 py-2.5 text-sm">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
