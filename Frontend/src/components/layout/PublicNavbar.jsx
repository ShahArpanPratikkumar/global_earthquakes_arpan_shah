/**
 * @file PublicNavbar.jsx
 * @description Public navigation bar for unauthenticated pages with login and register links.
 * @module components/layout/PublicNavbar
 */

import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const navLinks = [
  { to: '/',           label: 'Home'     },
  { to: '/map',        label: 'Live Map' },
  { to: '/countries',  label: 'Countries'},
  { to: '/news',       label: 'News'     },
  { to: '/learn',      label: 'Learn'    },
  { to: '/ngos',       label: 'NGOs'     },
  { to: '/save-earth', label: 'Save Earth'},
];

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useSelector((s) => s.auth);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 earth-glass-dark border-b border-earth-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-earth-400 to-earth-700 flex items-center justify-center text-white font-bold text-sm shadow-glow">
            🌍
          </div>
          <span className="font-display font-bold text-lg text-earth-100 group-hover:text-earth-300 transition-colors">
            GeoSentinel
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-earth-600/40 text-earth-200'
                    : 'text-earth-400 hover:text-earth-200 hover:bg-earth-700/30'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard" className="earth-btn-primary text-sm">
              Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-earth-400 hover:text-earth-200 text-sm font-medium transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="earth-btn-primary text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-earth-400 hover:text-earth-200 hover:bg-earth-700/30 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden earth-glass-dark border-t border-earth-700/30 px-4 py-4 flex flex-col gap-1">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-earth-600/40 text-earth-200'
                    : 'text-earth-400 hover:text-earth-200 hover:bg-earth-700/30'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-earth-700/30 flex gap-2">
            <Link to="/login"    className="flex-1 text-center py-2 text-sm text-earth-400 hover:text-earth-200" onClick={() => setMobileOpen(false)}>Sign In</Link>
            <Link to="/register" className="flex-1 earth-btn-primary text-center text-sm"                        onClick={() => setMobileOpen(false)}>Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}