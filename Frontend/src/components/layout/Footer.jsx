/**
 * @file Footer.jsx
 * @description Application footer with copyright, links, and social media icons.
 * @module components/layout/Footer
 */

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-earth-900 dark:bg-earth-950 border-t border-earth-700/40 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌍</span>
              <span className="font-display font-bold text-earth-200 text-lg">GeoSentinel</span>
            </div>
            <p className="text-earth-500 text-sm leading-relaxed">
              Real-time earthquake monitoring and global seismic intelligence platform.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-earth-300 font-semibold text-sm mb-3 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2">
              {[
                { to: '/map',       label: 'Live Map'       },
                { to: '/countries', label: 'Country Explorer'},
                { to: '/news',      label: 'News Center'    },
                { to: '/dashboard', label: 'Dashboard'      },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-earth-500 hover:text-earth-300 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h4 className="text-earth-300 font-semibold text-sm mb-3 uppercase tracking-wider">Learn</h4>
            <ul className="space-y-2">
              {[
                { to: '/learn',      label: 'Learn Center'   },
                { to: '/save-earth', label: 'Save The Earth' },
                { to: '/ngos',       label: 'NGO Directory'  },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-earth-500 hover:text-earth-300 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Data */}
          <div>
            <h4 className="text-earth-300 font-semibold text-sm mb-3 uppercase tracking-wider">Data Sources</h4>
            <ul className="space-y-2 text-sm text-earth-500">
              <li>USGS Earthquake Hazards</li>
              <li>EMSC European-Mediterranean</li>
              <li>GFZ German Research Centre</li>
              <li>IRIS Seismic Data Services</li>
            </ul>
          </div>
        </div>

        <div className="divider-earth mt-10 mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-earth-600 text-sm">
            © 2024 GeoSentinel — Global Earthquake Intelligence Platform
          </p>
          <p className="text-earth-700 text-xs">
            Data from USGS · Powered by MongoDB & React
          </p>
        </div>
      </div>
    </footer>
  );
}