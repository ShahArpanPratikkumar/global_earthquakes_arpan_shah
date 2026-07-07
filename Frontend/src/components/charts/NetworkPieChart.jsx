/**
 * @file NetworkPieChart.jsx
 * @description Recharts pie chart showing earthquake distribution by seismic monitoring network.
 * @module components/charts/NetworkPieChart
 */

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../ui/Card';

const NetworkPieChart = ({ data = [] }) => {
  // Format data for Recharts, taking top 5 and grouping remainder as 'Others'
  const formattedData = React.useMemo(() => {
    if (!data.length) return [];
    
    const sorted = [...data]
      .map(item => ({
        name: (item._id || 'Unknown').toUpperCase(),
        value: item.count || 0
      }))
      .sort((a, b) => b.value - a.value);

    if (sorted.length <= 5) return sorted;

    const top5 = sorted.slice(0, 5);
    const othersCount = sorted.slice(5).reduce((sum, item) => sum + item.value, 0);
    
    return [...top5, { name: 'OTHERS', value: othersCount }];
  }, [data]);

  const COLORS = ['#0ea5e9', '#6366f1', '#a855f7', '#ec4899', '#10b981', '#64748b'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-800 text-white p-2.5 rounded-lg shadow-xl text-xs space-y-1 backdrop-blur-md">
          <p className="font-bold text-slate-200">{payload[0].name} Network</p>
          <p className="flex items-center space-x-2">
            <span className="text-slate-400">Detections:</span>
            <span className="font-bold text-primary-400">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span 
              className="h-2.5 w-2.5 rounded-full shrink-0" 
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="h-96 flex flex-col justify-between">
      <div className="mb-2">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Reporting Networks
        </h3>
        <p className="text-xs text-slate-400 mt-1">Detections grouped by seismic reporting network</p>
      </div>

      <div className="flex-1 min-h-0 w-full flex items-center justify-center">
        {formattedData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                animationDuration={800}
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-sm text-slate-400">No network distribution data</div>
        )}
      </div>
    </Card>
  );
};

export default NetworkPieChart;