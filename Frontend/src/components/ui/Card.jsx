import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ 
  children, 
  className = '', 
  hover = true 
}) => {
  return (
    <div 
      className={`earth-glass rounded-2xl p-5 shadow-earth transition-all duration-300 ${
        hover ? 'hover:shadow-earth-lg hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trendValue, 
  trendLabel,
  trendDirection = 'up', // 'up' | 'down' | 'neutral'
  color = 'primary', // 'primary' | 'cyan' | 'purple' | 'red'
  loading = false,
  error = null,
  onRetry
}) => {
  const colorMaps = {
    primary: 'text-primary-500 bg-primary-500/10 border-primary-500/20',
    cyan: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    red: 'text-red-500 bg-red-500/10 border-red-500/20',
  };

  const trendColors = {
    up: 'text-emerald-500 bg-emerald-500/10',
    down: 'text-rose-500 bg-rose-500/10',
    neutral: 'text-slate-500 bg-slate-500/10'
  };

  if (loading) {
    return (
      <Card className="flex flex-col justify-between h-32 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-slate-300 dark:bg-slate-700 rounded"></div>
          <div className="h-10 w-10 bg-slate-300 dark:bg-slate-700 rounded-lg"></div>
        </div>
        <div>
          <div className="h-8 w-16 bg-slate-300 dark:bg-slate-700 rounded mb-2"></div>
          <div className="h-3 w-32 bg-slate-300 dark:bg-slate-700 rounded"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col justify-center items-center h-32 border border-rose-500/20 bg-rose-500/5">
        <p className="text-xs font-semibold text-rose-500 text-center mb-2 truncate max-w-full px-2">{error}</p>
        {onRetry && (
          <button 
            onClick={onRetry} 
            className="text-xs px-2.5 py-1 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"
          >
            Retry
          </button>
        )}
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="flex flex-col justify-between h-36 border border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </span>
          {Icon && (
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colorMaps[color]}`}>
              <Icon size={20} />
            </div>
          )}
        </div>
        
        <div className="mt-2">
          <div className="text-3xl font-bold tracking-tight font-outfit text-slate-800 dark:text-slate-100">
            {value}
          </div>
          
          {(trendValue || trendLabel) && (
            <div className="flex items-center space-x-1.5 mt-2">
              {trendValue && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trendColors[trendDirection]}`}>
                  {trendValue}
                </span>
              )}
              {trendLabel && (
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                  {trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
