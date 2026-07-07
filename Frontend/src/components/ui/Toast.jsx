/**
 * @file Toast.jsx
 * @description Toast notification component and ToastContainer.
 *              Supports success, error, warning, and info variants with auto-dismiss.
 */

import React, { useEffect } from 'react';

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const COLORS = {
  success: 'bg-green-600/90 border-green-500',
  error: 'bg-red-600/90 border-red-500',
  warning: 'bg-amber-600/90 border-amber-500',
  info: 'bg-blue-600/90 border-blue-500',
};

/**
 * @param {{
 *   id: string,
 *   message: string,
 *   type?: 'success'|'error'|'warning'|'info',
 *   duration?: number,
 *   onDismiss: (id: string) => void
 * }} props
 */
const Toast = ({ id, message, type = 'info', duration = 4000, onDismiss }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onDismiss(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-white text-sm shadow-lg animate-fade-in ${COLORS[type]}`}
    >
      <span aria-hidden="true" className="text-base font-bold">{ICONS[type]}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="text-white/70 hover:text-white ml-2 transition-colors"
      >
        ✕
      </button>
    </div>
  );
};

/**
 * Container that renders multiple Toast notifications.
 * @param {{ toasts: Array, onDismiss: Function }} props
 */
export const ToastContainer = ({ toasts, onDismiss }) => (
  <div
    aria-live="polite"
    aria-label="Notifications"
    className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80"
  >
    {toasts.map((toast) => (
      <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
    ))}
  </div>
);

export default Toast;
