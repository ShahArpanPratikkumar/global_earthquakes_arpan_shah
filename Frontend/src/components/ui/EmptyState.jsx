/**
 * @file EmptyState.jsx
 * @description Empty state placeholder component.
 *              Displayed when a list or table has no data to show.
 *              Supports custom icon, message, and action button.
 */

import React from 'react';

/**
 * @param {{
 *   icon?: React.ReactNode,
 *   title: string,
 *   description?: string,
 *   action?: React.ReactNode,
 *   className?: string
 * }} props
 */
const EmptyState = ({ icon, title, description, action, className = '' }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
      role="status"
      aria-label={title}
    >
      {icon && (
        <div className="mb-4 text-slate-500" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
