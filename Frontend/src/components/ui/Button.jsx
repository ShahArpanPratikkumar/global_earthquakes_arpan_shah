/**
 * @file Button.jsx
 * @description Reusable accessible Button component.
 *              Supports multiple variants, sizes, loading state, and icon slots.
 */

import React from 'react';

const VARIANTS = {
  primary: 'bg-orange-500 hover:bg-orange-600 text-white border-transparent',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-white border-transparent',
  outline: 'bg-transparent hover:bg-slate-800 text-orange-400 border-orange-400',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
  ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 border-transparent',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

/**
 * @param {{
 *   children: React.ReactNode,
 *   variant?: 'primary'|'secondary'|'outline'|'danger'|'ghost',
 *   size?: 'sm'|'md'|'lg',
 *   isLoading?: boolean,
 *   disabled?: boolean,
 *   leftIcon?: React.ReactNode,
 *   rightIcon?: React.ReactNode,
 *   className?: string,
 *   [key: string]: any
 * }} props
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  ...rest
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      className={`${baseClasses} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {!isLoading && leftIcon && <span aria-hidden="true">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
    </button>
  );
};

export default Button;
