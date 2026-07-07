/**
 * Risk Calculator Utilities
 * Pure functions — no side effects, fully tested
 */

export const getMagnitudeLevel = (mag) => {
  const m = parseFloat(mag);
  if (isNaN(m)) return 'unknown';
  if (m < 2.5)  return 'micro';
  if (m < 4.5)  return 'minor';
  if (m < 6.0)  return 'moderate';
  if (m < 7.0)  return 'strong';
  if (m < 8.0)  return 'major';
  return 'extreme';
};

export const getMagnitudeLabel = (mag) => {
  const level = getMagnitudeLevel(mag);
  const labels = {
    micro:    'Micro',
    minor:    'Minor',
    moderate: 'Moderate',
    strong:   'Strong',
    major:    'Major',
    extreme:  'Extreme',
    unknown:  'Unknown',
  };
  return labels[level];
};

export const getRiskColor = (mag) => {
  const m = parseFloat(mag);
  if (isNaN(m)) return '#94a3b8';
  if (m < 2.5)  return '#22c55e';   // green
  if (m < 4.5)  return '#84cc16';   // lime
  if (m < 6.0)  return '#f97316';   // orange
  if (m < 7.0)  return '#ef4444';   // red
  if (m < 8.0)  return '#dc2626';   // deep red
  return '#9f1239';                  // crimson
};

export const getRiskBgClass = (mag) => {
  const m = parseFloat(mag);
  if (isNaN(m)) return 'bg-slate-100 text-slate-700 border-slate-200';
  if (m < 2.5)  return 'bg-green-50  text-green-800  border-green-200';
  if (m < 4.5)  return 'bg-lime-50   text-lime-800   border-lime-200';
  if (m < 6.0)  return 'bg-orange-50 text-orange-800 border-orange-200';
  if (m < 7.0)  return 'bg-red-50    text-red-800    border-red-200';
  if (m < 8.0)  return 'bg-red-100   text-red-900    border-red-300';
  return 'bg-rose-900 text-white border-rose-700';
};

export const getDepthLabel = (depth) => {
  const d = parseFloat(depth);
  if (isNaN(d))  return 'Unknown';
  if (d < 70)    return 'Shallow';
  if (d < 300)   return 'Intermediate';
  return 'Deep';
};

export const getDepthColor = (depth) => {
  const d = parseFloat(depth);
  if (isNaN(d))  return '#94a3b8';
  if (d < 70)    return '#f97316';   // shallow = more dangerous
  if (d < 300)   return '#3b82f6';   // intermediate
  return '#8b5cf6';                  // deep
};

export const getCountryRiskLevel = (avgMag, totalCount) => {
  const score = (parseFloat(avgMag) || 0) * Math.log10(Math.max(totalCount, 1) + 1);
  if (score < 3)   return { level: 'Low',      color: 'text-green-600 bg-green-50  border-green-200' };
  if (score < 6)   return { level: 'Moderate', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
  if (score < 9)   return { level: 'High',     color: 'text-orange-700 bg-orange-50 border-orange-200' };
  return                  { level: 'Critical', color: 'text-red-700    bg-red-50    border-red-200' };
};

export const formatMagnitude = (mag) => {
  const m = parseFloat(mag);
  return isNaN(m) ? 'N/A' : `M ${m.toFixed(1)}`;
};

export const formatDepth = (depth) => {
  const d = parseFloat(depth);
  return isNaN(d) ? 'N/A' : `${d.toFixed(1)} km`;
};

export const formatCoordinate = (val, type) => {
  const v = parseFloat(val);
  if (isNaN(v)) return 'N/A';
  const abs = Math.abs(v).toFixed(4);
  if (type === 'lat') return `${abs}° ${v >= 0 ? 'N' : 'S'}`;
  return `${abs}° ${v >= 0 ? 'E' : 'W'}`;
};

export const getTimeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60)     return `${diff}s ago`;
  if (diff < 3600)   return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff/3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff/86400)}d ago`;
  return date.toLocaleDateString();
};
