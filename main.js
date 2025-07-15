const {
  app,
  BrowserWindow,
  Tray,
  Menu,
  powerMonitor,
  shell,
  ipcMain,
} = require("electron");
const path = require("path");
const { mouse } = require("@nut-tree-fork/nut-js");
const activeWin = require("active-win");
const screenshot = require("screenshot-desktop");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const Store = require("electron-store");
const moment = require("moment-timezone");
const AutoLaunch = require("auto-launch");

const store = new Store();
// store.clear();

// ---------------------------------------------
// 🆕 Embedded Express server to receive token
// ---------------------------------------------
const express = require("express");
const cors = require("cors");

const apiServer = express();
const API_PORT = 3100;
let USER_ID;
let isSessionEnded = false;

apiServer.use(cors());
apiServer.use(express.json());

apiServer.post("/store-token", (req, res) => {
  const { token, userId, refreshToken } = req.body;
  console.log("✅ Token received in Electron:", token);
  console.log("✅ User ID received in Electron:", userId);
  console.log("RefreshToken received in Electron:", refreshToken);
  console.log(token);

  //getStoredToken(token);
  setToken(userId, token);
  store.set(`refreshToken_${userId}`, refreshToken);

  // store.set('authToken', token);
  // store.set('USER_ID', userId);
  // USER_ID = userId
  startTrackingForUser(userId);

  res.status(200).json({ message: "Token and User ID received" });
});

async function makeAuthenticatedRequest(userId, config) {
  let token = getToken(userId);
  try {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    return await axios(config);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      // Token expired, try to refresh
      const refreshed = await refreshToken(userId);
      console.log("Token refreshed");
      if (refreshed) {
        token = getToken(userId);
        config.headers.Authorization = `Bearer ${token}`;
        return axios(config); // retry request
      }
    }
    throw err; // some other error
  }
}

async function refreshToken(userId) {
  const refreshToken = store.get(`refreshToken_${userId}`);
  if (!refreshToken) {
    console.error(`[Token Refresh] No refresh token for user ${userId}`);
    return false;
  }

  try {
    const res = await axios.post("http://localhost:8080/auth/refresh", {
      refreshToken,
    });

    const newToken = res.data.accessToken;
    const newRefreshToken = res.data.refreshToken;
    console.log("newtoken", newToken);
    console.log("refresh", newRefreshToken);
    store.clear();
    setToken(userId, newToken);
    store.set(`refreshToken_${userId}`, newRefreshToken);
    console.log(`[Token Refresh] Refreshed token for user ${userId}`);
    return true;
  } catch (err) {
    console.error(`[Token Refresh Failed]`, err.response?.data || err.message);
    return false;
  }
}

apiServer.post("/logout", async (req, res) => {
  const { userId } = req.body;
  console.log(`[Logout] Request received for user ${userId}`);

  try {
    await stopTrackingForUser(userId);
    res.status(200).json({ message: "Tracking stopped and session ended." });
  } catch (error) {
    console.error("[Logout Error]", error);
    res.status(500).json({ error: "Failed to stop tracking" });
  }
});

apiServer.listen(API_PORT, () => {
  console.log(
    `🚀 Express API server in Electron listening on http://localhost:${API_PORT}`
  );
});

let mainWindow;
let tray = null;
let lastActivity = Date.now();

let sessionId = null;
let idleStart = null;
const IDLE_THRESHOLD = 5 * 60 * 1000; // 3 minutes
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
console.log("Preload path:", path.join(__dirname, "preload.js"));

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:5173");

  mainWindow.on("close", (e) => {
    e.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on("minimize", (e) => {
    e.preventDefault();
    mainWindow.hide();
  });

  const iconPath = path.join(__dirname, "desktime-logo.jpg");
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: "Show App", click: () => mainWindow.show() },
    { label: "Quit", click: () => app.quit() },
  ]);
  tray.setToolTip("DeskTime Clone");
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    shell.openExternal("http://localhost:5173"); // Opens React app in default browser
  });
}

function getStoredToken(tokenFromBrowser = null) {
  if (tokenFromBrowser) {
    store.set("authToken", tokenFromBrowser);
  }
  return store.get("authToken");
}

ipcMain.on("token", async (event, { userId, token }) => {
  console.log(`[Auth] Received token for user ${userId}`);
  setToken(userId, token);
  await startTrackingForUser(userId);
  event.sender.send("token-response", "Token received");
});
// window.electronAPI?.sendToken('your-token-value-here');

async function startTrackingForUser(userId) {
  const token = getToken(userId);
  console.log(`[Start Tracking] Starting tracking for user ${userId}`);
  console.log(`[Start Tracking] Token: ${token}`);
  if (!token) return;

  const today = new Date().toISOString().split("T")[0];
  const storedDate = getSessionDate(userId);
  if (today !== storedDate || !getSessionId(userId)) {
    isSessionEnded = false;
    // const oldSessionId = getSessionId(userId);
    // if (oldSessionId) await endSession(oldSessionId, token);
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
      const today = new Date().toISOString().split("T")[0];
      if (today !== getSessionDate(userId)) {
        isSessionEnded = false;
        //const oldSessionId = getSessionId(userId);
        //if (oldSessionId) await endSession(oldSessionId, token);
        const newSessionId = await initializeDailyTracking(userId, token);
        if (newSessionId) {
          setSessionId(userId, newSessionId);
          setSessionDate(userId, today);
          console.log(`[⏰ New Day] Session rolled over to new date ${today}`);
        }
      }
    }, 60 * 1000),

    idleCheck: setInterval(async () => {
      if (isSessionEnded) {
        return;
      }
      const idleTime = powerMonitor.getSystemIdleTime() * 1000;
      if (idleTime > IDLE_THRESHOLD) {
        sendActivityToServer({
          userId,
          type: "idle",
          timestamp: new Date(),
          token,
        });
      } else {
        const win = await activeWin().catch(console.error);
        if (win) {
          sendActivityToServer({
            userId,
            type: "active",
            app: win.owner.name,
            title: win.title,
            timestamp: new Date(),
            token,
          });
        }
      }
    }, 10 * 10000),

    mousePoll: setInterval(() => {
      mouse.getPosition().catch((err) => console.error("[Mouse Error]", err));
    }, 2000),

    screenshot: setInterval(() => {
      if (!systemIsSleeping) {
        captureScreenshot(userId, token);
      } else {
        console.log(`[Sleep Mode] Skipping screenshot for ${userId}`);
      }
    }, 1 * 60 * 1000),
  };
}

let sessionEnded = false;

async function initializeDailyTracking(userId, token) {
  // if (!sessionId || sessionEnded) return;

  try {
    // const res = await axios.get("http://localhost:8080/tracking/sessions", {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    const res = await makeAuthenticatedRequest(userId, {
      method: "get",
      url: "http://localhost:8080/tracking/sessions",
    });
    console.log("[Init Tracking] Existing sessions:", res.data.data);
    if (res.data.data) {
      return res.data.data._id;
    }

    // const createRes = await axios.post(
    //   "http://localhost:8080/tracking/sessions",
    //   {},
    //   {
    //     headers: { Authorization: `Bearer ${token}` },
    //   }
    // );
    const createRes = await makeAuthenticatedRequest(userId, {
      method: "post",
      url: "http://localhost:8080/tracking/sessions",
      data: {}, // body payload
    });
    console.log(createRes, "CREATE RESSSSSSSSS");
    return createRes.data.sessionId;
  } catch (err) {
    console.error("[Init Tracking Error]", err);
    return null;
  }
}

async function endSession(sessionId, token) {
  try {
    await axios.put(
      "http://localhost:8080/tracking/sessions/end",
      { sessionId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("[Session Ended]", sessionId);
  } catch (err) {
    console.error("[End Session Error]", err);
  }
}

let idleStartMap = {};
let activeStartMap = {};
let activeLastSentMap = {};

async function captureScreenshot(userId, token) {
  try {
    const sessionId = getSessionId(userId);
    if (!sessionId) return;

    // const user = await axios.get(`http://localhost:8080/users/${userId}`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    const user = await makeAuthenticatedRequest(userId, {
      method: "get",
      url: `http://localhost:8080/users/${userId}`,
    });
    console.log(user, "USER USER SUERERER");
    const {
      timeZone,
      trackingEndTime = "12:00",
      flexibleHours,
    } = user.data.data;
    const currentTime = moment().tz(timeZone);
    const [cutHour, cutMin] = trackingEndTime.split(":").map(Number);
    const cutoff = flexibleHours
      ? currentTime.clone().endOf("day").seconds(0)
      : currentTime.clone().hour(cutHour).minute(cutMin).second(0);

    if (currentTime.isAfter(cutoff)) {
      console.log(
        `[Tracking] Screenshot skipped for user ${userId} - after cutoff`
      );
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

    // const res = await axios.post(
    //   "http://localhost:8080/tracking/sessions/screenshots",
    //   formData,
    //   {
    //     headers: {
    //       ...formData.getHeaders(),
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );
    const res = await makeAuthenticatedRequest(userId, {
      method: "post",
      url: "http://localhost:8080/tracking/sessions/screenshots",
      data: formData,
      headers: {
        ...formData.getHeaders(), // Includes `Content-Type: multipart/form-data`
      },
    });
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

  const user = await makeAuthenticatedRequest(userId, {
    method: "get",
    url: `http://localhost:8080/users/${userId}`,
  });
  if (!user) return;
  console.log("[Send Activity] User:", user.data);
  const timeZone = user.data.data.timeZone;
  const trackingEndTimeStr = user.data.data.trackingEndTime;
  const flexible = user.data.data.flexibleHours;
  const currentTime = moment().tz(timeZone);
  const [cutHour, cutMin] = trackingEndTimeStr.split(":").map(Number);

  const trackingEnd = currentTime
    .clone()
    .hour(cutHour)
    .minute(cutMin)
    .second(0);
  const cutoff = flexible
    ? currentTime.clone().endOf("day").seconds(0) // 23:59:00
    : trackingEnd;

  // ✅ If current time is past cutoff, stop tracking
  if (currentTime.isAfter(cutoff)) {
    console.log(
      `[Tracking] Skipped for user ${userId} as current time ${currentTime.format()} > cutoff ${cutoff.format()}`
    );
    if (type === "idle") {
      const start = idleStartMap[userId];
      const duration = Math.floor((trackingEnd - start) / 1000);
      //db save
      await makeAuthenticatedRequest(userId, {
        method: "put",
        url: "http://localhost:8080/tracking/sessions/idle",
        data: {
          sessionId,
          duration,
          startTime: start,
          endTime: trackingEnd,
        },
      }).catch(console.error);
      idleStartMap[userId] = null;
      activeStartMap[userId] = null;
      activeLastSentMap[userId] = null;
      isSessionEnded = true;
    } else if (type === "active") {
      const start = activeStartMap[userId];
      const duration = Math.floor((trackingEnd - start) / 1000);
      //db save
      // await axios
      //   .put(
      //     "http://localhost:8080/tracking/sessions/active",
      //     {
      //       sessionId,
      //       startTime: activeStartMap[userId],
      //       endTime: trackingEnd,
      //       duration: duration,
      //     },
      //     {
      //       headers: { Authorization: `Bearer ${token}` },
      //     }
      //   )
      //   .catch(console.error);

      await makeAuthenticatedRequest(userId, {
        method: "put",
        url: "http://localhost:8080/tracking/sessions/active",
        data: {
          sessionId,
          startTime: activeStartMap[userId],
          endTime: trackingEnd,
          duration: duration,
        },
      }).catch(console.error);
      activeStartMap[userId] = null;
      idleStartMap[userId] = null;
      activeLastSentMap[userId] = null;
      isSessionEnded = true;
    }
    return;
  } else {
    console.log(
      `[Tracking] Time ${currentTime.format("HH:mm")} <= cutoff ${cutoff.format(
        "HH:mm"
      )}`
    );
  }

  const idleCandidateStartMap = {}; // Tracks when user *might* become idle

  if (type === "idle") {
    if (!idleCandidateStartMap[userId]) idleCandidateStartMap[userId] = now;

    const idleCandidateTime = idleCandidateStartMap[userId];

    // Only start tracking idle if threshold is met
    if (now - idleCandidateTime >= IDLE_THRESHOLD) {
      if (!idleStartMap[userId]) {
        idleStartMap[userId] = idleCandidateTime;

        if (activeStartMap[userId]) {
          const duration = Math.floor(
            (idleStartMap[userId] - activeStartMap[userId]) / 1000
          );

          await makeAuthenticatedRequest(userId, {
            method: "put",
            url: "http://localhost:8080/tracking/sessions/active",
            data: {
              sessionId,
              duration,
              startTime: activeStartMap[userId],
              endTime: idleStartMap[userId],
            },
          }).catch(console.error);
        }

        activeStartMap[userId] = null;
        activeLastSentMap[userId] = null;
      }
    }
  } else if (type === "active") {
    console.log("Tracking active");

    // If user was in idleCandidate mode but didn't cross the threshold, reset it
    idleCandidateStartMap[userId] = null;

    // If idle tracking had started, close it
    if (idleStartMap[userId]) {
      const idleEnd = now;
      const idleDuration = Math.floor((idleEnd - idleStartMap[userId]) / 1000);

      console.log("Idle time tracking started");

      await makeAuthenticatedRequest(userId, {
        method: "put",
        url: "http://localhost:8080/tracking/sessions/idle",
        data: {
          sessionId,
          startTime: idleStartMap[userId],
          endTime: idleEnd,
          duration: idleDuration,
        },
      }).catch(console.error);

      idleStartMap[userId] = null;
    }

    // Begin/resume active tracking
    if (!activeStartMap[userId]) {
      activeStartMap[userId] = now;
      activeLastSentMap[userId] = now;
    }

    if (now - activeLastSentMap[userId] >= ACTIVE_LOG_THRESHOLD) {
      const duration = Math.floor((now - activeStartMap[userId]) / 1000);

      await makeAuthenticatedRequest(userId, {
        method: "put",
        url: "http://localhost:8080/tracking/sessions/active",
        data: {
          sessionId,
          duration,
          startTime: activeStartMap[userId],
          endTime: now,
        },
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

  // if (sessionId && token) {
  //   await endSession(sessionId, token);
  // }

  // Clear store
  store.delete(`${getUserSessionKey(userId)}_id`);
  store.delete(`${getUserSessionKey(userId)}_date`);
  store.delete(`token_${userId}`);
  store.clear();

  console.log(`[Logout] Tracking stopped and store cleared for user ${userId}`);
}

app.whenReady().then(async () => {
  createWindow();
  const deskTimeAutoLauncher = new AutoLaunch({
    name: "DeskTimeApp",
    path: app.getPath("exe"),
  });

  deskTimeAutoLauncher.isEnabled().then((isEnabled) => {
    if (!isEnabled) deskTimeAutoLauncher.enable();
  });

  // ✅ Auto-resume tracking on app restart
  const allKeys = store.store;
  const userTokenKeys = Object.keys(allKeys).filter((key) =>
    key.startsWith("token_")
  );
  for (const tokenKey of userTokenKeys) {
    const userId = tokenKey.split("_")[1]; // from 'token_<userId>'
    const token = store.get(tokenKey);
    if (token) {
      console.log(
        `[Auto Resume] Found stored token for user ${userId}. Resuming tracking...`
      );
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

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
