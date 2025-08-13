const log = require("electron-log");
Object.assign(console, log.functions);

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
const fs = require("fs"); // Added for file system operations, useful for temp screenshots if needed
const Store = require("electron-store");
const moment = require("moment-timezone");
const AutoLaunch = require("auto-launch");

const store = new Store();
// store.clear(); // Keep this commented out unless you really need to clear all data

// ---------------------------------------------
// 🆕 Embedded Express server to receive token
// ---------------------------------------------
const express = require("express");
const cors = require("cors");

const apiServer = express();
const API_PORT = 3100;

apiServer.use(cors());
apiServer.use(express.json());

// === STATE MANAGEMENT PER USER ===
// Centralized object to hold all tracking-related state for each user
let userTrackingStates = {};
/*
userTrackingStates = {
    'userId1': {
        token: '...',
        refreshToken: '...',
        sessionId: '...',
        sessionDate: 'YYYY-MM-DD',
        intervals: { // Store interval IDs to clear them easily
            dateCheck: null,
            idleCheck: null,
            mousePoll: null,
            screenshot: null,
        },
        idleStart: null, // Timestamp when idle period started
        activeStart: null, // Timestamp when active period started
        lastActivityTimestamp: null, // Last recorded user activity (mouse/keyboard)
        lastActiveSentTimestamp: null, // Last time active log was sent to server
        isSleeping: false, // System sleep state
        isSessionEndedForDay: false, // Flag to indicate if daily tracking cutoff has passed
    },
    'userId2': { ... }
}
*/

const IDLE_THRESHOLD = 3 * 60 * 1000; // 3 minutes for idle detection
const ACTIVE_LOG_INTERVAL = 5 * 60 * 1000; // Log active time every 5 minutes
const SCREENSHOT_INTERVAL = 60 * 1000; // Take screenshot every 5 minutes

// --- Utility Functions ---

/**
 * Gets the tracking state object for a given user. Initializes it if it doesn't exist.
 * @param {string} userId
 * @returns {object} The tracking state object for the user.
 */
function getUserState(userId) {
  console.log("userId *********", userId)
  if (!userTrackingStates[userId]) {
    userTrackingStates[userId] = {
      token: store.get(`token_${userId}`),
      refreshToken: store.get(`refreshToken_${userId}`),
      sessionId: store.get(`session_id_${userId}`),
      sessionDate: store.get(`session_date_${userId}`),
      intervals: {},
      idleStart: null,
      activeStart: null,
      lastActivityTimestamp: Date.now(), // Initialize with current time on startup
      lastActiveSentTimestamp: null,
      isSleeping: false,
      isSessionEndedForDay: false,
    };
  }
  return userTrackingStates[userId];
}

/**
 * Updates the token and refresh token in store and in memory.
 * @param {string} userId
 * @param {string} token
 * @param {string} refreshToken
 */
function setTokens(userId, token, refreshToken) {
  const userState = getUserState(userId);
  userState.token = token;
  userState.refreshToken = refreshToken;
  store.set(`token_${userId}`, token);
  store.set(`refreshToken_${userId}`, refreshToken);
  console.log(`[Auth] Tokens updated for user: ${userId}`);
}

/**
 * Updates the session ID and date in store and in memory.
 * @param {string} userId
 * @param {string} sessionId
 */
function setSessionDetails(userId, sessionId) {
  const userState = getUserState(userId);
  userState.sessionId = sessionId;
  userState.sessionDate = new Date().toISOString().split("T")[0]; // Store today's date
  store.set(`session_id_${userId}`, sessionId);
  store.set(`session_date_${userId}`, userState.sessionDate);
  console.log(`[Session] Session ID ${sessionId} set for user ${userId}`);
}

// --- API Request Wrapper with Token Refresh ---

/**
 * Makes an authenticated request to the backend, handling token refresh.
 * @param {string} userId
 * @param {object} config Axios request config.
 * @returns {Promise<axios.AxiosResponse>}
 */
async function  makeAuthenticatedRequest(userId, config) {
  const userState = getUserState(userId);
  console.log(userState, 'userState>>>>>>>>>>>>>>>>')
  let token = userState.token;

  console.log("token :" + token);
  if (!token) {
    throw new Error(`[Auth Error] No token found for user ${userId}`);
  }

  try {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;

    return await axios(config);
  } catch (err) {
    console.log(err, "userId >>>>>>>>>>>>>.")

    if (err.response && err.response.status === 401) {
      console.warn(
        `[Auth] Token expired for user ${userId}. Attempting refresh.`
      );
      const refreshed = await refreshToken(userId);
      console.log(refreshed);
      if (refreshed) {
        token = getUserState(userId).token; // Get the newly refreshed token
        config.headers.Authorization = `Bearer ${token}`;
        return axios(config); // Retry request with new token
      } else {
        console.error(
          `[Auth] Failed to refresh token for user ${userId}. Logging out.`
        );
        // Optionally, trigger a re-login flow or notify the user
        await stopTrackingForUser(userId); // Stop tracking on persistent auth failure
        // You might want to send an IPC message to the renderer to show a login screen
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("auth-failed-relogin", userId);
        }
        throw new Error(`[Auth Error] Token refresh failed for user ${userId}`);
      }
    }
    throw err; // Re-throw other errors
  }
}

/**
 * Attempts to refresh the access token using the refresh token.
 * @param {string} userId
 * @returns {Promise<boolean>} True if refresh was successful, false otherwise.
 */
async function refreshToken(userId) {
  const userState = getUserState(userId);
  const refreshToken = userState.refreshToken;
  console.log("get refreshToken :" + refreshToken);

  if (!refreshToken) {
    console.error(
      `[Token Refresh] No refresh token available for user ${userId}`
    );
    return false;
  }

  try {
    console.log("refreshToken api calling");
    const res = await axios.post(
      "http://51.79.30.127:4005/auth/refresh",
      {
        refreshToken,
      }
    );

    const newToken = res.data.data.accessToken;
    const newRefreshToken = res.data.data.refreshToken;

    console.log("newToken :" + newToken);
    console.log("newRefreshToken :" + newRefreshToken);

    setTokens(userId, newToken, newRefreshToken); // Store new tokens
    console.log(
      `[Token Refresh] Successfully refreshed token for user ${userId}`
    );
    return true;
  } catch (err) {
    console.error(
      `[Token Refresh Failed] for user ${userId}:`,
      err.response?.data || err.message
    );
    return false;
  }
}

// --- Express API Endpoints ---

apiServer.post("/store-token", async (req, res) => {
  const { token, userId, refreshToken } = req.body;

  console.log(`✅ Token received in Electron for user: ${userId}`);
  console.log("in store token");

  // Set tokens immediately
  setTokens(userId, token, refreshToken);

  try {
    await startTrackingForUser(userId);
    res
      .status(200)
      .json({ message: "Token and User ID received, tracking started." });
  } catch (error) {
    console.error(`❌ Error starting tracking for user ${userId}:`, error);
    res.status(500).json({ error: "Failed to start tracking." });
  }
});

apiServer.post("/logout", async (req, res) => {
  const { userId } = req.body;
  console.log(`[Logout] Request received for user ${userId}`);

  try {
    await stopTrackingForUser(userId, true); // True to indicate explicit logout, end session on backend
    res.status(200).json({ message: "Tracking stopped and session ended." });
  } catch (error) {
    console.error("[Logout Error]", error);
    res.status(500).json({ error: "Failed to stop tracking" });
  }
});

apiServer.listen(API_PORT, () => {
  console.log(
    `🚀 Express API server in Electron listening on http://localhost:4005:${API_PORT}`
  );
});

let mainWindow;
let tray = null; // Initialize tray globally

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Start hidden to prevent flashing, show on ready-to-show
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false, // Ensure this is false for security
    },
  });

  mainWindow.loadURL("http://localhost:5173");

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("close", (e) => {
    e.preventDefault();
    mainWindow.hide(); // Minimize to tray instead of quitting
  });

  mainWindow.on("minimize", (e) => {
    e.preventDefault();
    mainWindow.hide(); // Minimize to tray
  });

  // Setup Tray icon
  const iconPath = path.join(__dirname, "desktime-logo.jpg"); // Use a .png for better quality
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: "Show App", click: () => mainWindow.show() },
    { label: "Quit", click: () => app.quit() },
  ]);
  tray.setToolTip("TrackMe Clone");
  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    shell.openExternal("http://localhost:5173");
  });
}

// --- IPC Main Listener (if you choose to use this for token delivery from renderer) ---
// Currently, your Express endpoint is the primary method.
// If you send token via IPC from React: window.electronAPI.sendToken(userId, token, refreshToken);
ipcMain.on(
  "send-token-from-renderer",
  async (event, { userId, token, refreshToken }) => {
    console.log(`[Auth] Received token via IPC for user ${userId}`);
    setTokens(userId, token, refreshToken);
    try {
      await startTrackingForUser(userId);
      event.sender.send(
        "token-response",
        "Token received and tracking started."
      );
    } catch (error) {
      console.error(
        `❌ Error starting tracking via IPC for user ${userId}:`,
        error
      );
      event.sender.send("token-response", `Error: ${error.message}`);
    }
  }
);

// --- Core Tracking Logic ---

/**
 * Initializes or continues a daily tracking session for a user.
 * It fetches existing session or creates a new one if needed.
 * @param {string} userId
 * @returns {Promise<string|null>} The session ID or null on failure.
 */
async function initializeDailyTracking(userId) {
  const userState = getUserState(userId);
  const today = moment().format("YYYY-MM-DD");
  console.log(userId, "userId >>>>>>>>>>>>>.")
  try {
    console.log("inside get today session api");
    // Check for existing session for today
    const checkRes = await makeAuthenticatedRequest(userId, {
      method: "get",
      url: `http://localhost:4005/tracking/sessions/user/${userId}/today`, // Assuming an endpoint to get today's session
    });
    console.log("checkRes :" +checkRes);
    console.log("checkRes data",checkRes.data.data)

    if (checkRes.data && checkRes.data.data && checkRes.data.data._id) {
      const existingSessionId = checkRes.data.data._id;
      setSessionDetails(userId, existingSessionId);
      console.log(
        `[Session] Continued existing session ${existingSessionId} for user ${userId} on ${today}`
      );

      // Check if cutoff has already passed for an existing session
      const user = await fetchUserConfig(userId);
      console.log(user);
      const currentTime = moment().tz(user.timeZone);
      const [cutHour, cutMin] = user.trackingEndTime.split(":").map(Number);
      const cutoff = user.flexibleHours
        ? currentTime.clone().endOf("day").seconds(0)
        : currentTime.clone().hour(cutHour).minute(cutMin).second(0);

      if (currentTime.isAfter(cutoff)) {
        userState.isSessionEndedForDay = true;
        console.log(
          `[Tracking] Session for user ${userId} already past cutoff for today.`
        );
        // Stop tracking if already past cutoff for the day
        await stopTrackingForUser(userId);
        return null; // Don't proceed with starting timers if already past cutoff
      } else {
        userState.isSessionEndedForDay = false; // Reset if it was set to true previously
        // If it's the same day and within tracking hours, ensure arrival time is set if not already
        if (!checkRes.data.data.arrivalTime) {
          // Assuming your session object has arrivalTime
          await makeAuthenticatedRequest(userId, {
            method: "put",
            url: `http://localhost:4005/tracking/sessions/${existingSessionId}/arrival`,
            data: { arrivalTime: new Date() },
          }).catch((e) => console.error("[Arrival Time Update Error]"));
        }
      }

      return existingSessionId;
    } else {
      console.log("creating session *******", userId);
      // No existing session for today, create a new one
      const createRes = await makeAuthenticatedRequest(userId, {
        method: "post",
        url: "http://localhost:4005/tracking/sessions",
        data: { arrivalTime: new Date() }, // Send arrival time on session creation
      });
    console.log("createRes data",createRes.data,createRes.data.data)

      if (createRes.data && createRes.data.sessionId) {
        setSessionDetails(userId, createRes.data.sessionId);
        console.log(
          `[Session] Created new session ${createRes.data.sessionId} for user ${userId} on ${today}`
        );
        userState.isSessionEndedForDay = false; // New session, so not ended
        return createRes.data.sessionId;
      } else {
        console.error("[Session] No session ID returned on creation.");
        return null;
      }
    }
  } catch (err) {
    console.error(
      `[Session Initialization Error] for user ${userId}:`,
      err.response?.data || err.message
    );
    // If initialization fails, prevent tracking from starting
    return null;
  }
}

/**
 * Fetches user configuration (timeZone, trackingEndTime, flexibleHours).
 * @param {string} userId
 * @returns {Promise<object>} User config object.
 */
async function fetchUserConfig(userId) {
  try {
    const userRes = await makeAuthenticatedRequest(userId, {
      method: "get",
      url: `http://localhost:4005/users/${userId}`,
    });
    return userRes.data.data;
  } catch (error) {
    console.error(
      `[User Config Error] Failed to fetch config for user ${userId}:`,
      error.response?.data || error.message
    );
    throw error; // Re-throw to indicate failure
  }
}

/**
 * Sends activity data (idle/active) to the server.
 * @param {string} userId
 * @param {string} type
 * @param {string} [app]
 * @param {string} [title]
 */
async function sendActivityToServer(
  userId,
  type,
  appName = null,
  title = null
) {
  const userState = getUserState(userId);
  const now = new Date();
  const sessionId = userState.sessionId;

  if (userState.isSessionEndedForDay || !sessionId || !userState.token) {
    console.log(
      `[Activity] Skipping send for ${userId}: session ended, no session, or no token.`
    );
    return;
  }

  let userConfig;
  try {
    userConfig = await fetchUserConfig(userId);
  } catch (error) {
    console.error(
      `[Activity] Could not fetch user config for ${userId}, skipping activity send.`,
      error
    );
    return;
  }
  console.log("userConfig :" + userConfig);
  const currentTime = moment().tz(userConfig.timeZone);
  const [cutHour, cutMin] = userConfig.trackingEndTime.split(":").map(Number);

  const trackingCutoffMoment = userConfig.flexibleHours
    ? currentTime.clone().endOf("day").seconds(0) // 23:59:59.999
    : currentTime.clone().hour(cutHour).minute(cutMin).second(0);

  // If current time is past cutoff, finalize segment and stop tracking
  if (currentTime.isAfter(trackingCutoffMoment)) {
    console.log(
      `[Tracking] Cutoff reached for user ${userId}: ${currentTime.format()} > ${trackingCutoffMoment.format()}`
    );
    userState.isSessionEndedForDay = true; // Mark session as ended for the day

    // Save the final active/idle segment, capped at trackingCutoffMoment
    if (type === "idle" && userState.idleStart) {
      const duration = Math.floor(
        (trackingCutoffMoment.valueOf() - userState.idleStart.valueOf()) / 1000
      );
      if (duration > 0) {
        await makeAuthenticatedRequest(userId, {
          method: "put",
          url: "http://localhost:4005/tracking/sessions/idle",
          data: {
            sessionId,
            duration,
            startTime: userState.idleStart,
            endTime: trackingCutoffMoment.toDate(),
          },
        }).catch(console.error);
      }
      userState.idleStart = null; // Clear state after sending
    } else if (type === "active" && userState.activeStart) {
      const duration = Math.floor(
        (trackingCutoffMoment.valueOf() - userState.activeStart.valueOf()) /
        1000
      );
      if (duration > 0) {
        await makeAuthenticatedRequest(userId, {
          method: "put",
          url: "http://localhost:4005/tracking/sessions/active",
          data: {
            sessionId,
            duration,
            startTime: userState.activeStart,
            endTime: trackingCutoffMoment.toDate(),
            appName: appName,
            title: title,
          },
        }).catch(console.error);
      }
      userState.activeStart = null; // Clear state after sending
      userState.lastActiveSentTimestamp = null;
    }

    await stopTrackingForUser(userId); // Stop all timers for this user
    return; // Exit as tracking for the day has ended
  }

  // --- Logic for tracking within cutoff hours ---
  if (type === "idle") {
    // If user was previously active, close the active segment
    if (userState.activeStart) {
      const duration = Math.floor(
        (now.valueOf() - userState.activeStart.valueOf()) / 1000
      );
      if (duration > 0) {
        await makeAuthenticatedRequest(userId, {
          method: "put",
          url: "http://localhost:4005/tracking/sessions/active",
          data: {
            sessionId,
            duration,
            startTime: userState.activeStart,
            endTime: now,
            appName: userState.lastActiveApp, // Use last known active app
            title: userState.lastActiveTitle, // Use last known active title
          },
        }).catch(console.error);
      }
      userState.activeStart = null;
      userState.lastActiveSentTimestamp = null;
    }
    // Start or continue idle tracking
    if (!userState.idleStart) {
      userState.idleStart = now;
      console.log(
        `[Activity] User ${userId} became idle at ${moment(now).format(
          "HH:mm:ss"
        )}`
      );
    }
    // Optional: Update idle log periodically if needed, similar to active.
    // For now, it will only log when changing from active to idle.
  } else if (type === "active") {
    // If user was previously idle, close the idle segment
    if (userState.idleStart) {
      const duration = Math.floor(
        (now.valueOf() - userState.idleStart.valueOf()) / 1000
      );
      if (duration > 0) {
        await makeAuthenticatedRequest(userId, {
          method: "put",
          url: "http://localhost:4005/tracking/sessions/idle",
          data: {
            sessionId,
            duration,
            startTime: userState.idleStart,
            endTime: now,
          },
        }).catch(console.error);
      }
      userState.idleStart = null;
      console.log(
        `[Activity] User ${userId} became active at ${moment(now).format(
          "HH:mm:ss"
        )}`
      );
    }

    // Start or continue active tracking
    if (!userState.activeStart) {
      userState.activeStart = now;
      userState.lastActiveSentTimestamp = now;
      userState.lastActiveApp = appName;
      userState.lastActiveTitle = title;
    }

    // Update the last known active window info
    userState.lastActiveApp = appName;
    userState.lastActiveTitle = title;

    // Send active log every ACTIVE_LOG_INTERVAL
    if (
      now.valueOf() - userState.lastActiveSentTimestamp.valueOf() >=
      ACTIVE_LOG_INTERVAL
    ) {
      const duration = Math.floor(
        (now.valueOf() - userState.activeStart.valueOf()) / 1000
      );
      if (duration > 0) {
        await makeAuthenticatedRequest(userId, {
          method: "put",
          url: "http://localhost:4005/tracking/sessions/active",
          data: {
            sessionId,
            duration,
            startTime: userState.activeStart,
            endTime: now,
            appName: appName,
            title: title,
          },
        }).catch(console.error);
      }
      // Reset activeStart to 'now' to start a new segment
      userState.activeStart = now;
      userState.lastActiveSentTimestamp = now;
    }
  }
  userState.lastActivityTimestamp = now; // Update last activity for mouse polling logic
}

/**
 * Captures and uploads a screenshot for a given user.
 * @param {string} userId
 */
async function captureScreenshot(userId) {
  const userState = getUserState(userId);
  const sessionId = userState.sessionId;
  console.log("Screenshot ****************8",userState)
  if (
    userState.isSessionEndedForDay ||
    userState.isSleeping ||
    !sessionId ||
    !userState.token
  ) {
    console.log(
      `[Screenshot] Skipping for ${userId}: session ended, sleeping, no session, or no token.`
    );
    return;
  }

  let userConfig;
  try {
    userConfig = await fetchUserConfig(userId);
  } catch (error) {
    console.error(
      `[Screenshot] Could not fetch user config for ${userId}, skipping screenshot.`,
      error
    );
    return;
  }
  console.log(userConfig);
  const currentTime = moment().tz(userConfig.timeZone);
  const [cutHour, cutMin] = userConfig.trackingEndTime.split(":").map(Number);
  const cutoff = userConfig.flexibleHours
    ? currentTime.clone().endOf("day").seconds(0)
    : currentTime.clone().hour(cutHour).minute(cutMin).second(0);

  if (currentTime.isAfter(cutoff)) {
    console.log(`[Screenshot] Skipped for user ${userId} - after cutoff.`);
    userState.isSessionEndedForDay = true;
    await stopTrackingForUser(userId); // Ensure tracking is stopped if cutoff is passed
    return;
  }

  try {
    const win = await activeWin();
    const appName = win ? win.owner.name : "unknown_app";
    const windowTitle = win ? win.title : "unknown_title";
    const appPath = win ? win.owner.path : null;

    let iconFileBuffer = null;
    let iconFilename = null;

    if (appPath) {
      try {
        const nativeImage = await app.getFileIcon(appPath, { size: "normal" });
        iconFileBuffer = nativeImage.toPNG();
        iconFilename = `icon_${appName.replace(/\s+/g, "-")}_${Date.now()}.png`;
      } catch (iconError) {
        console.error(`❌ Error getting icon for ${appName}:`, iconError);
        // On error, iconFileBuffer and iconFilename will remain null
      }
    }

    // Skip if screen is locked, or no active window (e.g., desktop)
    if (!win || win.owner.name.toLowerCase().includes("lock") || !win.title) {
      console.log(
        `[Screenshot] Skipped: locked screen or no active window for user ${userId}`
      );
      return;
    }

    const imgBuffer = await screenshot({ format: "jpg" });
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("sessionId", sessionId);
    formData.append("screenshotApp", appName);
    formData.append("screenshotTitle", windowTitle); // Include window title for screenshot context
    formData.append("timestamp", new Date().toISOString()); // Timestamp for the screenshot

    if (iconFileBuffer) {
      formData.append("screenshotAppIcon", iconFileBuffer, {
        filename: iconFilename,
        contentType: "image/png",
      });
    }

    formData.append("screenshot", imgBuffer, {
      filename: `screenshot_${appName.replace(/\s+/g, "-")}_${Date.now()}.jpg`,
      contentType: "image/jpeg",
    });

    const res = await makeAuthenticatedRequest(userId, {
      method: "post",
      url: "http://localhost:4005/tracking/sessions/screenshots",
      data: formData,
      headers: {
        ...formData.getHeaders(), // Important for multipart/form-data
      },
    });
    console.log(`[Screenshot Uploaded] for user ${userId}:`, res.data);
  } catch (err) {
    console.error(`[Screenshot Error] for user ${userId}:`, err.message);
    if (err.response) {
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
    }
  }
}


/**
 * Starts all tracking intervals for a specific user.
 * @param {string} userId
 */

async function startScreenshotLoop(userId) {
  const userState = getUserState(userId);
  if (
    userState.isSessionEndedForDay ||
    userState.isSleeping ||
    !userState.token
  ) {
    console.log(
      `[Screenshot Loop] Skipping for ${userId}: session ended, sleeping, or no token.`
    );
    return;
  }

  // Await the completion of the screenshot capture before scheduling the next one
  await captureScreenshot(userId);

  // Schedule the next screenshot only after the previous one has finished
  if (!userState.isSessionEndedForDay && !userState.isSleeping) {
    userState.intervals.screenshot = setTimeout(
      () => startScreenshotLoop(userId),
      SCREENSHOT_INTERVAL
    );
  }
}
async function startTrackingForUser(userId) {
  const userState = getUserState(userId);
  if (!userState.token) {
    console.error(`[Start Tracking] Cannot start: No token for user ${userId}`);
    return;
  }

  // Ensure intervals are cleared if they somehow remained from a previous run
  if (Object.keys(userState.intervals).length > 0) {
    console.log(
      `[Start Tracking] Clearing existing intervals for user ${userId} before restarting.`
    );
    Object.values(userState.intervals).forEach(clearInterval);
    userState.intervals = {}; // Reset intervals object
  }

  // Initialize daily session (get existing or create new)
  const sessionId = await initializeDailyTracking(userId);
  if (!sessionId) {
    console.error(
      `[Start Tracking] Failed to get/create session for user ${userId}. Aborting tracking start.`
    );
    return; // Don't start timers if session init failed or cutoff already passed
  }

  userState.sessionId = sessionId; // Ensure userState has the current sessionId
  userState.isSessionEndedForDay = false; // Reset for a new valid session

  console.log(
    `[Start Tracking] Starting timers for user ${userId} with session ${sessionId}`
  );

  // Date Check (once per minute) - to roll over session on new day
  userState.intervals.dateCheck = setInterval(async () => {
    const today = moment().format("YYYY-MM-DD");
    if (today !== userState.sessionDate) {
      console.log(
        `[⏰ New Day Detected] for user ${userId}. Rolling over session.`
      );
      // Optionally, send a final 'end' for the previous day's session here if desired
      // await endSession(userState.sessionId, userState.token); // If you decide to explicitly end sessions daily

      await stopTrackingForUser(userId); // Stop current tracking before starting new
      await startTrackingForUser(userId); // Re-initialize for the new day
    }
  }, 60 * 1000); // Check every minute

  // Idle/Active Check (every 10 seconds)
  userState.intervals.idleCheck = setInterval(async () => {
    if (userState.isSessionEndedForDay || userState.isSleeping) {
      // console.log(`[Idle/Active Check] Skipping for ${userId}: session ended or sleeping.`);
      return;
    }

    const idleTimeSeconds = powerMonitor.getSystemIdleTime(); // in seconds
    const idleTimeMs = idleTimeSeconds * 1000;

    if (idleTimeMs >= IDLE_THRESHOLD) {
      await sendActivityToServer(userId, "idle");
    } else {
      const win = await activeWin().catch((err) => {
        console.error(`[ActiveWin Error] for ${userId}:`, err.message);
        return null;
      });

      if (win) {
        // Only send active if the window is truly active and not a lock screen
        if (!win.owner.name.toLowerCase().includes("lock") && win.title) {
          await sendActivityToServer(
            userId,
            "active",
            win.owner.name,
            win.title
          );
        } else {
          // If a lock screen or no title, treat as semi-idle or un-trackable
          await sendActivityToServer(userId, "idle"); // Consider it idle if locked/no valid window
        }
      } else {
        // If no active window found (e.g., desktop), treat as idle
        await sendActivityToServer(userId, "idle");
      }
    }
  }, 10 * 1000); // Check every 10 seconds

  // Mouse Poll (every 2 seconds) - to update lastActivityTimestamp, if needed for other logic
  userState.intervals.mousePoll = setInterval(() => {
    mouse
      .getPosition()
      .then(() => {
        userState.lastActivityTimestamp = Date.now();
      })
      .catch((err) => {
        // console.error("[Mouse Error]", err.message); // Too verbose for frequent logging
      });
  }, 2000);

  // Screenshot Capture (every SCREENSHOT_INTERVAL)
  startScreenshotLoop(userId);
}

/**
 * Stops all tracking intervals and clears state for a specific user.
 * @param {string} userId
 * @param {boolean} [endSessionOnBackend=false] Whether to explicitly end the session on the backend.
 */
async function stopTrackingForUser(userId, endSessionOnBackend = false) {
  const userState = getUserState(userId);

  console.log(`[Stop Tracking] Stopping all tracking for user ${userId}.`);

  // 1. Clear all intervals
  if (userState.intervals) {
    Object.values(userState.intervals).forEach(clearInterval);
    userState.intervals = {}; // Clear the object
  }
  userState.isSessionEndedForDay = true;

  console.log("userState: " + userState);

  console.log("Intervals :" + userState.intervals);
  console.log("idleStart :" + userState.idleStart);
  console.log("activeStart :" + userState.activeStart);
  console.log("lastActivityTimestamp :" + userState.lastActivityTimestamp);
  console.log("lastActiveSentTimestamp :" + userState.lastActiveSentTimestamp);
  console.log("isSleeping :" + userState.isSleeping);
  console.log("isSessionEndedForDay :" + userState.isSessionEndedForDay);
<<<<<<< HEAD

=======
>>>>>>> 3f432e5d5b7c4033b20f03e09ea200ed6a51562e

  // 3. Save any pending active/idle time before stopping if not already saved by cutoff logic
  // This is a safeguard, primarily the cutoff logic in sendActivityToServer should handle it
  // But if logout happens mid-segment, ensure it's saved.
  const now = new Date();
  console.log("Saving while stopping");
  if (userState.sessionId && userState.token) {
    if (userState.activeStart) {
      const duration = Math.floor(
        (now.valueOf() - userState.activeStart.valueOf()) / 1000
      );
      if (duration > 0) {
        await makeAuthenticatedRequest(userId, {
          method: "put",
          url: "http://localhost:4005/tracking/sessions/active",
          data: {
            sessionId: userState.sessionId,
            duration,
            startTime: userState.activeStart,
            endTime: now,
            appName: userState.lastActiveApp,
            title: userState.lastActiveTitle,
          },
        }).catch(console.error);
        console.log("Saving active time while stopping");
      }
    } else if (userState.idleStart) {
      const duration = Math.floor(
        (now.valueOf() - userState.idleStart.valueOf()) / 1000
      );
      if (duration > 0) {
        await makeAuthenticatedRequest(userId, {
          method: "put",
          url: "http://localhost:4005/tracking/sessions/idle",
          data: {
            sessionId: userState.sessionId,
            duration,
            startTime: userState.idleStart,
            endTime: now,
          },
        }).catch(console.error);
        console.log("Saving idle time while stopping");
      }
    }
  }
  userState.idleStart = null;
  userState.activeStart = null;
  userState.lastActivityTimestamp = null;
  userState.lastActiveSentTimestamp = null;
  userState.lastActiveApp = null;
  userState.lastActiveTitle = null;
  userState.isSessionEndedForDay = true; // Mark as ended

  // 4. Optionally send end session signal to backend (only on explicit logout or daily rollover end)
  if (endSessionOnBackend && userState.sessionId && userState.token) {
    try {
      await makeAuthenticatedRequest(userId, {
        method: "put",
        url: "http://localhost:4005/tracking/sessions/end",
        data: { sessionId: userState.sessionId },
      });
      console.log(
        `[Session] Backend session ${userState.sessionId} ended for user ${userId}`
      );
    } catch (err) {
      console.error(
        `[End Session Error] for user ${userId}:`,
        err.response?.data || err.message
      );
    }
  }

  // 5. Clear stored data specific to this user if it's an explicit logout
  if (endSessionOnBackend) {
    store.delete(`session_id_${userId}`);
    store.delete(`session_date_${userId}`);

    // Also remove the user's state from the in-memory map
    userTrackingStates = {};
    console.log(`[Store] Cleared all stored data for user ${userId}.`);
  } else {
    // If not explicit logout (e.g., daily cutoff), clear session ID/date
    // but keep tokens for potential auto-resume tomorrow
    store.delete(`session_id_${userId}`);
    store.delete(`session_date_${userId}`);
    console.log(
      `[Store] Cleared session data for user ${userId}, kept tokens.`
    );
  }
}

// --- Electron App Lifecycle ---

app.whenReady().then(async () => {
  createWindow();

  // Auto-launch setup
  const deskTimeAutoLauncher = new AutoLaunch({
    name: "TrackMeApp",
    path: app.getPath("exe"),
  });

  deskTimeAutoLauncher
    .isEnabled()
    .then((isEnabled) => {
      if (!isEnabled) {
        deskTimeAutoLauncher
          .enable()
          .catch((err) => console.error("Failed to enable auto-launch:", err));
        console.log("Auto-launch enabled.");
      } else {
        console.log("Auto-launch already enabled.");
      }
    })
    .catch((err) => console.error("Error checking auto-launch status:", err));

  // Auto-resume tracking for any stored users on app restart
  const allStoredKeys = store.store;
  const userTokenKeys = Object.keys(allStoredKeys).filter((key) =>
    key.startsWith("token_")
  );

  for (const tokenKey of userTokenKeys) {
    const userId = tokenKey.split("_")[1]; // Extract userId from 'token_<userId>'
    console.log(userId, "userId**************")
    const userState = getUserState(userId); // Get or initialize userState
    userState.token = store.get(tokenKey);
    userState.refreshToken = store.get(`refreshToken_${userId}`);

    if (userState.token) {
      console.log(
        `[Auto Resume] Found stored token for user ${userId}. Attempting to resume tracking...`
      );
      try {
        await startTrackingForUser(userId);
      } catch (error) {
        console.error(
          `[Auto Resume Error] Failed to resume tracking for user ${userId}:`,
          error.message
        );
        // Consider prompting re-login or stopping fully if auto-resume fails
        await stopTrackingForUser(userId, true); // Treat as an implicit logout if it can't resume
      }
    }
  }
});

// --- Power Monitoring (System Sleep/Resume) ---
powerMonitor.on("suspend", () => {
  console.log("[System] Going to sleep...");
  // Mark all active users as sleeping and pause their screenshots
  for (const userId in userTrackingStates) {
    const userState = userTrackingStates[userId];

    console.log("userState: " + userState);

    userState.isSleeping = true;
    if (userState.intervals.screenshot) {
      clearInterval(userState.intervals.screenshot);
      userState.intervals.screenshot = null; // Clear and nullify
    }
    // Also consider sending a final activity log (e.g., active -> idle for sleep duration)
    // if a user was active right before suspend. For simplicity, we assume idleCheck handles it.
  }
});

powerMonitor.on("resume", async () => {
  console.log("[System] Resumed from sleep...");
  // Resume tracking for all users
  for (const userId in userTrackingStates) {
    const userState = userTrackingStates[userId];
    console.log("userState: " + userState);

    userState.isSleeping = false; // System is awake now

    // Re-start screenshot interval if it was running before suspend
    if (
      userState.token &&
      !userState.intervals.screenshot &&
      !userState.isSessionEndedForDay
    ) {
      console.log(
        `[Resume] Restarting screenshot interval for user ${userId}.`
      );
      startScreenshotLoop(userId);
    }

    // Force an immediate activity check after resume to correct state
    // This will either register active time or mark as idle if still idle after resume
    console.log(`[Resume] Forcing activity check for user ${userId}.`);
    const idleTimeSeconds = powerMonitor.getSystemIdleTime();
    const idleTimeMs = idleTimeSeconds * 1000;
    if (idleTimeMs >= IDLE_THRESHOLD) {
      await sendActivityToServer(userId, "idle");
    } else {
      const win = await activeWin().catch((err) => {
        console.error(
          `[ActiveWin Error on Resume] for ${userId}:`,
          err.message
        );
        return null;
      });
      if (win) {
        if (!win.owner.name.toLowerCase().includes("lock") && win.title) {
          await sendActivityToServer(
            userId,
            "active",
            win.owner.name,
            win.title
          );
        } else {
          await sendActivityToServer(userId, "idle"); // Treat as idle if locked/no valid window
        }
      } else {
        await sendActivityToServer(userId, "idle");
      }
    }
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // Before quitting, ensure all intervals are stopped and any pending data is saved
    for (const userId in userTrackingStates) {
      // For graceful shutdown, attempt to save final segments
      const userState = userTrackingStates[userId];
      if (userState.activeStart) {
        const duration = Math.floor(
          (Date.now() - userState.activeStart.valueOf()) / 1000
        );
        if (duration > 0 && userState.sessionId && userState.token) {
          makeAuthenticatedRequest(userId, {
            // Use makeAuthenticatedRequest
            method: "put",
            url: "http://localhost:4005/tracking/sessions/active",
            data: {
              sessionId: userState.sessionId,
              duration,
              startTime: userState.activeStart,
              endTime: new Date(),
              appName: userState.lastActiveApp,
              title: userState.lastActiveTitle,
            },
          }).catch((e) =>
            console.error("Failed to save final active segment on quit:", e)
          );
        }
      } else if (userState.idleStart) {
        const duration = Math.floor(
          (Date.now() - userState.idleStart.valueOf()) / 1000
        );
        if (duration > 0 && userState.sessionId && userState.token) {
          makeAuthenticatedRequest(userId, {
            // Use makeAuthenticatedRequest
            method: "put",
            url: "http://localhost:4005/tracking/sessions/idle",
            data: {
              sessionId: userState.sessionId,
              duration,
              startTime: userState.idleStart,
              endTime: new Date(),
            },
          }).catch((e) =>
            console.error("Failed to save final idle segment on quit:", e)
          );
        }
      }
      stopTrackingForUser(userId); // This will clear intervals
    }
    app.quit();
  }
});
