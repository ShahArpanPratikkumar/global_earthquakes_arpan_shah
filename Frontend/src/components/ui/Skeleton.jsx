import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse rounded bg-slate-200 dark:bg-slate-800 ${className}`}></div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="w-full space-y-4">
      {/* Table Header */}
      <div className="flex space-x-4 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 px-4 py-4 items-center border-b border-slate-100 dark:border-slate-800/50">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="w-full space-y-4 p-4 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl bg-white/50 dark:bg-slate-900/50 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-40" />
        <div className="flex space-x-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
      <div className="relative h-64 w-full flex items-end justify-between space-x-2 pt-8 px-2">
        {/* Fake Bars representing a chart */}
        <Skeleton className="h-[20%] w-[8%] rounded-t" />
        <Skeleton className="h-[40%] w-[8%] rounded-t" />
        <Skeleton className="h-[30%] w-[8%] rounded-t" />
        <Skeleton className="h-[75%] w-[8%] rounded-t" />
        <Skeleton className="h-[55%] w-[8%] rounded-t" />
        <Skeleton className="h-[90%] w-[8%] rounded-t" />
        <Skeleton className="h-[60%] w-[8%] rounded-t" />
        <Skeleton className="h-[45%] w-[8%] rounded-t" />
        <Skeleton className="h-[70%] w-[8%] rounded-t" />
        <Skeleton className="h-[35%] w-[8%] rounded-t" />
      </div>
    </div>
  );
};
