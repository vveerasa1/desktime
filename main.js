// desktime-clone/main.js
const { app, BrowserWindow, Tray, Menu, powerMonitor, shell } = require('electron');
const path = require('path');
const { mouse, keyboard, Button, Key } = require('@nut-tree-fork/nut-js');
const activeWin = require('active-win');
const screenshot = require('screenshot-desktop');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const Store = require('electron-store').default
const store = new Store();
console.log(store,"STORE DA DEIIII")
store.clear();
console.log('[Store] Cleared all data');


// ---------------------------------------------
// 🆕 Embedded Express server to receive token
// ---------------------------------------------
const express = require('express');
const cors = require('cors');

const apiServer = express();
const API_PORT = 3100;

apiServer.use(cors());
apiServer.use(express.json());

apiServer.post('/store-token', (req, res) => {
  const { token, userId } = req.body;
  console.log('✅ Token received in Electron:', token);
  console.log('✅ User ID received in Electron:', userId);
  getStoredToken(token)
  store.set('authToken', token);
  store.set('USER_ID', userId);
  USER_ID = userId
  startTracking();

  res.status(200).json({ message: 'Token and User ID received' });
});


apiServer.listen(API_PORT, () => {
  console.log(`🚀 Express API server in Electron listening on http://localhost:${API_PORT}`);
});

const { ipcMain } = require('electron');

let mainWindow;
let tray = null;
let lastActivity = Date.now();

let sessionId = null;
let idleStart = null;
const IDLE_THRESHOLD = 3 * 60 * 1000;      // 3 minutes
const ACTIVE_LOG_THRESHOLD = 5 * 60 * 1000; // 5 minutes
let USER_ID = null
console.log(USER_ID,"USER ID DAW DEIII")
let activeLastSent = null;

let idleCheckStart = null;
console.log('Preload path:', path.join(__dirname, 'preload.js'));

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // preload: path.join(__dirname, 'preload.js'),
      preload: path.join(__dirname, 'preload.js')

    },
  });

  mainWindow.loadURL('http://localhost:5173');
  // mainWindow.loadFile(path.join(__dirname, "frontend/build/index.html"));
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

}

function getStoredToken(tokenFromBrowser = null) {
  if (tokenFromBrowser) {
    store.set('authToken', tokenFromBrowser);
  }
  return store.get('authToken');
}



ipcMain.on('token', (event, token) => {

  console.log('Received token from renderer:', token);
  store.set('authToken', token);

  event.sender.send('token-response', 'Token received');
});
console.log('from mainnnnnnnnnnnnnnnnnn')
// window.electronAPI?.sendToken('your-token-value-here');

async function startTracking() {
    if (!USER_ID) {
    console.warn('[Tracking] Cannot start tracking without USER_ID');
    return;
  }
  await initializeDailyTracking(USER_ID);
  // Use powerMonitor to detect idle time
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
      const appName = win ? win.owner.name : 'unknown';
      const token = getStoredToken();
if (!token) {
  console.warn('[Screenshot Upload] No token available, skipping upload.');
  return;
}

const imgBuffer = await screenshot({ format: 'jpg' });
console.log('[Screenshot Taken - Buffer]');

const formData = new FormData();
formData.append('userId', USER_ID);
formData.append('sessionId', sessionId);
formData.append('screenshotApp', appName);
formData.append('screenshot', Buffer.from(imgBuffer), {
  filename: `screenshot_${Date.now()}.jpg`,
  contentType: 'image/jpeg',
});

try {
  const headers = {
    ...formData.getHeaders(),
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.post(
    'http://localhost:8080/tracking/sessions/screenshots',
    formData,
    { headers }
  );
  console.log('[Screenshot Uploaded]', response.data);
} catch (err) {
  console.error('[Screenshot Upload Error]', err.message);
  if (err.response) {
    console.error('[Backend Response]', err.response.data);
  }
}


    } catch (err) {


      console.error('[Screenshot Error]', err);
    }
  },5 * 60 * 1000);
}

let sessionEnded = false;

async function checkIfSessionEnded() {
  if (!sessionId || sessionEnded) return;

  try {
    const response = await axios.get(`http://localhost:8080/tracking/sessions/${sessionId}`);
    if (response.data?.leftTime) {
      console.log('[Tracking] Session already ended at', response.data.leftTime);
      sessionEnded = true; // flag to prevent further calls
    }
  } catch (err) {
    console.error('[Session Check Error]', err);
  }
}


let activeStartTime = null;

async function sendActivityToServer(data) {
   if (!sessionId || sessionEnded) return;
   await checkIfSessionEnded();
   if (sessionEnded) return;
   
   const now = new Date();
   if (data.type === 'idle') {
    if (!idleCheckStart) idleCheckStart = now;

    if ((now - idleCheckStart) >= IDLE_THRESHOLD && !idleStart) {
      idleStart = idleCheckStart;

      // End current active period
      if (activeStartTime) {
        const endTime = idleStart;
        const duration = Math.floor((endTime - activeStartTime) / 1000);
        axios.put('http://localhost:8080/tracking/sessions/active', {
          sessionId,
          duration,
          startTime: activeStartTime,
          endTime
        }).catch(console.error);
        activeStartTime = null;
        activeLastSent = null;
      }
    }
  }

  else if (data.type === 'active') {
    // 🟢 If user was idle and now becomes active, log the idle period
    if (idleStart) {
      const idleEnd = now;
      const idleDuration = Math.floor((idleEnd - idleStart) / 1000);
      axios.put('http://localhost:8080/tracking/sessions/idle', {
        sessionId,
        startTime: idleStart,
        endTime: idleEnd,
        duration: idleDuration
      }).catch(console.error);
    }

    // Reset idle tracking
    idleStart = null;
    idleCheckStart = null;

    // Start new active block
    if (!activeStartTime) {
      activeStartTime = now;
      activeLastSent = now;
    }

    // Push active block every 5 minutes
    if ((now - activeLastSent) >= ACTIVE_LOG_THRESHOLD) {
      const endTime = now;
      const duration = Math.floor((endTime - activeStartTime) / 1000);
      axios.put('http://localhost:8080/tracking/sessions/active', {
        sessionId,
        duration,
        startTime: activeStartTime,
        endTime
      }).catch(console.error);

      // Start next block
      activeStartTime = now;
      activeLastSent = now;
    }
  }
}




// async function endSession() {
//   if (sessionId) {
//     try {
//       await axios.put('http://localhost:8080/tracking/session/end', { sessionId });
//       console.log('[Tracking] Session ended.');
//     } catch (err) {
//       console.error('[End Session Error]', err);
//     }
//   }
// }

async function initializeDailyTracking(userId) {
  const today = new Date().toISOString().split('T')[0];
  try {
    const res = await axios.get(`http://localhost:8080/tracking/sessions?userId=${userId}&date=${today}`);
    console.log('[Tracking] Session found:', res.data);
    if (res.data.data) {
      sessionId = res.data.data._id;
    } else {
      const createRes = await axios.post('http://localhost:8080/tracking/sessions', {
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

// app.on('before-quit', async () => {
//   await endSession();
// });

// powerMonitor.on('shutdown', () => {
//  endSession(); // gracefully close session
// });

// powerMonitor.on('suspend', () => {
//  endSession(); // system is sleeping
// });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
