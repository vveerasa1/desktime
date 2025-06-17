// desktime-clone/main.js
const { app, BrowserWindow, Tray, Menu, powerMonitor ,shell } = require('electron');
const path = require('path');
const { mouse, keyboard, Button, Key } = require('@nut-tree-fork/nut-js');
const activeWin = require('active-win');
const screenshot = require('screenshot-desktop');
const axios = require('axios');
const fs = require('fs');

let mainWindow;
let tray = null;
let lastActivity = Date.now();

let sessionId = null;
let idleStart = null;
const IDLE_THRESHOLD = 1 * 60 * 1000; 
const USER_ID = '68501bb5c58fcc96281e10e3'

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
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

async function startTracking() {
  await initializeDailyTracking(USER_ID); // 💡 Important: waits for session setup

  setInterval(() => {
    try {
      const idleTime = powerMonitor.getSystemIdleTime() * 1000;
      if (idleTime > IDLE_THRESHOLD) {
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
            sendActivityToServer(activity);
          }
        }).catch(err => console.error('[ActiveWin Error]', err));
      }
    } catch (err) {
      console.error('[Idle Check Error]', err);
    }
  }, 10000);

  setInterval(async () => {
    try {
      const pos = await mouse.getPosition();
      console.log('[Mouse Position]', pos);
    } catch (err) {
      console.error('[Mouse Poll Error]', err);
    }
  }, 2000);

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
  if (!sessionId) return;

  if (data.type === 'idle') {
    if (!idleStart) idleStart = new Date();
  } else if (data.type === 'active') {
    if (idleStart) {
      const idleEnd = new Date();
      axios.put('http://localhost:8080/tracking/session/idle', {
        userId: USER_ID,
        sessionId,
        idleStartTime: idleStart,
        idleEndTime: idleEnd
      }).catch(console.error);
      idleStart = null;
    }

    axios.put('http://localhost:8080/tracking/session/active', {
      sessionId,
      duration: 10
    }).catch(console.error);
  }
}

async function endSession() {
  if (sessionId) {
    try {
      await axios.put('http://localhost:8080/tracking/session/end', { sessionId });
      console.log('[Tracking] Session ended.');
    } catch (err) {
      console.error('[End Session Error]', err);
    }
  }
}

async function initializeDailyTracking(userId) {
  const today = new Date().toISOString().split('T')[0];
  try {
    const res = await axios.get(`http://localhost:8080/tracking/session?userId=${userId}&date=${today}`);
    console.log('[Tracking] Session found:', res.data);
    if (res.data.data._id) {
      sessionId = res.data.data._id;
    } else {
      const createRes = await axios.post('http://localhost:8080/tracking/session', {
        userId
      });
      sessionId = createRes.data.sessionId;
    }
    console.log('[Tracking] Initialized session:', sessionId);
  } catch (err) {
    console.error('[Tracking Init Error]', err);
  }
}

app.whenReady().then(createWindow);

app.on('before-quit', async () => {
  await endSession();
});

powerMonitor.on('shutdown', () => {
 endSession(); // gracefully close session
});

powerMonitor.on('suspend', () => {
 endSession(); // system is sleeping
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
