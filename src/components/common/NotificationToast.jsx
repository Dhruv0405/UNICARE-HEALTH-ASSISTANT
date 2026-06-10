import React from 'react';
import { useNotificationStore } from '../../store/notificationStore';
import { Check, Info, AlertTriangle, XCircle, X } from 'lucide-react';

const iconMap = {
  success: Check,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

const colorMap = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/30',
    border: 'border-green-300 dark:border-green-700',
    icon: 'text-green-500',
    title: 'text-green-800 dark:text-green-300',
    message: 'text-green-700 dark:text-green-400',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-blue-300 dark:border-blue-700',
    icon: 'text-blue-500',
    title: 'text-blue-800 dark:text-blue-300',
    message: 'text-blue-700 dark:text-blue-400',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    border: 'border-amber-300 dark:border-amber-700',
    icon: 'text-amber-500',
    title: 'text-amber-800 dark:text-amber-300',
    message: 'text-amber-700 dark:text-amber-400',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    border: 'border-red-300 dark:border-red-700',
    icon: 'text-red-500',
    title: 'text-red-800 dark:text-red-300',
    message: 'text-red-700 dark:text-red-400',
  },
};

export default function NotificationToast() {
  const { notifications, removeNotification } = useNotificationStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => {
        const Icon = iconMap[n.type] || Info;
        const colors = colorMap[n.type] || colorMap.info;

        return (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm
              ${colors.bg} ${colors.border}`}
            style={{
              animation: 'slideInRight 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
            role="alert"
          >
            <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg}`}>
              <Icon className={`w-5 h-5 ${colors.icon}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${colors.title}`}>{n.title}</p>
              {n.message && (
                <p className={`text-xs mt-0.5 ${colors.message}`}>{n.message}</p>
              )}
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="shrink-0 text-on-surface-variant/50 hover:text-on-surface-variant transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
