// D:\avinesh-works\desktime-app\desktime\main.js

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
const { mouse, keyboard, Button, Key } = require("@nut-tree-fork/nut-js");
const activeWin = require("active-win");
const screenshot = require("screenshot-desktop");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const Store = require("electron-store").default;
const store = new Store();

// You had this here, keeping it commented as per your request unless you need it for every launch
// store.clear();
// console.log('[Store] Cleared all data'); // This log should only show if store.clear() is uncommented

console.log("--- Main process started execution ---"); // Very first log from main process

let mainWindow;
let tray = null;
let lastActivity = Date.now();

let sessionId = null;
let idleStart = null;
const IDLE_THRESHOLD = 3 * 60 * 1000; // 3 minutes
const ACTIVE_LOG_THRESHOLD = 5 * 60 * 1000; // 5 minutes
const USER_ID = "685a3e5726ac65ec09c16786";
let activeLastSent = null;

let idleCheckStart = null;

let electronAuthToken = null;
global.isTrackingStarted = false;

function getAuthTokenForMainProcess() {
  if (electronAuthToken) {
    return electronAuthToken;
  }
  return store.get("authToken");
}

ipcMain.on("token", (event, token) => {
  console.log("Main: Received token from renderer:", token);
  electronAuthToken = token;
  store.set("authToken", token);
  console.log(electronAuthToken, "ELECTRON TOKEN");

  if (electronAuthToken && !global.isTrackingStarted) {
    global.isTrackingStarted = true;
    console.log("Main: Token received, starting tracking...");
    startTracking();
    event.sender.send("token-response", "Token received and tracking started");
  } else {
    event.sender.send(
      "token-response",
      "Token received (tracking already started or token not present)"
    );
  }
});

function createWindow() {
  const preloadPath = path.join(__dirname, "preload.js");
  console.log(
    "Main: Attempting to create BrowserWindow with preload path:",
    preloadPath
  ); // Added detailed preload path log

  try {
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      show: false, // Window will be shown on 'ready-to-show'
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: preloadPath,
        devTools: true, // TEMPORARILY SET TO TRUE FOR DEBUGGING THIS ISSUE
      },
    });

    console.log("Main: BrowserWindow instance created."); // Confirm browser window object creation

    mainWindow
      .loadURL("http://localhost:5173")
      .then(() => {
        console.log("Main: Renderer content load successful."); // Confirm URL loading success
        // DevTools are opened via webPreferences, but can also be opened here for certainty:
        // mainWindow.webContents.openDevTools();
      })
      .catch((err) => {
        console.error("Main: Error loading renderer URL:", err); // Catch load URL errors
      });

    mainWindow.on("ready-to-show", () => {
      mainWindow.show();
      console.log("Main: BrowserWindow ready to show and visible."); // Log when window is ready to be seen
    });

    mainWindow.on("close", (e) => {
      e.preventDefault();
      mainWindow.hide();
      console.log("Main: Window hidden on close event."); // Log window close action
    });

    mainWindow.on("minimize", (e) => {
      e.preventDefault();
      mainWindow.hide();
      console.log("Main: Window hidden on minimize event."); // Log window minimize action
    });

    const iconPath = path.join(__dirname, "desktime-logo.jpg");
    if (!fs.existsSync(iconPath)) {
      console.warn("Main: ⚠️ Tray icon not found:", iconPath);
    }

    tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
      { label: "Show App", click: () => mainWindow.show() },
      { label: "Quit", click: () => app.quit() },
    ]);
    tray.setToolTip("DeskTime Clone");
    tray.setContextMenu(contextMenu);

    tray.on("click", () => {
      shell.openExternal("http://localhost:5173");
      console.log("Main: Tray clicked, opening external URL."); // Log tray click
    });
  } catch (error) {
    console.error(
      "Main: FATAL ERROR during BrowserWindow creation or setup:",
      error
    );
    app.quit();
  }
}

app
  .whenReady()
  .then(() => {
    console.log("Main: app.whenReady() triggered."); // Log app ready event
    createWindow();
    app.on("activate", function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  })
  .catch((err) => {
    console.error("Main: Error during app.whenReady():", err); // Catch app ready errors
    app.quit();
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
  console.log("Main: All windows closed, app quitting."); // Log app quit
});

// --- Tracking and API Functions (Keeping them as they were, assuming they use getAuthTokenForMainProcess) ---

let sessionEnded = false;

async function checkIfSessionEnded() {
  const token = getAuthTokenForMainProcess();
  if (!sessionId || sessionEnded || !token) {
    if (!token)
      console.warn("checkIfSessionEnded skipped: No token available.");
    return;
  }
  try {
    const response = await axios.get(
      `http://localhost:4005/tracking/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data?.leftTime) {
      sessionEnded = true;
    }
  } catch (err) {
    console.error(
      "[Session Check Error]",
      err.response ? err.response.data : err.message
    );
  }
}

let activeStartTime = null;

async function sendActivityToServer(data) {
  const token = getAuthTokenForMainProcess();
  if (!sessionId || sessionEnded || !token) {
    if (!token)
      console.warn(
        "Activity upload skipped: No token available in main process."
      );
    return;
  }
  await checkIfSessionEnded();
  if (sessionEnded) return;

  const now = new Date();
  if (data.type === "idle") {
    if (!idleCheckStart) idleCheckStart = now;

    if (now - idleCheckStart >= IDLE_THRESHOLD && !idleStart) {
      idleStart = idleCheckStart;
      if (activeStartTime) {
        const endTime = idleStart;
        const duration = Math.floor((endTime - activeStartTime) / 1000);
        axios
          .put(
            "http://localhost:4005/tracking/sessions/active",
            {
              sessionId,
              duration,
              startTime: activeStartTime,
              endTime,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .catch((err) =>
            console.error(
              "[Active Update Error]",
              err.response ? err.response.data : err.message
            )
          );
        activeStartTime = null;
        activeLastSent = null;
      }
    }
  } else if (data.type === "active") {
    if (idleStart) {
      const idleEnd = now;
      const idleDuration = Math.floor((idleEnd - idleStart) / 1000);
      axios
        .put(
          "http://localhost:4005/tracking/sessions/idle",
          {
            sessionId,
            startTime: idleStart,
            endTime: idleEnd,
            duration: idleDuration,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch((err) =>
          console.error(
            "[Idle Update Error]",
            err.response ? err.response.data : err.message
          )
        );
    }
    idleStart = null;
    idleCheckStart = null;
    if (!activeStartTime) {
      activeStartTime = now;
      activeLastSent = now;
    }
    if (now - activeLastSent >= ACTIVE_LOG_THRESHOLD) {
      const endTime = now;
      const duration = Math.floor((endTime - activeStartTime) / 1000);
      axios
        .put(
          "http://localhost:4005/tracking/sessions/active",
          {
            sessionId,
            duration,
            startTime: activeStartTime,
            endTime,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .catch((err) =>
          console.error(
            "[Active Update Error]",
            err.response ? err.response.data : err.message
          )
        );
      activeStartTime = now;
      activeLastSent = now;
    }
  }
}

async function startTracking() {
  console.log("Starting tracking...");
  await initializeDailyTracking(USER_ID);

  setInterval(() => {
    try {
      const idleTime = powerMonitor.getSystemIdleTime() * 1000;
      if (idleTime > IDLE_THRESHOLD) {
        sendActivityToServer({ type: "idle", timestamp: new Date() });
      } else {
        activeWin()
          .then((win) => {
            if (win) {
              const activity = {
                type: "active",
                app: win.owner.name,
                title: win.title,
                timestamp: new Date(),
              };
              sendActivityToServer(activity);
            }
          })
          .catch((err) => console.error("[ActiveWin Error]", err));
      }
    } catch (err) {
      console.error("[Idle Check Error]", err);
    }
  }, 10000);

  setInterval(async () => {
    try {
      const pos = await mouse.getPosition();
    } catch (err) {
      console.error("[Mouse Poll Error]", err);
    }
  }, 2000);

  setInterval(async () => {
    try {
      const win = await activeWin();
      const appName = win ? win.owner.name : "unknown";
      const token = getAuthTokenForMainProcess();

      if (!token) {
        console.warn(
          "Screenshot upload skipped: No token available in main process."
        );
        return;
      }
      console.log("Token for screenshot upload:", token);

      const imgBuffer = await screenshot({ format: "jpg" });

      const formData = new FormData();
      formData.append("userId", USER_ID);
      formData.append("sessionId", sessionId);
      formData.append("screenshotApp", appName);
      formData.append("screenshot", imgBuffer, {
        filename: `screenshot_${appName.replace(
          /\s+/g,
          "-"
        )}_${Date.now()}.jpg`,
        contentType: "image/jpeg",
      });
      const response = await axios.post(
        "http://localhost:4005/tracking/sessions/screenshots",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Screenshot uploaded successfully:", response.data);
    } catch (err) {
      console.error(
        "[Screenshot Error]",
        err.response ? err.response.data : err.message
      );
    }
  }, 5 * 60 * 1000);
}

async function initializeDailyTracking(userId) {
  const today = new Date().toISOString().split("T")[0];
  const token = getAuthTokenForMainProcess();

  if (!token) {
    console.error(
      "Initialization skipped: No token available to initialize tracking session."
    );
    return;
  }
  try {
    const res = await axios.get(
      `http://localhost:4005/tracking/sessions?userId=${userId}&date=${today}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.data) {
      sessionId = res.data.data._id;
    } else {
      const createRes = await axios.post(
        "http://localhost:4005/tracking/sessions",
        {
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      sessionId = createRes.data.sessionId;
    }
    console.log("[Tracking] Initialized session:", sessionId);
  } catch (err) {
    console.error(
      "[Tracking Init Error]",
      err.response ? err.response.data : err.message
    );
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

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
