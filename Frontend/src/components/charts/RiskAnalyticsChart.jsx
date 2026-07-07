/**
 * @file RiskAnalyticsChart.jsx
 * @description Recharts chart visualizing computed risk scores across geographic regions.
 * @module components/charts/RiskAnalyticsChart
 */

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

const RiskAnalyticsChart = ({ data = [] }) => {
  const chartData = (data || [])
    .filter(Boolean)
    .map(item => ({
      magnitude: item._id !== undefined && item._id !== null ? `M ${item._id}` : 'Unknown',
      avgDepth: parseFloat(item.avgDepth || 0).toFixed(1),
      count: item.count || 0
    })).sort((a, b) => {
      const aMag = parseFloat(a.magnitude.toString().replace('M ', '')) || 0;
      const bMag = parseFloat(b.magnitude.toString().replace('M ', '')) || 0;
      return aMag - bMag;
    });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-800 text-white p-3 rounded-lg shadow-xl text-xs space-y-1.5 backdrop-blur-md">
          <p className="font-bold text-slate-200">Magnitude: {payload[0].payload.magnitude}</p>
          <p className="flex items-center justify-between space-x-4">
            <span className="text-slate-400">Average Depth:</span>
            <span className="font-bold text-rose-400">{payload[0].value} km</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-96 flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Risk Analytics: Depth by Magnitude
        </h3>
        <p className="text-xs text-slate-400 mt-1">Shallower earthquakes often present higher surface risks</p>
      </div>

      <div className="flex-1 min-h-0 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorDepth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis 
                dataKey="magnitude" 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                reversed={true} // Reversed because shallower depth (smaller number) is higher risk
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(244, 63, 94, 0.2)', strokeWidth: 2 }} />
              <Area 
                type="monotone" 
                dataKey="avgDepth" 
                stroke="#f43f5e" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorDepth)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">
            No risk data available
          </div>
        )}
      </div>
    </Card>
  );
};

export default RiskAnalyticsChart;