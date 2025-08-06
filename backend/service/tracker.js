const IdleLog = require("../models/idleTimeLogs");
const TrackingSession = require("../models/trackingSession");
const cron = require("node-cron");
const User = require("../models/user");
const moment = require("moment-timezone");

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

    // Step 1: Get owner's timezone
    const owner = await User.findById(ownerId).select("timeZone");
    const timezone = owner?.timeZone || "UTC";

    // Step 2: Get all users (owner + team)
    const users = await User.find({
      isDeleted: false,
      $or: [{ _id: ownerId }, { ownerId }],
    }).select("firstName lastName username photo role active");

    const userIds = users.map((u) => u._id);

    // Step 3: Define today's start and end time in owner's timezone
    const startOfDay = moment().tz(timezone).startOf("day").toDate();
    const endOfDay = moment().tz(timezone).endOf("day").toDate();

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
    const data = users.map((user) => {
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

        return {
          user,
          deskTime,
          productiveTime,
          arrivalTime: arrivedAtFormatted,
          offlineTime: offlineTime > 0 ? offlineTime : 0,
          leftTime: leftTime || null,
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
    });

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

module.exports = {
  tracking,
  idleTimeTracker,
  activeTimeTracker,
  endSession,
  getUserTrackingInfo,
  getSessionById,
  getTodaySessionByUserId,
  getAllTrackingsForToday,
};
