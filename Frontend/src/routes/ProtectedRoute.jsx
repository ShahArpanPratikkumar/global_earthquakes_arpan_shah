import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          <p className="text-slate-400 font-medium">Verifying Session Security...</p>
        </div>
      </div>
    );
  }

  // Redirect to /login and store the attempted location for potential return
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
