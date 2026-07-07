import React from 'react';

export const Badge = ({ 
  children, 
  variant = 'primary', // 'primary' | 'success' | 'warning' | 'danger' | 'info'
  className = '' 
}) => {
  const variants = {
    primary: 'bg-primary-500/10 text-primary-600 border-primary-500/20 dark:text-primary-400',
    success: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
    danger: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
    info: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 dark:text-cyan-400',
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const SeverityBadge = ({ mag }) => {
  const m = parseFloat(mag);
  
  if (isNaN(m)) {
    return <Badge variant="primary">Unknown</Badge>;
  }
  
  if (m < 4.5) {
    return <Badge variant="success">Minor (M{m.toFixed(1)})</Badge>;
  } else if (m >= 4.5 && m < 6.0) {
    return <Badge variant="warning">Moderate (M{m.toFixed(1)})</Badge>;
  } else if (m >= 6.0 && m < 7.0) {
    return <Badge variant="danger" className="border-rose-500/40 animate-pulse">Strong (M{m.toFixed(1)})</Badge>;
  } else {
    return (
      <Badge 
        variant="danger" 
        className="bg-red-600 text-white border-red-700 animate-bounce uppercase px-3 py-1 font-bold text-[10px]"
      >
        Critical (M{m.toFixed(1)})
      </Badge>
    );
  }
};

export const DepthBadge = ({ depth }) => {
  const d = parseFloat(depth);

  if (isNaN(d)) {
    return <Badge variant="primary">Unknown</Badge>;
  }

  if (d < 70) {
    return <Badge variant="info">Shallow ({d.toFixed(0)}km)</Badge>;
  } else if (d >= 70 && d < 300) {
    return <Badge variant="primary">Intermediate ({d.toFixed(0)}km)</Badge>;
  } else {
    return <Badge variant="warning" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">Deep ({d.toFixed(0)}km)</Badge>;
  }
};
