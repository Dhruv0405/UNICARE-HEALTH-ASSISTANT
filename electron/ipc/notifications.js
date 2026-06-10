const { Notification } = require('electron');

const scheduledNotifications = new Map();

function setupNotificationIPC(ipcMain, mainWindow) {
  ipcMain.handle('notify:send', (event, title, body, options = {}) => {
    try {
      if (Notification.isSupported()) {
        const notification = new Notification({
          title: title || 'UNICARE',
          body: body || '',
          icon: options.icon || undefined,
          silent: options.silent || false,
        });

        notification.on('click', () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
            if (options.route) {
              mainWindow.webContents.send('navigate', options.route);
            }
          }
        });

        notification.show();
        return { success: true };
      }
      return { success: false, error: 'Notifications not supported' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('notify:schedule', (event, id, title, body, timeMs) => {
    try {
      // Cancel existing with same ID
      if (scheduledNotifications.has(id)) {
        clearTimeout(scheduledNotifications.get(id));
      }

      const delay = timeMs - Date.now();
      if (delay <= 0) return { success: false, error: 'Time is in the past' };

      const timer = setTimeout(() => {
        if (Notification.isSupported()) {
          const notification = new Notification({ title, body });
          notification.on('click', () => {
            if (mainWindow) {
              mainWindow.show();
              mainWindow.focus();
            }
          });
          notification.show();
        }
        scheduledNotifications.delete(id);
      }, delay);

      scheduledNotifications.set(id, timer);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('notify:cancel', (event, id) => {
    if (scheduledNotifications.has(id)) {
      clearTimeout(scheduledNotifications.get(id));
      scheduledNotifications.delete(id);
      return { success: true };
    }
    return { success: false, error: 'Notification not found' };
  });
}

module.exports = { setupNotificationIPC };
