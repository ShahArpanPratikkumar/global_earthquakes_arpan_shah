/**
 * @file AppRoutes.jsx
 * @description Central React Router v6 route configuration. Includes public, protected, and admin routes.
 * @module routes/AppRoutes
 */

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';
import Layout        from '../components/layout/Layout';
import PublicLayout   from '../components/layout/PublicLayout';

// ── Adaptive Layout Wrapper ────────────────────────────────────────────────
function AdaptiveLayout() {
  const { isAuthenticated } = useSelector((s) => s.auth);
  return isAuthenticated ? <Layout /> : <PublicLayout />;
}

// ── Auth (no lazy — fast paths) ───────────────────────────────────────────
import Login          from '../pages/auth/Login';
import Register       from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword  from '../pages/auth/ResetPassword';
import VerifyEmail    from '../pages/auth/VerifyEmail';

// ── Public pages (lazy) ───────────────────────────────────────────────────
const HomePage          = lazy(() => import('../pages/home/HomePage'));
const MapPage           = lazy(() => import('../pages/map/MapPage'));
const CountriesPage     = lazy(() => import('../pages/countries/CountriesPage'));
const CountryDetailPage = lazy(() => import('../pages/countries/CountryDetailPage'));
const NewsPage          = lazy(() => import('../pages/news/NewsPage'));
const LearnPage         = lazy(() => import('../pages/learn/LearnPage'));
const SaveEarthPage     = lazy(() => import('../pages/save-earth/SaveEarthPage'));
const NgosPage          = lazy(() => import('../pages/ngos/NgosPage'));

// ── Protected pages (lazy) ────────────────────────────────────────────────
const Dashboard        = lazy(() => import('../pages/dashboard/Dashboard'));
const Earthquakes      = lazy(() => import('../pages/earthquakes/Earthquakes'));
const Analytics        = lazy(() => import('../pages/seismic-reports/SeismicReports'));
const EarthquakeDetail = lazy(() => import('../pages/earthquake-details/EarthquakeDetails'));
const Profile          = lazy(() => import('../pages/profile/Profile'));
const Settings         = lazy(() => import('../pages/settings/Settings'));
const AdminPanel       = lazy(() => import('../pages/admin/AdminPanel'));

// ── Loader fallback ───────────────────────────────────────────────────────
const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-earth-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-earth-400 border-t-transparent animate-spin" />
      <p className="text-earth-500 text-sm font-medium">Loading…</p>
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ── Auth routes (standalone, no layout) ───────────────── */}
        <Route path="/login"           element={<Login />}          />
        <Route path="/register"        element={<Register />}       />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />}  />
        <Route path="/verify-email"    element={<VerifyEmail />}    />

        {/* ── HomePage always remains in PublicLayout ───────────────── */}
        <Route element={<PublicLayout />}>
          <Route path="/"            element={<HomePage />}          />
        </Route>

        {/* ── Adaptive routes (Layout if logged in, PublicLayout if not) ── */}
        <Route element={<AdaptiveLayout />}>
          <Route path="/map"         element={<MapPage />}           />
          <Route path="/countries"   element={<CountriesPage />}     />
          <Route path="/countries/:country" element={<CountryDetailPage />} />
          <Route path="/news"        element={<NewsPage />}          />
          <Route path="/learn"       element={<LearnPage />}         />
          <Route path="/save-earth"  element={<SaveEarthPage />}     />
          <Route path="/ngos"        element={<NgosPage />}          />
        </Route>

        {/* ── Protected dashboard routes ────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard"           element={<Dashboard />}        />
            <Route path="/earthquakes"         element={<Earthquakes />}      />
            <Route path="/analytics"           element={<Analytics />}        />
            <Route path="/earthquake/:id"      element={<EarthquakeDetail />} />
            <Route path="/profile"             element={<Profile />}          />
            <Route path="/settings"            element={<Settings />}         />
            <Route path="/admin"               element={<AdminPanel />}       />
          </Route>
        </Route>

        {/* ── Catch-all ─────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}