// desktime-clone/main.js
const { app, BrowserWindow, Tray, Menu, powerMonitor } = require('electron');
const path = require('path');
const { mouse, keyboard, Button, Key } = require('@nut-tree-fork/nut-js');
const activeWin = require('active-win');
const screenshot = require('screenshot-desktop');
const axios = require('axios');
const fs = require('fs');

let mainWindow;
let tray = null;
let lastActivity = Date.now();
const IDLE_THRESHOLD = 1 * 60 * 1000; // 3 minutes

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  const iconPath = path.join(__dirname, 'desktime-logo.jpg');
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

  startTracking();
}

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
      console.log('[Screenshot] Captured:', filename);
    } catch (err) {
      console.error('[Screenshot Error]', err);
    }
  }, 5 * 60 * 1000);
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
