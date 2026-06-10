import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import {
  Search,
  Bell,
  User,
  Mic,
  MicOff,
  Sun,
  Moon,
} from 'lucide-react';

export default function TopBar() {
  const user = useAuthStore((s) => s.user);
  const { theme, toggleTheme, wakeWordEnabled } = useSettingsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Could implement global search
      console.log('Search:', searchQuery);
    }
  };

  return (
    <header
      className="h-16 bg-white dark:bg-dark-surface border-b border-outline-variant/20 dark:border-dark-surface-container-high/50 
        flex items-center justify-between px-6 shrink-0 z-20"
      role="banner"
    >
      {/* Left: Search */}
      <form onSubmit={handleSearch} className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records, doctors..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container-low dark:bg-dark-surface-container
              text-sm text-on-surface dark:text-dark-on-surface placeholder:text-outline
              border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
            aria-label="Search"
            id="global-search"
          />
        </div>
      </form>

      {/* Center: Quick links */}
      <nav className="hidden lg:flex items-center gap-6 mx-8">
        <Link
          to="/records"
          className="text-sm font-medium text-on-surface-variant hover:text-primary-500 transition-colors"
        >
          My Records
        </Link>
        <Link
          to="/ai"
          className="text-sm font-medium text-on-surface-variant hover:text-primary-500 transition-colors"
        >
          Live Chat
        </Link>
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Hey UNICARE button */}
        <button
          onClick={() => navigate('/ai')}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500 text-white text-sm font-semibold
            hover:bg-primary-600 transition-all shadow-sm hover:shadow-md"
          aria-label="Open Hey UNICARE voice assistant"
          id="hey-unicare-btn"
        >
          {wakeWordEnabled && (
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-green" />
          )}
          Hey UNICARE
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container dark:hover:bg-dark-surface-container-high transition-colors"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          id="theme-toggle"
        >
          {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container dark:hover:bg-dark-surface-container-high transition-colors relative"
            aria-label="Notifications"
            id="notifications-bell"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-12 w-80 bg-white dark:bg-dark-surface-container rounded-xl shadow-elevated border border-outline-variant/20 dark:border-dark-surface-container-high z-50 animate-scale-in overflow-hidden">
                <div className="p-4 border-b border-outline-variant/20 dark:border-dark-surface-container-high">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-4 text-sm text-on-surface-variant text-center">
                    No new notifications
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User avatar */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center
              text-primary-600 dark:text-primary-300 font-semibold text-sm hover:ring-2 hover:ring-primary-500/30 transition-all"
            aria-label="User menu"
            id="user-avatar"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-12 w-56 bg-white dark:bg-dark-surface-container rounded-xl shadow-elevated border border-outline-variant/20 dark:border-dark-surface-container-high z-50 animate-scale-in overflow-hidden">
                <div className="p-4 border-b border-outline-variant/20 dark:border-dark-surface-container-high">
                  <p className="font-semibold text-sm">{user?.name || 'User'}</p>
                  <p className="text-xs text-on-surface-variant">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { setShowUserMenu(false); navigate('/settings'); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container dark:hover:bg-dark-surface-container-high transition-colors"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => { setShowUserMenu(false); useAuthStore.getState().logout(); navigate('/login'); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
