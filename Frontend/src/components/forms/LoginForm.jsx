/**
 * @file LoginForm.jsx
 * @description Controlled login form with email/password validation and loading state.
 * @module components/forms/LoginForm
 */

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/slices/authSlice';
import { KeyRound, Mail, AlertTriangle } from 'lucide-react';

const LoginForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialState: {
      email: '',
      password: '',
    },
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email address is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      const resultAction = await dispatch(loginUser(values));
      if (loginUser.fulfilled.match(resultAction)) {
        if (onSuccess) onSuccess();
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Email Input */}
      <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@company.com"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={`w-full text-sm rounded-lg border bg-slate-50 dark:bg-slate-800 p-2.5 pl-10 text-slate-800 dark:text-slate-100 outline-none transition-all ${
              formik.touched.email && formik.errors.email
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-slate-300 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
            }`}
          />
          <Mail size={18} className="absolute left-3.5 top-3 text-slate-400" />
        </div>
        {formik.touched.email && formik.errors.email ? (
          <p className="mt-1 text-xs font-semibold text-red-500">{formik.errors.email}</p>
        ) : null}
      </div>

      {/* Password Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Password
          </label>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={`w-full text-sm rounded-lg border bg-slate-50 dark:bg-slate-800 p-2.5 pl-10 text-slate-800 dark:text-slate-100 outline-none transition-all ${
              formik.touched.password && formik.errors.password
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-slate-300 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
            }`}
          />
          <KeyRound size={18} className="absolute left-3.5 top-3 text-slate-400" />
        </div>
        {formik.touched.password && formik.errors.password ? (
          <p className="mt-1 text-xs font-semibold text-red-500">{formik.errors.password}</p>
        ) : null}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-4 text-sm transition-all focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50"
      >
        {loading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        ) : (
          'Access Portal'
        )}
      </button>
    </form>
  );
};

export default LoginForm;