/**
 * Analytics.jsx — Seismic Analytics Dashboard
 *
 * Data flow:
 *  browser → Vite proxy → backend :5000 → MongoDB aggregations
 *
 * All API responses follow: { success: true, data: [...], message: "..." }
 * The `safe()` helper handles both bare arrays and the .data wrapper.
 *
 * Charts use fixed numeric heights in ResponsiveContainer to prevent the
 * Recharts infinite resize loop that occurs inside CSS grid/flex containers.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
  LineChart, Line, AreaChart, Area,
} from 'recharts';

// ─── helpers ──────────────────────────────────────────────────────────────────
const safeNum = (v, digits = 2) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : parseFloat(n.toFixed(digits));
};

/** Safely extract an array from an allSettled result */
const extract = (settled) => {
  if (settled.status !== 'fulfilled') return [];
  const payload = settled.value?.data;           // axios response.data  = server JSON
  if (Array.isArray(payload)) return payload;     // bare array
  if (Array.isArray(payload?.data)) return payload.data; // { success, data:[] }
  return [];
};

// ─── colour palette (earth tones) ─────────────────────────────────────────────
const EARTH = ['#ca8a04', '#d97706', '#b45309', '#92400e', '#eab308', '#fde047', '#a16207', '#78350f'];
const SAFE  = (i) => EARTH[i % EARTH.length];

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub }) {
  return (
    <div className="earth-glass rounded-2xl p-5 border border-earth-700/40 flex flex-col gap-1">
      <span className="text-xl">{icon}</span>
      <p className="text-earth-500 text-[11px] font-bold uppercase tracking-wider">{label}</p>
      <p className="font-display text-2xl font-bold text-earth-100 leading-none">{value}</p>
      {sub && <p className="text-earth-600 text-[11px]">{sub}</p>}
    </div>
  );
}

function ChartCard({ title, desc, children, badge }) {
  return (
    <div className="earth-glass rounded-2xl border border-earth-700/40 p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-earth-400 uppercase tracking-wider">{title}</p>
          <p className="text-[11px] text-earth-600 mt-0.5">{desc}</p>
        </div>
        {badge && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-earth-700/40 text-earth-400 font-semibold whitespace-nowrap">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Empty({ msg = 'No data available' }) {
  return (
    <div className="flex flex-col items-center justify-center h-[260px] gap-2 text-earth-600">
      <span className="text-3xl">📊</span>
      <p className="text-sm">{msg}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6 max-w-7xl animate-pulse">
      <div>
        <div className="h-8 w-64 bg-earth-800 rounded-xl" />
        <div className="h-4 w-80 bg-earth-800/60 rounded-xl mt-2" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-earth-800 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1,2,3,4,5].map(i => <div key={i} className={`h-72 bg-earth-800 rounded-2xl ${i === 3 || i === 5 ? 'md:col-span-2' : ''}`} />)}
      </div>
    </div>
  );
}

// ─── custom tooltip ───────────────────────────────────────────────────────────
const EarthTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-earth-700/60 bg-earth-900/95 px-3 py-2 text-xs shadow-xl">
      {label && <p className="font-bold text-earth-300 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: <span className="text-earth-100">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </p>
      ))}
    </div>
  );
};

// ─── main component ───────────────────────────────────────────────────────────
export default function Analytics() {
  const [rawData,  setRawData]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [lastLoad, setLastLoad] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [countryRes, networkRes, magRes, monthlyRes] = await Promise.allSettled([
        api.get('/analytics/earthquakes/country-analysis'),
        api.get('/analytics/earthquakes/network-analysis'),
        api.get('/analytics/earthquakes/magnitude-analysis'),
        api.get('/analytics/earthquakes/monthly-analysis'),
      ]);

      setRawData({
        country:   extract(countryRes),
        network:   extract(networkRes),
        magnitude: extract(magRes),
        monthly:   extract(monthlyRes),
      });
      setLastLoad(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message || 'Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── derived / normalised chart data ────────────────────────────────────────
  const countryChart = (rawData?.country || [])
    .filter(d => d && d._id)
    .map(d => ({
      name:    String(d._id).slice(0, 14),
      count:   d.totalEarthquakes || d.count || 0,
      avgMag:  safeNum(d.avgMagnitude || d.avgMag, 1),
      maxMag:  safeNum(d.maxMagnitude || d.maxMag, 1),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const networkChart = (rawData?.network || [])
    .filter(d => d && d._id)
    .map(d => ({
      name:  String(d._id).toUpperCase(),
      value: d.count || 0,
      avg:   safeNum(d.avgMag, 2),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Magnitude buckets: _id is the lower boundary number (from $bucket)
  const MAG_LABELS = { '-2':'M < 0','0':'M 0–1','1':'M 1–2','2':'M 2–3','3':'M 3–4','4':'M 4–5','5':'M 5–6','6':'M 6–7','7':'M 7–8','8':'M 8–10','other':'Other' };
  const magChart = (rawData?.magnitude || [])
    .filter(d => d !== null && d !== undefined)
    .map(d => ({
      mag:      MAG_LABELS[String(d._id)] || String(d._id ?? 'Unknown'),
      count:    d.count || 0,
      avgDepth: safeNum(d.avgDepth, 1),
    }));

  // Monthly: _id is stripped (_id: 0 projection) so year/month are at root
  const monthlyChart = (rawData?.monthly || [])
    .filter(d => d && (d.year || d._id?.year))
    .map(d => {
      const yr = d.year ?? d._id?.year ?? 0;
      const mo = d.month ?? d._id?.month ?? 1;
      return {
        label:  `${MONTH_SHORT[Math.min(11, Math.max(0, mo - 1))]} ${String(yr).slice(-2)}`,
        yr, mo,
        count:  d.count || 0,
        avgMag: safeNum(d.avgMagnitude || d.avgMag, 2),
        maxMag: safeNum(d.maxMagnitude || d.maxMag, 1),
      };
    })
    .sort((a, b) => a.yr !== b.yr ? a.yr - b.yr : a.mo - b.mo);

  // ── summary stats ──────────────────────────────────────────────────────────
  const totalFromCountry = countryChart.reduce((s, d) => s + d.count, 0);
  const topCountry       = countryChart[0]?.name || '—';
  const topMagEntry      = (rawData?.country || []).reduce((best, d) =>
    (d.maxMagnitude || 0) > (best.maxMagnitude || 0) ? d : best, {});

  // ─── UI ─────────────────────────────────────────────────────────────────────
  if (loading)  return <Skeleton />;

  if (error) {
    return (
      <>
        <Helmet><title>Analytics | GeoSentinel</title></Helmet>
        <div className="max-w-2xl space-y-4">
          <h1 className="font-display text-2xl font-bold text-earth-100">Seismic Analytics</h1>
          <div className="rounded-2xl border border-red-700/50 bg-red-900/20 p-8 text-center space-y-4">
            <p className="text-4xl">⚠️</p>
            <p className="text-sm font-semibold text-red-400">{error}</p>
            <button
              onClick={fetchAll}
              className="earth-btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Analytics | GeoSentinel</title>
        <meta name="description" content="Seismic analytics — country distribution, networks, magnitude trends and monthly activity." />
      </Helmet>

      <div className="space-y-6 max-w-7xl">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-earth-100">
              📊 Seismic Analytics
            </h1>
            <p className="text-earth-500 text-sm mt-1">
              Aggregated statistics across all seismic records
              {lastLoad && <span className="ml-2 text-earth-700">· Updated {lastLoad}</span>}
            </p>
          </div>
          <button
            onClick={fetchAll}
            className="earth-btn-outline text-sm flex items-center gap-2 flex-shrink-0"
          >
            🔄 Refresh
          </button>
        </div>

        {/* ── Summary stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="🌍" label="Active Regions"    value={rawData?.country?.length  ?? 0} sub={`Top: ${topCountry}`} />
          <StatCard icon="📡" label="Seismic Networks"  value={rawData?.network?.length  ?? 0} />
          <StatCard icon="📅" label="Months Tracked"    value={rawData?.monthly?.length  ?? 0} />
          <StatCard icon="⚡" label="Events (top 10)"   value={totalFromCountry.toLocaleString()} sub={`Max M${safeNum(topMagEntry.maxMagnitude, 1)}`} />
        </div>

        {/* ── Charts grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 1 — Country Bar Chart */}
          <ChartCard
            title="Top Countries by Event Count"
            desc="Most seismically active regions (top 10)"
            badge={`${countryChart.length} regions`}
          >
            {countryChart.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={countryChart} margin={{ top: 5, right: 5, left: -25, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(161,133,92,0.15)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#a1855c', fontSize: 9 }}
                    axisLine={false} tickLine={false}
                    angle={-35} textAnchor="end" interval={0}
                  />
                  <YAxis tick={{ fill: '#a1855c', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<EarthTooltip />} />
                  <Bar dataKey="count" name="Events" radius={[4, 4, 0, 0]}>
                    {countryChart.map((_, i) => <Cell key={i} fill={SAFE(i)} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* 2 — Network Pie Chart */}
          <ChartCard
            title="Reporting Networks"
            desc="Earthquake detections by seismic network"
            badge={`${networkChart.length} networks`}
          >
            {networkChart.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={networkChart} dataKey="value" nameKey="name"
                    cx="50%" cy="44%" innerRadius={55} outerRadius={95}
                    paddingAngle={3} animationDuration={700}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {networkChart.map((_, i) => (
                      <Cell key={i} fill={SAFE(i)} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<EarthTooltip />} formatter={(v) => [v.toLocaleString(), 'Events']} />
                  <Legend
                    iconType="circle" iconSize={8}
                    wrapperStyle={{ fontSize: 11, color: '#a1855c', paddingTop: 4 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* 3 — Monthly Trend (full width) */}
          <div className="md:col-span-2">
            <ChartCard
              title="Monthly Activity Trend"
              desc="Monthly earthquake count vs. average magnitude over time"
              badge={`${monthlyChart.length} months`}
            >
              {monthlyChart.length === 0 ? <Empty msg="No monthly data found" /> : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={monthlyChart} margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(161,133,92,0.15)" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#a1855c', fontSize: 10 }}
                      axisLine={false} tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis yAxisId="left"  tick={{ fill: '#a1855c', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 10]} tick={{ fill: '#a1855c', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<EarthTooltip />} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#a1855c' }} />
                    <Line
                      yAxisId="left" type="monotone" dataKey="count" name="Events"
                      stroke="#eab308" strokeWidth={2} dot={false} animationDuration={800}
                    />
                    <Line
                      yAxisId="right" type="monotone" dataKey="avgMag" name="Avg Mag"
                      stroke="#f97316" strokeWidth={2} dot={false} animationDuration={800}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          {/* 4 — Magnitude Distribution Bar */}
          <ChartCard
            title="Magnitude Distribution"
            desc="Earthquake count grouped by magnitude bucket"
            badge={`${magChart.length} buckets`}
          >
            {magChart.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={magChart} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(161,133,92,0.15)" />
                  <XAxis dataKey="mag" tick={{ fill: '#a1855c', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#a1855c', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<EarthTooltip />} />
                  <Bar dataKey="count" name="Events" radius={[4, 4, 0, 0]}>
                    {magChart.map((_, i) => {
                      const r = i / Math.max(1, magChart.length - 1);
                      const c = r < 0.33 ? '#22c55e' : r < 0.66 ? '#eab308' : '#ef4444';
                      return <Cell key={i} fill={c} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* 5 — Risk: Avg Depth by Magnitude (Area, reversed Y) */}
          <ChartCard
            title="Depth vs. Magnitude (Risk)"
            desc="Average focal depth per magnitude bucket — shallower = higher surface risk"
          >
            {magChart.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={magChart} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(161,133,92,0.15)" />
                  <XAxis dataKey="mag" tick={{ fill: '#a1855c', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis reversed tick={{ fill: '#a1855c', fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'km ↓', position: 'insideLeft', fill: '#a1855c', fontSize: 9 }} />
                  <Tooltip content={<EarthTooltip />} formatter={(v) => [`${v} km`, 'Avg Depth']} />
                  <Area
                    type="monotone" dataKey="avgDepth" name="Avg Depth"
                    stroke="#f43f5e" strokeWidth={2} fill="url(#riskGrad)"
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* 6 — Country avg magnitude comparison (full width horizontal bar) */}
          {countryChart.length > 0 && (
            <div className="md:col-span-2">
              <ChartCard
                title="Average Magnitude by Country"
                desc="Mean seismic magnitude per country (top 10 most active regions)"
              >
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={countryChart}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(161,133,92,0.15)" />
                    <XAxis type="number" domain={[0, 8]} tick={{ fill: '#a1855c', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#a1855c', fontSize: 10 }} axisLine={false} tickLine={false} width={75} />
                    <Tooltip content={<EarthTooltip />} />
                    <Bar dataKey="avgMag" name="Avg Magnitude" radius={[0, 4, 4, 0]}>
                      {countryChart.map((_, i) => <Cell key={i} fill={SAFE(i)} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
