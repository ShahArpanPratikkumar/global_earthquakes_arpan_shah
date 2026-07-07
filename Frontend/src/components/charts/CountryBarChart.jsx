import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '../ui/Card';

const CountryBarChart = ({ data = [], loading = false }) => {
  // Format data for Recharts, handling MongoDB aggregation output style
  const chartData = (data || [])
    .filter(Boolean)
    .map(item => ({
      country: item._id || 'Unknown',
      count: item.totalEarthquakes || item.count || 0,
      avgMag: parseFloat(item.avgMagnitude || item.avgMag || 0).toFixed(1)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Limit to top 8 countries for visual balance

  // Curated color sequence for visual richness
  const colors = ['#0ea5e9', '#06b6d4', '#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#eab308', '#10b981'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-800 text-white p-3 rounded-lg shadow-xl text-xs space-y-1.5 backdrop-blur-md">
          <p className="font-bold text-slate-200">{payload[0].payload.country}</p>
          <p className="flex items-center justify-between space-x-4">
            <span className="text-slate-400">Total Events:</span>
            <span className="font-bold text-primary-400">{payload[0].value}</span>
          </p>
          <p className="flex items-center justify-between space-x-4">
            <span className="text-slate-400">Avg Magnitude:</span>
            <span className="font-bold text-yellow-400">{payload[0].payload.avgMag}</span>
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
          Top Countries by Seismic Activity
        </h3>
        <p className="text-xs text-slate-400 mt-1">Total earthquake incidents recorded by country</p>
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
                dataKey="country" 
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
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">
            No country statistics available
          </div>
        )}
      </div>
    </Card>
  );
};

export default CountryBarChart;
