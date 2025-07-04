const { app, BrowserWindow, Tray, Menu, powerMonitor, shell, ipcMain } = require('electron');
const path = require('path');
const { mouse } = require('@nut-tree-fork/nut-js');
const activeWin = require('active-win');
const screenshot = require('screenshot-desktop');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const Store = require('electron-store');
const moment = require('moment-timezone');
const AutoLaunch = require('auto-launch');

const store = new Store();
// store.clear();

// ---------------------------------------------
// 🆕 Embedded Express server to receive token
// ---------------------------------------------
const express = require('express');
const cors = require('cors');

const apiServer = express();
const API_PORT = 3100;
let USER_ID;

apiServer.use(cors());
apiServer.use(express.json());

apiServer.post('/store-token', (req, res) => {
  const { token, userId } = req.body;
  console.log('✅ Token received in Electron:', token);
  console.log('✅ User ID received in Electron:', userId);
  getStoredToken(token)
  setToken(userId, token);
  // store.set('authToken', token);
  // store.set('USER_ID', userId);
  // USER_ID = userId
  startTrackingForUser(userId)

  res.status(200).json({ message: 'Token and User ID received' });
});

apiServer.post('/logout', async (req, res) => {
  const { userId } = req.body;
  console.log(`[Logout] Request received for user ${userId}`);

  try {
    await stopTrackingForUser(userId);
    res.status(200).json({ message: 'Tracking stopped and session ended.' });
  } catch (error) {
    console.error('[Logout Error]', error);
    res.status(500).json({ error: 'Failed to stop tracking' });
  }
});


apiServer.listen(API_PORT, () => {
  console.log(`🚀 Express API server in Electron listening on http://localhost:${API_PORT}`);
});

let mainWindow;
let tray = null;
let lastActivity = Date.now();

let sessionId = null;
let idleStart = null;
const IDLE_THRESHOLD = 3 * 60 * 1000;      // 3 minutes
const ACTIVE_LOG_THRESHOLD = 5 * 60 * 1000; // 5 minutes
let trackingTimers = {}; // per user
let systemIsSleeping = false;


function getUserSessionKey(userId) {
  return `session_${userId}`;
}

function getSessionId(userId) {
  return store.get(`${getUserSessionKey(userId)}_id`);
}

function setSessionId(userId, id) {
  store.set(`${getUserSessionKey(userId)}_id`, id);
}

function getSessionDate(userId) {
  return store.get(`${getUserSessionKey(userId)}_date`);
}

function setSessionDate(userId, date) {
  store.set(`${getUserSessionKey(userId)}_date`, date);
}

function getToken(userId) {
  return store.get(`token_${userId}`);
}

function setToken(userId, token) {
  store.set(`token_${userId}`, token);
}
//const USER_ID = '685a3e5726ac65ec09c16786'
let activeLastSent = null;

let idleCheckStart = null;
console.log('Preload path:', path.join(__dirname, 'preload.js'));

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL('http://44.211.37.68:3000');

  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('minimize', (e) => {
    e.preventDefault();
    mainWindow.hide();
  });

  const iconPath = path.join(__dirname, 'desktime-logo.jpg');
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow.show() },
    { label: 'Quit', click: () => app.quit() },
  ]);
  tray.setToolTip('DeskTime Clone');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    shell.openExternal('http://44.211.37.68:3000'); // Opens React app in default browser
  });

}

function getStoredToken(tokenFromBrowser = null) {
  if (tokenFromBrowser) {
    store.set('authToken', tokenFromBrowser);
  }
  return store.get('authToken');
}



ipcMain.on('token', async (event, { userId, token }) => {
  console.log(`[Auth] Received token for user ${userId}`);
  setToken(userId, token);
  await startTrackingForUser(userId);
  event.sender.send('token-response', 'Token received');
});
// window.electronAPI?.sendToken('your-token-value-here');

async function startTrackingForUser(userId) {
  const token = getToken(userId);
  console.log(`[Start Tracking] Starting tracking for user ${userId}`);
  console.log(`[Start Tracking] Token: ${token}`);
  if (!token) return;

  const today = new Date().toISOString().split('T')[0];
  const storedDate = getSessionDate(userId);
  if (today !== storedDate || !getSessionId(userId)) {
    const oldSessionId = getSessionId(userId);
    if (oldSessionId) await endSession(oldSessionId, token);
    const newSessionId = await initializeDailyTracking(userId, token);
    if (newSessionId) {
      setSessionId(userId, newSessionId);
      setSessionDate(userId, today);
    }
  }

  // If already tracking, skip
  if (trackingTimers[userId]) return;

  trackingTimers[userId] = {
    dateCheck: setInterval(async () => {
      const today = new Date().toISOString().split('T')[0];
      if (today !== getSessionDate(userId)) {
        const oldSessionId = getSessionId(userId);
        if (oldSessionId) await endSession(oldSessionId, token);
        const newSessionId = await initializeDailyTracking(userId, token);
        if (newSessionId) {
          setSessionId(userId, newSessionId);
          setSessionDate(userId, today);
          console.log(`[⏰ New Day] Session rolled over to new date ${today}`);
        }
      }
    }, 60 * 1000),

    idleCheck: setInterval(async () => {
      const idleTime = powerMonitor.getSystemIdleTime() * 1000;
      if (idleTime > IDLE_THRESHOLD) {
        sendActivityToServer({ userId, type: 'idle', timestamp: new Date(), token });
      } else {
        const win = await activeWin().catch(console.error);
        if (win) {
          sendActivityToServer({
            userId,
            type: 'active',
            app: win.owner.name,
            title: win.title,
            timestamp: new Date(),
            token,
          });
        }
      }
    }, 10* 10000),

    mousePoll: setInterval(() => {
      mouse.getPosition().catch(err => console.error('[Mouse Error]', err));
    }, 2000),



   screenshot: setInterval(() => {
  if (!systemIsSleeping) {
    captureScreenshot(userId, token);
  } else {
    console.log(`[Sleep Mode] Skipping screenshot for ${userId}`);
  }
}, 5 * 60 * 1000),

  };
}

let sessionEnded = false;

async function initializeDailyTracking(userId, token) {
  // if (!sessionId || sessionEnded) return;

  try {
    const res = await axios.get('http://44.211.37.68:8080/tracking/sessions', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('[Init Tracking] Existing sessions:', res.data.data);
    if (res.data.data) {
      return res.data.data._id;
    }

    const createRes = await axios.post('http://44.211.37.68:8080/tracking/sessions', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return createRes.data.sessionId;
  } catch (err) {
    console.error('[Init Tracking Error]', err);
    return null;
  }
}

async function endSession(sessionId, token) {
  try {
    await axios.put('http://44.211.37.68:8080/tracking/sessions/end', { sessionId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('[Session Ended]', sessionId);
  } catch (err) {
    console.error('[End Session Error]', err);
  }
}

let idleStartMap = {};
let activeStartMap = {};
let activeLastSentMap = {};

async function captureScreenshot(userId, token) {
  try {
    const sessionId = getSessionId(userId);
    if (!sessionId) return;

    const user = await axios.get(`http://44.211.37.68:8080/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { timeZone, trackingEndTime = "12:00", flexibleHours } = user.data.data;
    const currentTime = moment().tz(timeZone);
    const [cutHour, cutMin] = trackingEndTime.split(":").map(Number);
    const cutoff = flexibleHours
      ? currentTime.clone().endOf("day").seconds(0)
      : currentTime.clone().hour(cutHour).minute(cutMin).second(0);

    if (currentTime.isAfter(cutoff)) {
      console.log(`[Tracking] Screenshot skipped for user ${userId} - after cutoff`);
      return;
    }

    const win = await activeWin();
    const appName = win ? win.owner.name : "unknown";
      if (!win || win.owner.name.toLowerCase().includes("lock") || !win.title) {
      console.log(`[Screenshot] Skipped: locked screen for user ${userId}`);
      return;
    }

    const imgBuffer = await screenshot({ format: "jpg" });
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("sessionId", sessionId);
    formData.append("screenshotApp", appName);
    formData.append("screenshot", imgBuffer, {
      filename: `screenshot_${appName.replace(/\s+/g, "-")}_${Date.now()}.jpg`,
      contentType: "image/jpeg",
    });

    const res = await axios.post(
      "http://44.211.37.68:8080/tracking/sessions/screenshots",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("[Screenshot Uploaded]", res.data);
  } catch (err) {
    console.error("[Screenshot Error]", err);
  }
}

async function sendActivityToServer(data) {
  const { userId, token, type } = data;
  const now = new Date();
  const sessionId = getSessionId(userId);
  if (!token || !sessionId) return;

    const user = await axios.get(`http://44.211.37.68:8080/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  if (!user) return;
  console.log('[Send Activity] User:', user.data);
  const timeZone = user.data.data.timeZone;
  const trackingEndTimeStr = user.data.data.trackingEndTime;
  const flexible = user.data.data.flexibleHours;
   const currentTime = moment().tz(timeZone);
  const [cutHour, cutMin] = trackingEndTimeStr.split(':').map(Number);

  const trackingEnd = currentTime.clone().hour(cutHour).minute(cutMin).second(0);
  const cutoff = flexible ? currentTime.clone().endOf("day").seconds(0) // 23:59:00
  : trackingEnd;

  // ✅ If current time is past cutoff, stop tracking
  if (currentTime.isAfter(cutoff)) {
    console.log(`[Tracking] Skipped for user ${userId} as current time ${currentTime.format()} > cutoff ${cutoff.format()}`);
    return;
  }  else {
  console.log(`[Tracking] Time ${currentTime.format("HH:mm")} <= cutoff ${cutoff.format("HH:mm")}`);
}

  if (type === 'idle') {
    if (!idleStartMap[userId]) idleStartMap[userId] = now;

    if ((now - idleStartMap[userId]) >= IDLE_THRESHOLD && activeStartMap[userId]) {
      const duration = Math.floor((idleStartMap[userId] - activeStartMap[userId]) / 1000);
      await axios.put('http://44.211.37.68:8080/tracking/sessions/active', {
        sessionId,
        duration,
        startTime: activeStartMap[userId],
        endTime: idleStartMap[userId],
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);

      activeStartMap[userId] = null;
      activeLastSentMap[userId] = null;
    }
  } else if (type === 'active') {
    if (idleStartMap[userId]) {
      const idleEnd = now;
      console.log("Idle time tracking started")
      const idleDuration = Math.floor((idleEnd - idleStartMap[userId]) / 1000);
      await axios.put('http://44.211.37.68:8080/tracking/sessions/idle', {
        sessionId,
        startTime: idleStartMap[userId],
        endTime: idleEnd,
        duration: idleDuration,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);
    }

    idleStartMap[userId] = null;

    if (!activeStartMap[userId]) {
      activeStartMap[userId] = now;
      activeLastSentMap[userId] = now;
    }

    if ((now - activeLastSentMap[userId]) >= ACTIVE_LOG_THRESHOLD) {
      const duration = Math.floor((now - activeStartMap[userId]) / 1000);
      await axios.put('http://44.211.37.68:8080/tracking/sessions/active', {
        sessionId,
        duration,
        startTime: activeStartMap[userId],
        endTime: now,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(console.error);

      activeStartMap[userId] = now;
      activeLastSentMap[userId] = now;
    }
  }
}

async function stopTrackingForUser(userId) {
  const sessionId = getSessionId(userId);
  const token = getToken(userId);

  if (trackingTimers[userId]) {
    Object.values(trackingTimers[userId]).forEach(clearInterval);
    delete trackingTimers[userId];
  }

  delete idleStartMap[userId];
  delete activeStartMap[userId];
  delete activeLastSentMap[userId];

  if (sessionId && token) {
    await endSession(sessionId, token);
  }

  // Clear store
  store.delete(`${getUserSessionKey(userId)}_id`);
  store.delete(`${getUserSessionKey(userId)}_date`);
  store.delete(`token_${userId}`);

  console.log(`[Logout] Tracking stopped and store cleared for user ${userId}`);
}


app.whenReady().then(async () => {
  createWindow();
  const deskTimeAutoLauncher = new AutoLaunch({
  name: 'DeskTimeApp',
  path: app.getPath('exe'),
});

deskTimeAutoLauncher.isEnabled().then((isEnabled) => {
  if (!isEnabled) deskTimeAutoLauncher.enable();
});

  // ✅ Auto-resume tracking on app restart
  const allKeys = store.store;
  const userTokenKeys = Object.keys(allKeys).filter(key => key.startsWith('token_'));
  for (const tokenKey of userTokenKeys) {
    const userId = tokenKey.split('_')[1]; // from 'token_<userId>'
    const token = store.get(tokenKey);
    if (token) {
      console.log(`[Auto Resume] Found stored token for user ${userId}. Resuming tracking...`);
      await startTrackingForUser(userId);
    }
  }
});

// powerMonitor.on('suspend', () => {
//   console.log('[System] Going to sleep...');
//   systemIsSleeping = true;

//   for (const userId in trackingTimers) {
//     if (trackingTimers[userId].screenshot) {
//       clearInterval(trackingTimers[userId].screenshot);
//       trackingTimers[userId].screenshot = null;
//     }
//   }
// });

// powerMonitor.on('resume', async () => {
//   console.log('[System] Resumed from sleep...');
//   systemIsSleeping = false;

//   for (const userId in trackingTimers) {
//     const token = getToken(userId);
//     if (token) {
//       trackingTimers[userId].screenshot = setInterval(() => {
//         if (!systemIsSleeping) captureScreenshot(userId, token);
//       }, 5 * 60 * 1000);
//     }
//   }
// });


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
