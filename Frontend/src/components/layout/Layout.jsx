import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import Sidebar from './Sidebar';
import Navbar  from './Navbar';

export default function Layout() {
  const dispatch    = useDispatch();
  const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);
  const theme       = useSelector((s) => s.ui.theme);

  // Sync Tailwind dark class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      dispatch(setSidebarOpen(window.innerWidth >= 768));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  return (
    <div className="flex min-h-screen bg-earth-50 dark:bg-earth-950 text-earth-900 dark:text-earth-100 transition-colors duration-300">
      <Sidebar />
      <div className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${sidebarOpen ? 'md:pl-64' : 'md:pl-16'}`}>
        <Navbar />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
