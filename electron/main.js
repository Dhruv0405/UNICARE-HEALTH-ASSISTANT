const { app, BrowserWindow, Tray, Menu, ipcMain, Notification, nativeImage, shell } = require('electron');
const path = require('path');
const Database = require('./database');
const { setupDatabaseIPC } = require('./ipc/database');
const { setupNotificationIPC } = require('./ipc/notifications');
const { setupFileIPC } = require('./ipc/files');

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

let mainWindow = null;
let tray = null;
let db = null;

// Window state persistence
let windowState = { width: 1400, height: 900, x: undefined, y: undefined, isMaximized: false };

function loadWindowState() {
  try {
    const statePath = path.join(app.getPath('userData'), 'window-state.json');
    const fs = require('fs');
    if (fs.existsSync(statePath)) {
      windowState = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    }
  } catch (e) {
    // Use defaults
  }
}

function saveWindowState() {
  try {
    if (!mainWindow) return;
    const statePath = path.join(app.getPath('userData'), 'window-state.json');
    const fs = require('fs');
    const bounds = mainWindow.getBounds();
    windowState = {
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      isMaximized: mainWindow.isMaximized(),
    };
    fs.writeFileSync(statePath, JSON.stringify(windowState));
  } catch (e) {
    // Ignore
  }
}

function createWindow() {
  loadWindowState();

  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    minWidth: 1024,
    minHeight: 700,
    title: 'UNICARE — Health & Wellness',
    icon: path.join(__dirname, '../assets/icon.png'),
    backgroundColor: '#f6fafe',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  if (windowState.isMaximized) {
    mainWindow.maximize();
  }

  // Load the app
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle Firebase Google Login popups
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('firebaseapp.com/__/auth/handler') || url.includes('accounts.google.com')) {
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          width: 500,
          height: 700,
          title: 'Sign in with Google',
          autoHideMenuBar: true,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
          }
        }
      };
    }
    // For normal external links, open in default browser
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Spoof User Agent for Google Login to prevent "disallowed_useragent" error
  app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      if (parsedUrl.hostname === 'accounts.google.com') {
        contents.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      }
    });
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', () => {
    saveWindowState();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  try {
    // Create a simple tray icon
    const iconPath = path.join(__dirname, '../assets/icon.png');
    const fs = require('fs');
    let trayIcon;
    if (fs.existsSync(iconPath)) {
      trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
    } else {
      // Create a simple colored icon as fallback
      trayIcon = nativeImage.createEmpty();
    }

    tray = new Tray(trayIcon);
    tray.setToolTip('UNICARE — Health & Wellness');

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open UNICARE',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          } else {
            createWindow();
          }
        },
      },
      { type: 'separator' },
      {
        label: '🆘 Emergency SOS',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.webContents.send('open-sos');
          }
        },
      },
      {
        label: '💬 AI Chat',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.webContents.send('navigate', '/ai');
          }
        },
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        },
      },
    ]);

    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
      if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  } catch (e) {
    console.error('Failed to create tray:', e);
  }
}

// App lifecycle
app.whenReady().then(async () => {
  // Initialize database (async for sql.js WASM loading)
  db = await Database.initialize();

  // Setup IPC handlers
  setupDatabaseIPC(ipcMain, db);
  setupNotificationIPC(ipcMain, null); // mainWindow not yet created
  setupFileIPC(ipcMain);

  // Setup Custom OAuth HTTP Server
  const http = require('http');
  const server = http.createServer((req, res) => {
    if (req.url.startsWith('/callback')) {
      // The hash isn't sent to the server in a standard HTTP request, 
      // so we serve an HTML page that reads the hash and posts it back to us.
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <html>
          <body>
            <h2>Logging you in...</h2>
            <script>
              // Extract the id_token from the URL hash
              const params = new URLSearchParams(window.location.hash.substring(1));
              const idToken = params.get('id_token');
              if (idToken) {
                fetch('http://localhost:3456/token', {
                  method: 'POST',
                  body: idToken
                }).then(() => {
                  document.body.innerHTML = '<h2>Login successful! You can close this tab and return to the app.</h2>';
                  // Close the window after a short delay if allowed
                  setTimeout(() => window.close(), 2000);
                });
              } else {
                document.body.innerHTML = '<h2>Login failed. Please try again.</h2>';
              }
            </script>
          </body>
        </html>
      `);
    } else if (req.url === '/token' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        if (mainWindow) {
          mainWindow.webContents.send('auth:googleToken', body);
        }
        res.writeHead(200);
        res.end('OK');
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  });
  server.listen(3456);

  // IPC Handler for Google Login
  ipcMain.handle('auth:googleLogin', async () => {
    // We need the OAuth Client ID from the environment or configuration
    // The user will need to provide this in their .env or config
    require('dotenv').config();
    const clientId = process.env.VITE_GOOGLE_OAUTH_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
    
    if (clientId === 'YOUR_CLIENT_ID_HERE') {
      console.error("Missing VITE_GOOGLE_OAUTH_CLIENT_ID in .env!");
      return false;
    }

    const redirectUri = 'http://localhost:3456/callback';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=id_token&scope=openid%20email%20profile&nonce=random_nonce`;
    
    shell.openExternal(authUrl);
    return true;
  });

  createWindow();
  createTray();
});

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Don't quit, keep in tray
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  saveWindowState();
  if (db) {
    try { db.close(); } catch (e) { /* ignore */ }
  }
});
