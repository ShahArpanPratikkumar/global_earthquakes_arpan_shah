import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { setTheme } from '../../store/slices/uiSlice';

// ── Load/save preferences from localStorage ────────────────────────────────
const PREF_KEY = 'geosentinel_preferences';

const defaultPrefs = {
  streamPings:    true,
  criticalAlerts: true,
  weeklyEmails:   false,
  minMagnitude:   2.5,
};

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    return raw ? { ...defaultPrefs, ...JSON.parse(raw) } : defaultPrefs;
  } catch { return defaultPrefs; }
}

function savePrefs(prefs) {
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}

// ── Toggle Row ─────────────────────────────────────────────────────────────
function ToggleRow({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-earth-800/40 last:border-0">
      <div className="pr-4">
        <p className="text-sm font-semibold text-earth-200">{label}</p>
        <p className="text-xs text-earth-500 mt-0.5">{desc}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 focus:outline-none ${
          checked ? 'bg-earth-400' : 'bg-earth-700'
        }`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </button>
    </div>
  );
}

export default function Settings() {
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.ui.theme);
  const [prefs, setPrefs] = useState(loadPrefs);
  const [saved, setSaved] = useState(false);

  const updatePref = (key) => (val) => {
    setPrefs((p) => ({ ...p, [key]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    savePrefs(prefs);
    setSaved(true);
    toast.success('Preferences saved!');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleThemeChange = (t) => {
    dispatch(setTheme(t));
  };

  const magLabels = {
    1.0: 'M 1.0 — All events',
    2.5: 'M 2.5 — Minor+',
    4.0: 'M 4.0 — Moderate+',
    5.5: 'M 5.5 — Strong+',
    7.0: 'M 7.0 — Major+',
  };

  return (
    <>
      <Helmet>
        <title>Settings | GeoSentinel</title>
        <meta name="description" content="Configure GeoSentinel theme, notification preferences, and alert thresholds." />
      </Helmet>

      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-earth-100">Settings</h1>
            <p className="text-earth-500 text-sm mt-1">Customize your GeoSentinel experience</p>
          </div>
          <button
            onClick={handleSave}
            className={`earth-btn-primary px-5 py-2.5 text-sm flex items-center gap-2 transition-all ${saved ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            {saved ? '✅ Saved!' : '💾 Save Preferences'}
          </button>
        </div>

        {/* ── Theme Card ───────────────────────────────────────────── */}
        <div className="earth-glass rounded-2xl border border-earth-700/40 overflow-hidden">
          <div className="px-5 py-4 border-b border-earth-800/40 flex items-center gap-2">
            <span>🎨</span>
            <h2 className="font-bold text-earth-200 text-sm uppercase tracking-wider">Visual Theme</h2>
          </div>
          <div className="p-5 grid grid-cols-2 gap-3">
            {[
              { key: 'light', icon: '☀️', title: 'Light Mode',       desc: 'Clean white panels' },
              { key: 'dark',  icon: '🌙', title: 'Dark Mode',         desc: 'NASA-style deep slate' },
            ].map((t) => (
              <button key={t.key} onClick={() => handleThemeChange(t.key)}
                className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                  theme === t.key
                    ? 'border-earth-400/60 bg-earth-600/20 text-earth-200'
                    : 'border-earth-700/40 text-earth-500 hover:border-earth-600/40 hover:text-earth-300'
                }`}>
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <p className="text-sm font-bold">{t.title}</p>
                  <p className="text-xs text-earth-500 mt-0.5">{t.desc}</p>
                </div>
                {theme === t.key && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-earth-400 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Notification Card ─────────────────────────────────────── */}
        <div className="earth-glass rounded-2xl border border-earth-700/40 overflow-hidden">
          <div className="px-5 py-4 border-b border-earth-800/40 flex items-center gap-2">
            <span>🔔</span>
            <h2 className="font-bold text-earth-200 text-sm uppercase tracking-wider">Notifications & Alerts</h2>
          </div>
          <div className="px-5 py-2">
            <ToggleRow
              label="Real-time Stream Pings"
              desc="Notify immediately when new earthquake events sync"
              checked={prefs.streamPings}
              onChange={updatePref('streamPings')}
            />
            <ToggleRow
              label="Critical Alarm (M6.0+)"
              desc="Play distinct alert warning on strong earthquakes"
              checked={prefs.criticalAlerts}
              onChange={updatePref('criticalAlerts')}
            />
            <ToggleRow
              label="Weekly Summary Emails"
              desc="Receive aggregated weekly CSV reports on seismic movements"
              checked={prefs.weeklyEmails}
              onChange={updatePref('weeklyEmails')}
            />
          </div>
        </div>

        {/* ── Magnitude Threshold Card ──────────────────────────────── */}
        <div className="earth-glass rounded-2xl border border-earth-700/40 overflow-hidden">
          <div className="px-5 py-4 border-b border-earth-800/40 flex items-center gap-2">
            <span>⚡</span>
            <h2 className="font-bold text-earth-200 text-sm uppercase tracking-wider">Alert Thresholds</h2>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-earth-300">Minimum Magnitude Reporting Limit</label>
                <span className="font-display font-bold text-earth-200 bg-earth-800 px-3 py-1 rounded-lg text-sm">
                  {prefs.minMagnitude.toFixed(1)}
                </span>
              </div>
              <input
                type="range" min={1.0} max={8.0} step={0.5}
                value={prefs.minMagnitude}
                onChange={(e) => updatePref('minMagnitude')(parseFloat(e.target.value))}
                className="w-full h-2 rounded-full appearance-none accent-earth-400 cursor-pointer bg-earth-800"
              />
              <div className="flex justify-between text-xs text-earth-600 mt-1.5">
                <span>M 1.0</span>
                <span>M 4.5</span>
                <span>M 8.0</span>
              </div>
              {/* Label */}
              <div className="mt-3 px-3 py-2 rounded-lg bg-earth-800/60 border border-earth-700/40">
                <p className="text-xs text-earth-400">
                  Current filter: <span className="font-bold text-earth-200">{magLabels[prefs.minMagnitude] || `M ${prefs.minMagnitude.toFixed(1)}+`}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Data & Privacy Card ───────────────────────────────────── */}
        <div className="earth-glass rounded-2xl border border-earth-700/40 overflow-hidden">
          <div className="px-5 py-4 border-b border-earth-800/40 flex items-center gap-2">
            <span>🔐</span>
            <h2 className="font-bold text-earth-200 text-sm uppercase tracking-wider">Data & Security</h2>
          </div>
          <div className="p-5 space-y-3">
            {[
              {
                icon: '🗑️',
                title: 'Clear Session Cache',
                desc: 'Remove locally stored earthquake data and reload fresh from server',
                action: () => {
                  sessionStorage.clear();
                  toast.info('Session cache cleared. Reload the page to refresh data.');
                },
                danger: false,
              },
              {
                icon: '📤',
                title: 'Export My Data',
                desc: 'Download your account info as JSON',
                action: () => toast.info('Export feature coming soon.'),
                danger: false,
              },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between p-3 rounded-xl bg-earth-800/30 border border-earth-700/30">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-earth-200">{item.title}</p>
                    <p className="text-xs text-earth-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <button onClick={item.action}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    item.danger
                      ? 'border-red-700/50 text-red-400 hover:bg-red-900/30'
                      : 'border-earth-700/50 text-earth-400 hover:bg-earth-700/40 hover:text-earth-200'
                  }`}>
                  {item.danger ? '⚠️ Run' : 'Run'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save button (bottom) */}
        <div className="flex justify-end pb-6">
          <button onClick={handleSave}
            className={`earth-btn-primary px-8 py-3 text-sm flex items-center gap-2 ${saved ? 'bg-green-600 hover:bg-green-700' : ''}`}>
            {saved ? '✅ All Saved!' : '💾 Save All Preferences'}
          </button>
        </div>
      </div>
    </>
  );
}
