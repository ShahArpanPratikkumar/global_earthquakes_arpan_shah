import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard',  icon: '⚡', label: 'Dashboard'    },
    ],
  },
  {
    label: 'Seismic Data',
    items: [
      { to: '/earthquakes', icon: '📋', label: 'Earthquakes'   },
      { to: '/analytics',   icon: '📊', label: 'Analytics'     },
    ],
  },
  {
    label: 'Explore',
    items: [
      { to: '/map',         icon: '🗺️', label: 'Live Map'      },
      { to: '/countries',   icon: '🌎', label: 'Countries'     },
      { to: '/news',        icon: '📰', label: 'News Center'   },
    ],
  },
  {
    label: 'Education',
    items: [
      { to: '/learn',       icon: '📚', label: 'Learn Center'  },
      { to: '/save-earth',  icon: '🌱', label: 'Save The Earth'},
      { to: '/ngos',        icon: '🤝', label: 'NGO Directory' },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/profile',     icon: '👤', label: 'Profile'       },
      { to: '/settings',    icon: '⚙️', label: 'Settings'      },
    ],
  },
];

const adminGroup = {
  label: 'Administration',
  items: [
    { to: '/admin', icon: '🛡️', label: 'Admin Panel' },
  ],
};

export default function Sidebar() {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((s) => s.ui);
  const { user } = useSelector((s) => s.auth);

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-earth-950/60 backdrop-blur-sm md:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col
          bg-earth-900 border-r border-earth-700/40
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-64' : 'w-0 md:w-16'} overflow-hidden`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-earth-700/40 flex-shrink-0">
          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-earth-400 to-earth-700 flex items-center justify-center text-base">
            🌍
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold text-earth-100 text-base whitespace-nowrap">
              GeoSentinel
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              {sidebarOpen && (
                <p className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-earth-600">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                      isActive
                        ? 'bg-earth-600/50 text-earth-200 shadow-inner'
                        : 'text-earth-500 hover:text-earth-200 hover:bg-earth-700/40'
                    }`
                  }
                >
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="whitespace-nowrap transition-opacity">{item.label}</span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}

          {/* Admin-only group */}
          {user?.role === 'admin' && (
            <div className="mb-4">
              {sidebarOpen && (
                <p className="px-4 pb-1 text-[10px] font-semibold uppercase tracking-widest text-red-600/80">
                  {adminGroup.label}
                </p>
              )}
              {adminGroup.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                      isActive
                        ? 'bg-red-900/40 text-red-300 shadow-inner'
                        : 'text-red-500/70 hover:text-red-300 hover:bg-red-900/20'
                    }`
                  }
                >
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  {sidebarOpen && (
                    <span className="whitespace-nowrap transition-opacity">{item.label}</span>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </nav>


        {/* User + Logout */}
        <div className="border-t border-earth-700/40 p-3 flex-shrink-0">
          {sidebarOpen && user && (
            <div className="flex items-center gap-2.5 px-2 py-2 mb-2 rounded-xl bg-earth-800/60">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-earth-400 to-earth-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {(user.name || user.username || 'U')[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-earth-200 text-xs font-semibold truncate">{user.name || user.username}</p>
                <p className="text-earth-500 text-[10px] truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-earth-500 hover:text-red-400 hover:bg-red-900/20 text-sm font-medium transition-all"
          >
            <span className="text-base flex-shrink-0">🚪</span>
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
