import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Pill,
  Activity,
  Sparkles,
  Utensils,
  Stethoscope,
  ShoppingBag,
  BarChart3,
  Target,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  HelpCircle,
  X,
  PhoneCall,
  CheckCircle2,
  Loader2,
  Users
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/ai', label: 'Health AI', icon: Sparkles },
  { path: '/health', label: 'Health Monitoring', icon: Activity },
  { path: '/medications', label: 'Medications', icon: Pill },
  { path: '/appointments', label: 'Appointments', icon: Calendar },
  { path: '/records', label: 'Patient Records', icon: ClipboardList },
  { path: '/diet', label: 'Diet & Fitness', icon: Utensils },
  { path: '/store', label: 'Wellness Shop', icon: ShoppingBag },
  { path: '/visualizer', label: 'Data Visualizer', icon: BarChart3 },
  { path: '/goals', label: 'Goal Setter', icon: Target },
  { path: '/feedback', label: 'Feedback', icon: MessageSquare },
];

const bottomItems = [
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const collapsed = useSettingsStore((s) => s.sidebarCollapsed);
  const toggle = useSettingsStore((s) => s.toggleSidebar);
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const activeProfileId = useAuthStore((s) => s.activeProfileId);
  const subProfiles = useAuthStore((s) => s.subProfiles);

  // SOS State: idle | countdown | sending | sent
  const [sosState, setSosState] = useState('idle');
  const [countdown, setCountdown] = useState(3);
  const countdownRef = React.useRef(null);

  const handleSOSClick = () => {
    if (sosState !== 'idle') return;
    setSosState('countdown');
    setCountdown(3);

    let counter = 3;
    countdownRef.current = setInterval(() => {
      counter--;
      setCountdown(counter);
      if (counter <= 0) {
        clearInterval(countdownRef.current);
        sendSOS();
      }
    }, 1000);
  };

  const cancelSOS = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setSosState('idle');
  };

  const sendSOS = () => {
    setSosState('sending');
    // Simulate API call to send SMS
    setTimeout(() => {
      setSosState('sent');
      const contact = user?.emergency_contact || 'Emergency Services';
      
      // Send Desktop Notification
      const title = '🚨 SOS SENT 🚨';
      const body = `Emergency message and location sent to ${contact}.`;
      if (window.electronAPI) {
        window.electronAPI.notify.send(title, body);
      } else if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
      }

      setTimeout(() => setSosState('idle'), 4000);
    }, 2000);
  };

  return (
    <>
      <aside
        className={`
          flex flex-col h-screen bg-white dark:bg-dark-surface border-r border-outline-variant/20 dark:border-dark-surface-container-high/50
          transition-all duration-300 ease-in-out relative z-30 shrink-0
          ${collapsed ? 'w-[72px]' : 'w-[240px]'}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 h-16 border-b border-outline-variant/20 dark:border-dark-surface-container-high/50 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <path d="M12 7v4M10 9h4" strokeLinecap="round" />
            </svg>
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold text-primary-500 tracking-tight">UNICARE</h1>
              <p className="text-[10px] text-on-surface-variant -mt-0.5">Health & Wellness</p>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 rounded-xl transition-all duration-200 group relative
                  ${collapsed ? 'justify-center px-2 py-3' : 'px-3 py-2.5'}
                  ${isActive
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-on-surface-variant hover:bg-surface-container dark:hover:bg-dark-surface-container-high'
                  }
                `}
                title={collapsed ? item.label : undefined}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-on-surface text-white text-xs font-medium rounded-lg 
                    opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-elevated">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}

          {/* Manual Trigger for Global Voice Assistant */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-voice-assistant'))}
            className={`
              w-full flex items-center gap-3 rounded-xl transition-all duration-200 group relative mt-2
              ${collapsed ? 'justify-center px-2 py-3' : 'px-3 py-2.5'}
              text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20
              border border-primary-100 dark:border-primary-900/30
            `}
            title={collapsed ? "Voice Assistant (Alt+V)" : undefined}
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 shrink-0" />
            </div>
            {!collapsed && (
              <div className="flex flex-col items-start truncate">
                <span className="text-sm font-bold truncate">Voice Assistant</span>
                <span className="text-[9px] opacity-70 font-medium">Alt+V</span>
              </div>
            )}
            {/* Tooltip for collapsed mode */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-on-surface text-white text-xs font-medium rounded-lg 
                opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-elevated">
                Voice Assistant
              </div>
            )}
          </button>
        </nav>

        {/* Profile Switcher + Bottom section */}
        <div className="border-t border-outline-variant/20 dark:border-dark-surface-container-high/50 px-2 py-3 space-y-1">
          {/* Sub-profile indicator */}
          {activeProfileId !== 'main' && !collapsed && (
            <div className="flex items-center gap-2 px-3 py-2 mb-1 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-medium animate-fade-in">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{user?.name}</span>
            </div>
          )}
          {activeProfileId !== 'main' && collapsed && (
            <div className="flex justify-center mb-1" title={`Sub-profile: ${user?.name}`}>
              <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Users className="w-3 h-3 text-amber-600" />
              </div>
            </div>
          )}
          {/* SOS Button */}
          <button
            onClick={handleSOSClick}
            className={`
              uc-sos-btn w-full animate-sos-pulse
              ${collapsed ? 'px-2 text-sm' : ''}
            `}
            aria-label="Emergency SOS"
            id="sos-sidebar-btn"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            {!collapsed && <span>EMERGENCY SOS</span>}
          </button>

          {/* Settings & Help */}
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 rounded-xl transition-all duration-200
                  ${collapsed ? 'justify-center px-2 py-3' : 'px-3 py-2.5'}
                  ${isActive
                    ? 'bg-surface-container-high dark:bg-dark-surface-container-high text-on-surface'
                    : 'text-on-surface-variant hover:bg-surface-container dark:hover:bg-dark-surface-container-high'
                  }
                `}
                title={collapsed ? item.label : undefined}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={toggle}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-dark-surface-container border border-outline-variant/30 dark:border-dark-surface-container-high
            flex items-center justify-center shadow-card hover:shadow-hover transition-all z-40"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* SOS FULLSCREEN MODAL */}
      {sosState !== 'idle' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <div className="bg-white dark:bg-dark-surface rounded-3xl p-8 max-w-sm w-full mx-4 shadow-modal text-center relative overflow-hidden" style={{ animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
            
            {sosState === 'countdown' && (
              <>
                <div className="absolute top-0 left-0 w-full h-1 bg-surface-container-high dark:bg-dark-surface-container-high">
                  <div className="h-full bg-danger-500 transition-all duration-1000 ease-linear" style={{ width: `${(countdown / 3) * 100}%` }} />
                </div>
                <div className="w-24 h-24 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                  <span className="text-5xl font-black text-danger-500">{countdown}</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Triggering SOS</h2>
                <p className="text-on-surface-variant mb-8">
                  Alerting <strong>{user?.emergency_contact || 'Emergency Services'}</strong> with your medical profile and location...
                </p>
                <button onClick={cancelSOS} className="uc-btn-secondary w-full border-danger-500 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20">
                  <X className="w-5 h-5 mr-1" /> Cancel SOS
                </button>
              </>
            )}

            {sosState === 'sending' && (
              <>
                <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Sending Alert...</h2>
                <p className="text-on-surface-variant">Connecting to emergency network...</p>
              </>
            )}

            {sosState === 'sent' && (
              <>
                <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">SOS Sent Successfully</h2>
                <p className="text-on-surface-variant mb-6">
                  Help has been dispatched. They will contact you on your registered number shortly.
                </p>
                <div className="p-4 bg-surface-container-low dark:bg-dark-surface-container rounded-xl flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium">Contacted</p>
                    <p className="font-bold">{user?.emergency_contact || 'Emergency Services'}</p>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}
