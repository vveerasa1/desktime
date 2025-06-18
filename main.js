// desktime-clone/main.js
const { app, BrowserWindow, Tray, Menu, powerMonitor, shell } = require('electron');
const path = require('path');
const { mouse, keyboard, Button, Key } = require('@nut-tree-fork/nut-js');
const activeWin = require('active-win');
const screenshot = require('screenshot-desktop');
const axios = require('axios');
const fs = require('fs');
const Store = require('electron-store').default
const store = new Store();
let mainWindow;
let tray = null;
let lastActivity = Date.now();
const IDLE_THRESHOLD = 1 * 60 * 1000;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL('http://localhost:5173');
  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.hide();
  });

  // ✅ This will hide the window instead of minimizing to taskbar
  mainWindow.on('minimize', (e) => {
    e.preventDefault();
    mainWindow.hide();
  });
  const iconPath = path.join(__dirname, 'desktime-logo.jpg');
  // const iconPath = path.join(__dirname, 'assets', 'desktime-logo.png');

  if (!fs.existsSync(iconPath)) {
    console.warn('⚠️ Tray icon not found:', iconPath);
  }


  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow.show() },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('DeskTime Clone');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    shell.openExternal('http://localhost:5173'); // Opens React app in default browser
  });
  startTracking();

}

function getStoredToken() {
  return store.get('authToken');
}
const { ipcMain } = require('electron');

ipcMain.on('token', (event, token) => {
  console.log('Received token from renderer:', token);
  // You can store the token or use it as needed here
  // Optionally, send a response back to renderer
  store.set('authToken', token);

  event.sender.send('token-response', 'Token received');
});

function startTracking() {
  // Use powerMonitor to detect idle time
  setInterval(() => {
    try {
      const idleTime = powerMonitor.getSystemIdleTime() * 1000;
      console.log(`[Idle Time] ${idleTime / 1000} seconds`);
      if (idleTime > IDLE_THRESHOLD) {
        console.log('[Idle] User inactive');
        sendActivityToServer({ type: 'idle', timestamp: new Date() });
      } else {
        activeWin().then(win => {
          if (win) {
            const activity = {
              type: 'active',
              app: win.owner.name,
              title: win.title,
              timestamp: new Date()
            };
            console.log('[Active App]', activity);
            sendActivityToServer(activity);
          }
        }).catch(err => console.error('[ActiveWin Error]', err));
      }
    } catch (err) {
      console.error('[Idle Check Error]', err);
    }
  }, 10000);

  // Poll mouse position every 2 seconds
  setInterval(async () => {
    try {
      const pos = await mouse.getPosition();
      console.log('[Mouse Position]', pos);
    } catch (err) {
      console.error('[Mouse Poll Error]', err);
    }
  }, 2000);

  // Take screenshots every 5 minutes
  setInterval(async () => {
    try {
      const win = await activeWin();
      const tag = win ? win.owner.name.replace(/\s+/g, '-') : 'unknown';
      const filename = path.join(__dirname, `screenshot_${tag}_${Date.now()}.jpg`);
      await screenshot({ filename });
    const  timestamp= new Date()
      const formData = new FormData();
      formData.append('screenshot', fs.createReadStream(filename));
      formData.append('app', win?.owner.name || 'unknown');
      formData.append('title', win?.title || 'unknown');
      formData.append('timestamp', timestamp.toISOString());
      const token =getStoredToken()
      console.log(token,"token<<<<<<<<<<<<<<<<<");
      
      await axios.post('http://localhost:5000/api/screenshot', formData, {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${token}`, // 👈 Add token here
        }
      },);

      console.log('[Screenshot] Captured:', filename);
    } catch (err) {


      console.error('[Screenshot Error]', err);
    }
  }, 1 * 60 * 1000);
}

function sendActivityToServer(data) {
  console.log('[Server] Sending activity', data);
  //   axios.post('http://localhost:5000/api/activity', data)
  //     .then(() => console.log('[Server] Activity logged'))
  //     .catch(err => console.error('[Server] Error sending activity', err));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
