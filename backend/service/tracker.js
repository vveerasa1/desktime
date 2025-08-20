const IdleLog = require("../models/idleTimeLogs");
const TrackingSession = require("../models/trackingSession");
const cron = require("node-cron");
const User = require("../models/user");
const moment = require("moment-timezone");
const OfflineRequest = require("../models/offlineRequest");
const { splitOfflineTimeIntoIntervals } = require("../service/dashboard");
const ActiveApps = require("../models/activeApps");
const ProductivityApps = require("../models/productivityApps");
const { uploadFileToS3 } = require("./upload");
const config = require("../config");

const tracking = async (req, res) => {
  try {
    const user = req.user;
    console.log("user :" + user);
    let userId = user.userId;
    let timeZone = user.timeZone;
    const now = moment().tz(timeZone).toDate();

    // const endOfDay = moment().tz(timeZone).set({
    //   hour: 23,
    //   minute: 0,
    //   second: 0,
    //   millisecond: 0,
    // });

    // Set leftTime as the difference (in milliseconds or ISO Date format)
    // const leftTime = endOfDay.toDate();
    const session = await TrackingSession.create({
      userId,
      arrivalTime: now,
      // leftTime: leftTime,
    });
    res.json({ sessionId: session._id });
  } catch (error) {
    res.status(500).json({ message: "Failed to start session", error });
  }
};

const getUserTrackingInfo = async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    let userId = user.userId;
    let timeZone = user.timeZone;
    const now = moment().tz(timeZone).toDate();

    if (!userId || !now) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        message: "userId and date are required",
      });
    }

    const startOfDay = moment.tz(now, timeZone).startOf("day").toDate();
    const endOfDay = moment.tz(now, timeZone).endOf("day").toDate();

    const session = await TrackingSession.findOne({
      userId,
      arrivalTime: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Tracking session fetched successfully",
      data: session
        ? {
            ...session._doc,
            arrivalTime: moment(session.arrivalTime)
              .tz(timeZone)
              .format("YYYY-MM-DD HH:mm:ss z"),
          }
        : null,
    });
  } catch (err) {
    console.error("Error fetching tracking session:", err);
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Internal server error",
    });
  }
};

// body: { userId, sessionId, idleStartTime, idleEndTime }
const idleTimeTracker = async (req, res) => {
  try {
    const { sessionId, startTime, endTime, duration } = req.body;
    console.log("sessionId :" + sessionId);

    const session = await TrackingSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    let userId = session.userId;
    const user = await User.findById(userId);
    let timeZone = user.timeZone;

    const lastidlePeriod =
      session.idlePeriods && session.idlePeriods.length > 0
        ? session.idlePeriods[session.idlePeriods.length - 1].end
        : null;
    let lastActivePeriod =
      session.activePeriods && session.activePeriods.length > 0
        ? session.activePeriods[session.activePeriods.length - 1].end
        : null;

    if (lastidlePeriod && new Date(lastidlePeriod) > new Date(startTime)) {
      return res.status(400).json({
        message: "New idle startTime must be after last idle end time",
      });
    }

    const endTimeIST = moment(endTime).tz(timeZone);
    const endHour = endTimeIST.hour();
    const endMin = endTimeIST.minute();

    const [trackingEndHour, trackingEndMin] = user.trackingEndTime
      .split(":")
      .map(Number);

    if (
      endTime === lastidlePeriod ||
      endTime === lastActivePeriod ||
      (endHour === trackingEndHour && endMin === trackingEndMin)
    ) {
      if (lastActivePeriod) {
        const lastEndIST = moment(lastActivePeriod).tz(timeZone);
        const lastEndHour = lastEndIST.hour();
        const lastEndMin = lastEndIST.minute();

        await TrackingSession.findByIdAndUpdate(sessionId, {
          leftTime: `${lastEndHour}:${
            lastEndMin < 10 ? "0" + lastEndMin : lastEndMin
          }`,
        });
        leftTimeSet = true;
        const arrivalIST = moment(session.arrivalTime).tz(timeZone);

        const leftIST = arrivalIST
          .clone()
          .hour(lastEndHour)
          .minute(lastEndMin)
          .second(0);

        // Calculate difference in seconds
        const timeAtWork = leftIST.diff(arrivalIST, "seconds");
        const totalTrackedTime = session.totalTrackedTime;
        if (totalTrackedTime > timeAtWork) {
          session.totalTrackedTime = timeAtWork;
        }

        // Store in session
        await TrackingSession.findByIdAndUpdate(sessionId, {
          timeAtWork,
          totalTrackedTime,
        });
      }
    }
    const canTrack = isWithinTrackingHours(user);

    if (!canTrack) {
      console.log(
        `User ${user.username} is outside tracking hours or day. Skipping.`
      );
      return;
    }

    // Log idle entry separately (optional for audit)
    await IdleLog.create({
      userId,
      sessionId,
      startTime,
      endTime,
      duration,
    });

    // Update session with idle period and increment total idleTime
    await TrackingSession.findByIdAndUpdate(sessionId, {
      $push: {
        idlePeriods: {
          start: startTime,
          end: endTime,
          duration,
        },
      },
      $inc: { idleTime: duration },
    });

    res.json({ status: "Idle time logged successfully." });
  } catch (error) {
    console.error("[IdleTimeTracker Error]", error);
    res.status(500).json({ message: "Failed to log idle time", error });
  }
};

// body: { sessionId, duration }
const activeTimeTracker = async (req, res) => {
  try {
    const { sessionId, duration, startTime, endTime } = req.body;
    const session = await TrackingSession.findById(sessionId);
    if (duration > 350) {
      return idleTimeTracker(req, res);
    }

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    const lastidlePeriod =
      session.idlePeriods && session.idlePeriods.length > 0
        ? session.idlePeriods[session.idlePeriods.length - 1].end
        : null;
    let lastActivePeriod =
      session.activePeriods && session.activePeriods.length > 0
        ? session.activePeriods[session.activePeriods.length - 1].end
        : null;
    if (lastActivePeriod && new Date(lastActivePeriod) > new Date(startTime)) {
      return res.status(400).json({
        message: "New active startTime must be after last idle end time",
      });
    }

    let userId = session.userId;
    const user = await User.findById(userId);
    let timeZone = user.timeZone;

    const endTimeIST = moment(endTime).tz(timeZone);
    const endHour = endTimeIST.hour();
    const endMin = endTimeIST.minute();

    const [trackingEndHour, trackingEndMin] = user.trackingEndTime
      .split(":")
      .map(Number);

    const fullBlock = 300; // 5 minutes = 300 seconds
    let productivity = (duration / fullBlock) * 100;
    productivity = Math.min(100, Math.round(productivity)); // clamp to 100%
    let neutral = 100 - productivity;
    if (endTime === lastidlePeriod || endTime === lastActivePeriod) {
      if (lastActivePeriod) {
        const lastEndIST = moment(lastActivePeriod).tz(timeZone);
        const lastEndHour = lastEndIST.hour();
        const lastEndMin = lastEndIST.minute();

        await TrackingSession.findByIdAndUpdate(sessionId, {
          leftTime: `${lastEndHour}:${
            lastEndMin < 10 ? "0" + lastEndMin : lastEndMin
          }`,
        });
        leftTimeSet = true;
        const arrivalIST = moment(session.arrivalTime).tz(timeZone);

        const leftIST = arrivalIST
          .clone()
          .hour(lastEndHour)
          .minute(lastEndMin)
          .second(0);

        // Calculate difference in seconds
        const timeAtWork = leftIST.diff(arrivalIST, "seconds");
        const totalTrackedTime = session.totalTrackedTime;
        if (totalTrackedTime > timeAtWork) {
          session.totalTrackedTime = timeAtWork;
        }

        // Store in session
        await TrackingSession.findByIdAndUpdate(sessionId, {
          timeAtWork,
          totalTrackedTime,
        });
      }
    }
    if (!session.leftTime) {
      await TrackingSession.findByIdAndUpdate(sessionId, {
        $inc: { totalTrackedTime: duration },
        $push: {
          activePeriods: {
            start: new Date(startTime),
            end: new Date(endTime),
            duration,
            productivity,
            neutral,
          },
        },
      });
    }
    if (endHour === trackingEndHour && endMin === trackingEndMin) {
      // Save leftTime as endTimeIST
      await TrackingSession.findByIdAndUpdate(sessionId, {
        leftTime: `${endHour}:${endMin < 10 ? "0" + endMin : endMin}`,
      });
      leftTimeSet = true;
      const arrivalIST = moment(session.arrivalTime).tz(timeZone);
      const leftIST = arrivalIST
        .clone()
        .hour(trackingEndHour)
        .minute(trackingEndMin)
        .second(0);
      const timeAtWork = leftIST.diff(arrivalIST, "seconds");
      const totalTimeAtWork = session.totalTrackedTime;
      if (totalTimeAtWork > timeAtWork) {
        session.totalTrackedTime = timeAtWork;
      }
      await TrackingSession.findByIdAndUpdate(sessionId, {
        timeAtWork,
        totalTimeAtWork,
      });
    }

    res.json({ status: "active time updated" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update active time", error: err.message });
  }
};

const endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    await TrackingSession.findByIdAndUpdate(sessionId, {
      leftTime: new Date(),
    });
    res.json({ status: "session ended" });
  } catch (error) {
    res.status(500).json({ message: "Failed to end session", error });
  }
};

function isWithinTrackingHours(user) {
  const now = moment().tz(user.timeZone || user.timeZone);
  const todayName = now.format("dddd"); // e.g., "Monday"

  console.log("todayName :" + todayName);
  // Check if today is in trackingDays
  if (!user.trackingDays || !user.trackingDays.includes(todayName)) {
    console.log(
      `[Tracking Restriction] Today (${todayName}) not in trackingDays for user ${user.username}`
    );
    return false;
  }

  const trackingStart = user.trackingStartTime;
  const trackingEnd = user.trackingEndTime;

  if (!trackingStart || !trackingEnd) {
    console.warn(
      `[Tracking Restriction] Missing tracking start/end time for user ${user.username}`
    );
    return false; // Cannot track without time bounds
  }

  const today = now.format("YYYY-MM-DD");
  const startMoment = moment.tz(
    `${today} ${trackingStart}`,
    "YYYY-MM-DD HH:mm",
    user.timeZone || "Asia/Kolkata"
  );
  const endMoment = moment.tz(
    `${today} ${trackingEnd}`,
    "YYYY-MM-DD HH:mm",
    user.timeZone || "Asia/Kolkata"
  );

  return now.isBetween(startMoment, endMoment);
}

const getSessionById = async (req, res) => {
  try {
    const session = await TrackingSession.findById(req.params.id, "leftTime");
    if (!session) return res.status(404).json({ message: "Session not found" });

    return res.json({ leftTime: session.leftTime });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error checking session status", error: err.message });
  }
};
const getTodaySessionByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "userId is required in params" });
    }

    // Use server timezone or set as needed
    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();

    const session = await TrackingSession.findOne({
      userId,
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    res.json({ data: session });
  } catch (error) {
    console.log("Error fetching today's session:", error);
    res.status(500).json({ message: "Failed to fetch today's session", error });
  }
};

const getAllTrackingsForToday = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { search, date } = req.query;

    // Step 1: Get owner's timezone
    const owner = await User.findById(ownerId).select("timeZone");
    const timezone = owner?.timeZone || "UTC";
    let userQuery = {
      isDeleted: false,
      $or: [{ _id: ownerId }, { ownerId }],
    };

    if (search && search.trim() !== "") {
      userQuery.$and = [
        {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    // Step 2: Get all users (owner + team)
    const users = await User.find(userQuery).select(
      "username email photo role active"
    );

    const userIds = users.map((u) => u._id);

    const baseDate = date ? moment.tz(date, timezone) : moment().tz(timezone);

    const startOfDay = baseDate.startOf("day").toDate();
    const endOfDay = baseDate.endOf("day").toDate();

    // Step 4: Get today's tracking sessions
    const sessions = await TrackingSession.find({
      userId: { $in: userIds },
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).populate("userId", "username photo role active");

    // Step 5: Map userId to session data
    const sessionMap = new Map();
    sessions.forEach((session) =>
      sessionMap.set(session.userId._id.toString(), session)
    );

    // Step 6: Process all users
    const data = await Promise.all(
      users.map(async (user) => {
        const session = sessionMap.get(user._id.toString());

        if (session) {
          const {
            totalTrackedTime = 0,
            activePeriods = [],
            arrivalTime,
            timeAtWork,
            leftTime,
          } = session;

          const deskTime = totalTrackedTime;

          const productiveTime = activePeriods.reduce(
            (sum, period) => sum + (period.productivity || 0),
            0
          );

          const arrivedAtFormatted = arrivalTime
            ? moment(arrivalTime).tz(timezone).format("HH:mm")
            : null;

          let offlineTime = 0;
          if (timeAtWork?.seconds != null) {
            offlineTime = timeAtWork.seconds - deskTime;
          } else if (arrivalTime) {
            const now = moment().tz(timezone);
            const arrivalMoment = moment(arrivalTime).tz(timezone);
            const secondsSinceArrival = now.diff(arrivalMoment, "seconds");
            offlineTime = secondsSinceArrival - deskTime;
          }
          let activeApp = null;
          if (activePeriods.length > 0) {
            const lastActivePeriod = activePeriods[activePeriods.length - 1];
            const lastEnd = moment(lastActivePeriod.end).tz(timezone);
            const now = moment().tz(timezone);
            const diffSeconds = now.diff(lastEnd, "seconds");

            // If last end is within 5 minutes (300 seconds) from now
            if (diffSeconds >= 0 && diffSeconds <= 300) {
              // Get last updated active app for this user/session
              activeApp = await ActiveApps.findOne({
                userId: user._id,
                sessionId: session._id,
              }).sort({ updatedAt: -1 });
            }
          }

          return {
            user,
            deskTime,
            productiveTime,
            arrivalTime: arrivedAtFormatted,
            offlineTime: offlineTime > 0 ? offlineTime : 0,
            leftTime: leftTime || null,
            activeApp: activeApp.appIcon || null,
          };
        } else {
          // No session found for this user today
          return {
            user,
            deskTime: null,
            productiveTime: null,
            arrivalTime: null,
            offlineTime: null,
            leftTime: null,
          };
        }
      })
    );

    // Step 7: Send response
    res.status(200).json({
      code: 200,
      status: "Success",
      data,
    });
  } catch (error) {
    console.error("Error fetching tracking sessions:", error);
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Error processing tracking data",
      error: error.message,
    });
  }
};
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const snapshot = async (req, res) => {
  try {
    const { date } = req.query;

    const owner = await User.findById(req.params.ownerId);
    const timeZone = owner.timeZone;
    const targetDate = date || moment().tz(timeZone).format("YYYY-MM-DD");

    const sessionsForDate = await TrackingSession.find({
      $expr: {
        $eq: [
          {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$arrivalTime",
              timezone: timeZone,
            },
          },
          targetDate,
        ],
      },
    });

    // Collect all unique userIds to fetch their usernames and roles in one go
    const userIds = [
      ...new Set(sessionsForDate.map((s) => s.userId.toString())),
    ];
    const usersMap = {};
    const users = await User.find(
      { _id: { $in: userIds } },
      { username: 1, role: 1, photo: 1 }
    );
    users.forEach((u) => {
      usersMap[u._id.toString()] = {
        username: u.username,
        role: u.role,
        photo: u.photo,
      };
    });

    let allUserSessions = [];

    for (const session of sessionsForDate) {
      let formatted = [];

      if (session.activePeriods) {
        formatted = session.activePeriods
          .filter((period) => period.start && period.end)
          .map((period) => {
            const start = moment(period.start).tz(timeZone);
            const end = moment(period.end).tz(timeZone);
            const duration = period.duration || 0;

            return {
              time: start.format("HH:mm"),
              productive: period.productivity || 0,
              neutral: period.neutral || 0,
              break: 0,
              timeRange: `${start.format("HH:mm")} - ${end.format("HH:mm")}`,
              apps: [],
              total: formatDuration(duration),
            };
          });
      }

      // Fetch offline requests for this user and date
      const offlineRequests = await OfflineRequest.find({
        userId: session.userId,
        startTime: {
          $gte: moment(targetDate).startOf("day").toDate(),
          $lte: moment(targetDate).endOf("day").toDate(),
        },
      });

      const processedOfflineIntervals = [];
      offlineRequests.forEach((request) => {
        const intervals = splitOfflineTimeIntoIntervals(
          request.startTime,
          request.endTime,
          request.description,
          request.projectName,
          request.taskName,
          request.productivity,
          session.userId
        );
        intervals.forEach((interval) => {
          const start = moment(interval.startTime).tz(timeZone);
          const end = moment(interval.endTime).tz(timeZone);
          const duration = moment.duration(end.diff(start)).asSeconds();
          const total = formatDuration(duration);
          const productive = Math.round((duration / 300) * 100);
          const neutral = 100 - productive;

          processedOfflineIntervals.push({
            time: start.format("HH:mm"),
            productive,
            neutral,
            break: 0,
            timeRange: `${start.format("HH:mm")} - ${end.format("HH:mm")}`,
            apps: [],
            total,
            isOfflineRequest: true,
            status: request.status,
            description: request.description,
            projectName: request.projectName,
            taskName: request.taskName,
            originalRequestId: request._id,
          });
        });
      });

      formatted = [...formatted, ...processedOfflineIntervals];

      // Sort
      formatted.sort((a, b) => {
        const timeA = moment(a.time, "HH:mm");
        const timeB = moment(b.time, "HH:mm");
        return timeA - timeB;
      });

      // Calculate totalTime
      let totalTime;
      if (session.timeAtWork) {
        totalTime = session.timeAtWork; // already in desired format
      } else {
        totalTime = session.totalTrackedTime;
      }

      allUserSessions.push({
        userId: session.userId,
        username: usersMap[session.userId.toString()]?.username || null,
        role: usersMap[session.userId.toString()]?.role || null,
        photo: usersMap[session.userId.toString()]?.photo || null,
        date: targetDate,
        totalTime,
        session: formatted,
      });
    }

    return res.status(200).json({
      code: 200,
      status: "Success",
      message: "Dashboard card data fetched successfully",
      data: allUserSessions,
    });
  } catch (error) {
    console.error("Error fetching snapshots:", error);
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Error processing tracking data",
      error: error.message,
    });
  }
};
const addActiveApps = async (req, res) => {
  try {
    const { sessionId, userId, appName, appIcon, duration } = req.body;
    if (!sessionId || !userId || !appName || !duration) {
      return res.status(400).json({
        code: 400,
        status: "Error",
        message: "Missing required fields",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "Error",
        message: "User not found",
      });
    }
    const ownerId = user.ownerId;

    const productivityApp = await ProductivityApps.findOne({
      ownerId,
      appName,
    });
    console.log("existing productivityApp :" + productivityApp);

    let productivityStatus = "Neutral";
    if (productivityApp && productivityApp.productivity) {
      productivityStatus = productivityApp.productivity;
    }
    const existingApp = await ActiveApps.findOne({
      sessionId,
      userId,
      appName,
    });
    if (existingApp) {
      const durationValue = Number(duration); // ensure it's number

      // If exists, update duration and productivityStatus
      existingApp.duration += durationValue;
      existingApp.productivity = productivityStatus;
      await existingApp.save();
      return res.status(200).json({
        code: 200,
        status: "Success",
        message: "App duration updated",
        data: existingApp,
      });
    } else {
      let iconUrl = null;
      const date = moment().format("YYYY-MM-DD");

      if (req.file) {
        const folderPath = `${user.employeeId}/${date}/active-icons`;
        const uploadedScreenshot = await uploadFileToS3(req.file, folderPath);
        iconUrl =
          config.AWS.publicUrl +
          `${folderPath}/${uploadedScreenshot.Key.split("/").pop()}`;
      }
      // If not exists, create new
      const activeApp = new ActiveApps({
        sessionId,
        userId,
        appName,
        appIcon: iconUrl,
        duration,
        productivityStatus,
      });
      console.log("new productivityApp :" + activeApp);

      await activeApp.save();
      return res.status(201).json({
        code: 201,
        status: "Success",
        message: "Active app created",
        data: activeApp,
      });
    }
  } catch (error) {
    console.error("Error adding active apps:", error);
    return res.status(500).json({
      code: 500,
      status: "Error",
      message: "Failed to add active apps",
      error: error.message,
    });
  }
};
const getAllActiveApps = async (req, res) => {
  try {
    const { sessionId, userId } = req.params;

    if (!sessionId || !userId) {
      return res.status(400).json({
        code: 400,
        status: "Error",
        message: "sessionId and userId are required",
      });
    }

    const activeApps = await ActiveApps.find({ sessionId, userId });

    if (activeApps.length === 0) {
      return res.status(404).json({
        code: 404,
        status: "Error",
        message: "No active apps found for this session",
      });
    }

    // Group by productivityStatus
    const grouped = activeApps.reduce((acc, app) => {
      const key = app.productivity || "Neutral";
      if (!acc[key]) acc[key] = [];
      acc[key].push(app);
      return acc;
    }, {});

    return res.status(200).json({
      code: 200,
      status: "Success",
      message: "Active apps fetched successfully",
      data: grouped,
    });
  } catch (error) {
    console.error("Error fetching active apps:", error);
    return res.status(500).json({
      code: 500,
      status: "Error",
      message: "Failed to fetch active apps",
      error: error.message,
    });
  }
};

module.exports = {
  tracking,
  idleTimeTracker,
  activeTimeTracker,
  endSession,
  getUserTrackingInfo,
  getSessionById,
  getTodaySessionByUserId,
  getAllTrackingsForToday,
  snapshot,
  addActiveApps,
  getAllActiveApps,
};
