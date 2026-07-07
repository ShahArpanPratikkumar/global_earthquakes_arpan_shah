/**
 * @file MagnitudeDistributionChart.jsx
 * @description Recharts bar chart for magnitude distribution across 0-10 scale.
 * @module components/charts/MagnitudeDistributionChart
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '../ui/Card';

const MagnitudeDistributionChart = ({ data = [] }) => {
  const chartData = (data || [])
    .filter(Boolean)
    .map(item => ({
      magnitude: item._id !== undefined && item._id !== null ? `M ${item._id}` : 'Unknown',
      count: item.count || 0,
      avgDepth: parseFloat(item.avgDepth || 0).toFixed(1)
    })).sort((a, b) => {
      // Sort by magnitude
      const aMag = parseFloat(a.magnitude.toString().replace('M ', '')) || 0;
      const bMag = parseFloat(b.magnitude.toString().replace('M ', '')) || 0;
      return aMag - bMag;
    });

  // Green to red gradient based on magnitude severity
  const getBarColor = (index, total) => {
    const ratio = index / Math.max(1, total - 1);
    if (ratio < 0.3) return '#10b981'; // Green
    if (ratio < 0.6) return '#f59e0b'; // Yellow
    if (ratio < 0.8) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-800 text-white p-3 rounded-lg shadow-xl text-xs space-y-1.5 backdrop-blur-md">
          <p className="font-bold text-slate-200">Magnitude: {payload[0].payload.magnitude}</p>
          <p className="flex items-center justify-between space-x-4">
            <span className="text-slate-400">Total Events:</span>
            <span className="font-bold text-primary-400">{payload[0].value}</span>
          </p>
          <p className="flex items-center justify-between space-x-4">
            <span className="text-slate-400">Avg Depth:</span>
            <span className="font-bold text-slate-300">{payload[0].payload.avgDepth} km</span>
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
          Magnitude Distribution
        </h3>
        <p className="text-xs text-slate-400 mt-1">Frequency of earthquakes grouped by magnitude levels</p>
      </div>

      <div className="flex-1 min-h-0 w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
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
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }} />
              <Bar 
                dataKey="count" 
                radius={[6, 6, 0, 0]}
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(index, chartData.length)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">
            No magnitude distribution data available
          </div>
        )}
      </div>
    </Card>
  );
};

export default MagnitudeDistributionChart;