import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleTheme, toggleSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import earthquakeService from '../../services/earthquakeService';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((s) => s.ui);
  const { user }  = useSelector((s) => s.auth);

  const [query,        setQuery]        = useState('');
  const [suggestions,  setSuggestions]  = useState([]);
  const [searching,    setSearching]    = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);

  const searchRef  = useRef(null);
  const profileRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await earthquakeService.search(query.trim(), 1, 5);
        setSuggestions(res.data || []);
      } catch { setSuggestions([]); }
      finally  { setSearching(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  // Click outside
  useEffect(() => {
    const h = (e) => {
      if (searchRef.current  && !searchRef.current.contains(e.target))  setShowDropdown(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleSelect = (id) => {
    navigate(`/earthquake/${id}`);
    setQuery(''); setSuggestions([]); setShowDropdown(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 h-16 flex items-center justify-between px-4 gap-4
      bg-earth-50/80 dark:bg-earth-900/80 backdrop-blur-md
      border-b border-earth-200/60 dark:border-earth-700/40 shadow-earth">

      {/* Sidebar toggle */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="p-2 rounded-xl text-earth-500 hover:bg-earth-100 dark:hover:bg-earth-800 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Search */}
      <div ref={searchRef} className="relative flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400 text-sm">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search earthquakes…"
            className="earth-input pl-9 pr-8 py-2 rounded-full text-sm"
          />
          {query && (
            <button onClick={() => { setQuery(''); setSuggestions([]); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600 text-xs">
              ✕
            </button>
          )}
        </div>

        {showDropdown && (query || searching) && (
          <div className="absolute left-0 right-0 mt-2 earth-glass rounded-2xl border border-earth-200 dark:border-earth-700 shadow-glass overflow-hidden z-50">
            {searching ? (
              <div className="py-6 flex justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-earth-400 border-t-transparent animate-spin" />
              </div>
            ) : suggestions.length > 0 ? suggestions.map((eq) => (
              <button key={eq._id || eq.id} onClick={() => handleSelect(eq._id || eq.id)}
                className="w-full text-left px-4 py-3 hover:bg-earth-100/50 dark:hover:bg-earth-800/50 transition-colors border-b border-earth-100/50 dark:border-earth-800/30 last:border-0">
                <p className="text-sm font-medium text-earth-800 dark:text-earth-200 truncate">{eq.place || 'Unknown'}</p>
                <div className="flex gap-3 mt-0.5 text-xs text-earth-500">
                  <span className="font-semibold text-earth-600 dark:text-earth-400">M {eq.mag}</span>
                  <span>·</span>
                  <span>{eq.depth} km depth</span>
                  <span>·</span>
                  <span>{new Date(eq.time).toLocaleDateString()}</span>
                </div>
              </button>
            )) : (
              <p className="py-6 text-center text-sm text-earth-400">No results found</p>
            )}
          </div>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-xl text-earth-500 hover:bg-earth-100 dark:hover:bg-earth-800 transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Alert bell */}
        <button className="relative p-2 rounded-xl text-earth-500 hover:bg-earth-100 dark:hover:bg-earth-800 transition-colors">
          🔔
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
        </button>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full
              border border-earth-200 dark:border-earth-700
              bg-earth-50 dark:bg-earth-800
              hover:bg-earth-100 dark:hover:bg-earth-700 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-earth-400 to-earth-700 text-white text-xs font-bold flex items-center justify-center">
              {(user?.name || user?.username || 'U')[0].toUpperCase()}
            </div>
            <span className="hidden md:block text-xs font-semibold text-earth-700 dark:text-earth-300 max-w-[80px] truncate">
              {user?.name || user?.username || 'User'}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 earth-glass rounded-2xl border border-earth-200 dark:border-earth-700 shadow-glass overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-earth-100 dark:border-earth-800">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-earth-400">Signed in as</p>
                <p className="text-sm font-bold text-earth-800 dark:text-earth-100 truncate mt-0.5">{user?.email}</p>
              </div>
              {[
                { label: '👤 My Profile', to: '/profile'  },
                { label: '⚙️ Settings',   to: '/settings' },
              ].map((item) => (
                <button key={item.to} onClick={() => { navigate(item.to); setProfileOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-earth-700 dark:text-earth-300 hover:bg-earth-100/50 dark:hover:bg-earth-800/50 transition-colors">
                  {item.label}
                </button>
              ))}
              <div className="border-t border-earth-100 dark:border-earth-800">
                <button onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  🚪 Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
