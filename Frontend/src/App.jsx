/**
 * @file App.jsx
 * @description Root React component. Wraps routing, startup loader, and global providers.
 * @module App
 */

import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import AppRoutes from './routes/AppRoutes';
import { fetchProfile } from './store/slices/authSlice';
import StartupLoader from './components/layout/StartupLoader';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();
  const token    = useSelector((s) => s.auth.token);
  const theme    = useSelector((s) => s.ui.theme);
  
  const [showLoader, setShowLoader] = useState(() => {
    // Only show loader on the very first visit in this session
    return !sessionStorage.getItem('startup_loader_shown');
  });

  const handleLoaderComplete = () => {
    setShowLoader(false);
    sessionStorage.setItem('startup_loader_shown', 'true');
  };

  // Auto-login: refresh user profile if JWT is stored
  useEffect(() => {
    if (token) dispatch(fetchProfile());
  }, [dispatch, token]);

  // Apply theme class to <html> whenever Redux theme changes
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <HelmetProvider>
      {showLoader && <StartupLoader onComplete={handleLoaderComplete} />}
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            background: '#2D1F15',
            border: '1px solid rgba(193,154,107,0.2)',
            color: '#F5EDE0',
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;