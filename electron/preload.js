const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  db: {
    run: (sql, params) => ipcRenderer.invoke('db:run', sql, params),
    get: (sql, params) => ipcRenderer.invoke('db:get', sql, params),
    all: (sql, params) => ipcRenderer.invoke('db:all', sql, params),
    exec: (sql) => ipcRenderer.invoke('db:exec', sql),
  },

  // Notifications
  notify: {
    send: (title, body, options) => ipcRenderer.invoke('notify:send', title, body, options),
    schedule: (id, title, body, time) => ipcRenderer.invoke('notify:schedule', id, title, body, time),
    cancel: (id) => ipcRenderer.invoke('notify:cancel', id),
  },

  // File operations
  files: {
    saveReport: (fileName, data) => ipcRenderer.invoke('files:saveReport', fileName, data),
    readReport: (filePath) => ipcRenderer.invoke('files:readReport', filePath),
    openFile: () => ipcRenderer.invoke('files:openFile'),
    exportData: (data, fileName) => ipcRenderer.invoke('files:exportData', data, fileName),
    getReportsDir: () => ipcRenderer.invoke('files:getReportsDir'),
  },

  // Auth
  auth: {
    googleLogin: () => ipcRenderer.invoke('auth:googleLogin'),
    onGoogleToken: (callback) => {
      ipcRenderer.on('auth:googleToken', (event, token) => callback(token));
    },
  },

  // App events
  on: (channel, callback) => {
    const validChannels = ['open-sos', 'navigate', 'notification-clicked'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },

  removeListener: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  },

  // Platform info
  platform: process.platform,
  isElectron: true,
});
