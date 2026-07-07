import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/Card';

const TrendLineChart = ({ data = [] }) => {
  // Sort and format the monthly aggregation data
  const formattedData = React.useMemo(() => {
    if (!data.length) return [];

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return [...data]
      .filter(Boolean)
      .map(item => {
        const year = item.year || item._id?.year || new Date().getFullYear();
        const monthNum = item.month || item._id?.month || 1;
        return {
          year,
          monthNum,
          label: `${monthNames[Math.max(0, Math.min(11, monthNum - 1))]} ${year}`,
          count: item.count || 0,
          avgMag: parseFloat(item.avgMagnitude || item.avgMag || 0).toFixed(2)
        };
      })
      // Sort chronologically
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.monthNum - b.monthNum;
      });
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-800 text-white p-3 rounded-lg shadow-xl text-xs space-y-1.5 backdrop-blur-md">
          <p className="font-bold text-slate-200">{payload[0].payload.label}</p>
          <p className="flex items-center justify-between space-x-6">
            <span className="text-slate-400">Earthquake Count:</span>
            <span className="font-bold text-primary-400">{payload[0].payload.count}</span>
          </p>
          <p className="flex items-center justify-between space-x-6">
            <span className="text-slate-400">Avg Magnitude:</span>
            <span className="font-bold text-yellow-400">{payload[0].payload.avgMag} M</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-96 flex flex-col justify-between col-span-1 md:col-span-2">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Seismic Activity Trend
        </h3>
        <p className="text-xs text-slate-400 mt-1">Timeline of monthly earthquake occurrences vs average magnitude</p>
      </div>

      <div className="flex-1 min-h-0 w-full">
        {formattedData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={formattedData}
              margin={{ top: 10, right: -10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis 
                dataKey="label" 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[0, 10]}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="count" 
                name="Incident Count"
                stroke="#0ea5e9" 
                strokeWidth={3}
                activeDot={{ r: 6 }}
                dot={{ r: 3, strokeWidth: 1 }}
                animationDuration={1200}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="avgMag" 
                name="Avg Magnitude"
                stroke="#eab308" 
                strokeWidth={2}
                dot={{ r: 2 }}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">
            No activity trend data available
          </div>
        )}
      </div>
    </Card>
  );
};

export default TrendLineChart;
