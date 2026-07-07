/**
 * @file StatCard.jsx
 * @description Dashboard statistics card component.
 *              Displays a metric value, label, icon, and optional trend indicator.
 */

import React from 'react';

/**
 * @param {{
 *   title: string,
 *   value: string|number,
 *   icon: React.ReactNode,
 *   trend?: { value: number, label: string },
 *   className?: string
 * }} props
 */
const StatCard = ({ title, value, icon, trend, className = '' }) => {
  const trendPositive = trend?.value >= 0;

  return (
    <div
      className={`relative overflow-hidden bg-slate-800/80 border border-slate-700 rounded-xl p-5 backdrop-blur-sm hover:border-slate-600 transition-all duration-300 group ${className}`}
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -translate-y-6 translate-x-6 group-hover:bg-orange-500/10 transition-all duration-300" aria-hidden="true" />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trendPositive ? 'text-green-400' : 'text-red-400'}`}>
              {trendPositive ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-orange-500/10 text-orange-400" aria-hidden="true">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
