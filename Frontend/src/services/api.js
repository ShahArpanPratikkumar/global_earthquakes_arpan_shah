import axios from 'axios';

// Backend is at localhost:5000, frontend at localhost:3000.
// VITE_API_URL must be set (no Vite proxy — proxy intercepts page navigations).
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 → clear auth, redirect to login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/register')) {
        window.location.href = '/login?expired=true';
      }
    }

    // 429 → rate limit
    if (error.response?.status === 429) {
      return Promise.reject(new Error('Rate limit reached. Please wait a moment and try again.'));
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
