/**
 * @file RegisterForm.jsx
 * @description User registration form with field-level validation and error display.
 * @module components/forms/RegisterForm
 */

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/slices/authSlice';
import { Mail, User, KeyRound, AlertTriangle } from 'lucide-react';

const RegisterForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('Full name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email address is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirming password is required'),
    }),
    onSubmit: async (values) => {
      const { name, email, password } = values;
      const resultAction = await dispatch(registerUser({ name, email, password }));
      if (registerUser.fulfilled.match(resultAction)) {
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

      {/* Name Input */}
      <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          Full Name
        </label>
        <div className="relative">
          <input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            className={`w-full text-sm rounded-lg border bg-slate-50 dark:bg-slate-800 p-2.5 pl-10 text-slate-800 dark:text-slate-100 outline-none transition-all ${
              formik.touched.name && formik.errors.name
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-slate-300 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
            }`}
          />
          <User size={18} className="absolute left-3.5 top-3 text-slate-400" />
        </div>
        {formik.touched.name && formik.errors.name ? (
          <p className="mt-1 text-xs font-semibold text-red-500">{formik.errors.name}</p>
        ) : null}
      </div>

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
            placeholder="john@company.com"
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
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          Password
        </label>
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

      {/* Confirm Password Input */}
      <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            className={`w-full text-sm rounded-lg border bg-slate-50 dark:bg-slate-800 p-2.5 pl-10 text-slate-800 dark:text-slate-100 outline-none transition-all ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-slate-300 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
            }`}
          />
          <KeyRound size={18} className="absolute left-3.5 top-3 text-slate-400" />
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <p className="mt-1 text-xs font-semibold text-red-500">{formik.errors.confirmPassword}</p>
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
          'Register Account'
        )}
      </button>
    </form>
  );
};

export default RegisterForm;