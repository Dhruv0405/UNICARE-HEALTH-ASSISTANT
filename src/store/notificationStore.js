import { create } from 'zustand';

/**
 * Global notification store — used by all pages to show toast popups.
 * Also sends desktop / Electron notifications alongside in-app toasts.
 */
export const useNotificationStore = create((set, get) => ({
  notifications: [],

  /**
   * Add a notification toast.
   * @param {'success'|'info'|'warning'|'error'} type
   * @param {string} title
   * @param {string} [message]
   * @param {number} [duration=4000] ms before auto-dismiss
   */
  addNotification: (type, title, message = '', duration = 4000) => {
    const id = Date.now() + '-' + Math.random().toString(36).slice(2, 6);
    const notification = { id, type, title, message, timestamp: Date.now() };

    set((s) => ({
      notifications: [...s.notifications, notification],
    }));

    // Auto-dismiss
    setTimeout(() => {
      get().removeNotification(id);
    }, duration);

    // Also send desktop / Electron notification
    try {
      if (window.electronAPI) {
        window.electronAPI.notify.send(title, message);
      } else if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body: message });
      } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') new Notification(title, { body: message });
        });
      }
    } catch (e) {
      // Notification API might not be available
    }
  },

  removeNotification: (id) => {
    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => set({ notifications: [] }),
}));
