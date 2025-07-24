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

    const endTimeIST = moment(endTime).tz(timeZone);
    const endHour = endTimeIST.hour();
    const endMin = endTimeIST.minute();

    const [trackingEndHour, trackingEndMin] = user.trackingEndTime
      .split(":")
      .map(Number);

    let leftTimeSet = false;
    if (endHour === trackingEndHour && endMin === trackingEndMin) {
      const lastActivePeriod =
        session.activePeriods && session.activePeriods.length > 0
          ? session.activePeriods[session.activePeriods.length - 1].end
          : null;

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

        // Store in session
        await TrackingSession.findByIdAndUpdate(sessionId, {
          timeAtWork,
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

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
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

    let leftTimeSet = false;
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
      await TrackingSession.findByIdAndUpdate(sessionId, {
        timeAtWork,
      });
    }

    const fullBlock = 300; // 5 minutes = 300 seconds
    let productivity = (duration / fullBlock) * 100;
    productivity = Math.min(100, Math.round(productivity)); // clamp to 100%
    let neutral = 100 - productivity;
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

cron.schedule("55 23 * * *", async () => {
  console.log("[CRON] Running sessionStop at 11:59 PM");
  try {
    const sessions = await TrackingSession.find({ leftTime: null });

    for (const session of sessions) {
      const user = await User.findById(session.userId);

      let leftTime = null;

      // if (user?.flexibleHours) {
      //   const lastActive =
      //     session.activePeriods?.[session.activePeriods.length - 1]?.end;
      //   const now = moment();

      //   if (lastActive) {
      //     const lastActiveMoment = moment(lastActive);
      //     const minutesSinceLastActive = now.diff(lastActiveMoment, "minutes");

      //     // if (minutesSinceLastActive <= 10) {
      //     //   // User is likely still working — skip setting leftTime
      //     //   console.log(`Skipping user ${user.username}, still active.`);
      //     //   continue;
      //     // } else {
      //     leftTime = lastActiveMoment.toDate();
      //     //}
      //   } else if (session.idlePeriods?.length > 0) {
      //     leftTime = session.idlePeriods[0].start;
      //   } else {
      //     leftTime = new Date();
      //   }
      // } else {
      // Not flexible: fallback to idle or current time
      // const trackingEnd = user?.trackingEndTime; // e.g., '20:00'
      // if (trackingEnd) {
      // const today = moment().format("YYYY-MM-DD");
      // const trackingEndMoment = moment(
      //   `${today} ${trackingEnd}`,
      //   "YYYY-MM-DD HH:mm"
      // );
      // const currentTime = moment().tz(timeZone);
      // const trackingEndTime = currentTime
      //   .clone()
      //   .hour(cutHour)
      //   .minute(cutMin)
      //   .second(0);

      // We're past tracking end time
      const activePeriods = session.activePeriods || [];

      // Find the last idle period (assuming sorted chronologically)
      const activeIdle = activePeriods[activePeriods.length - 1];

      // if (
      //   activeIdle?.start &&
      //   !activeIdle?.end &&
      //   moment(activeIdle.end).isSameOrAfter(trackingEndMoment)
      // ) {
      // User went idle after trackingEnd and hasn't come back
      leftTime = activeIdle.end;
      //   } else {
      //     // Use tracking end time or look for any idle after it
      //     const idleAfterTrackingEnd = idlePeriods.find((p) =>
      //       moment(p.start).isSameOrAfter(trackingEndMoment)
      //     );

      //     if (idleAfterTrackingEnd?.start) {
      //       leftTime = moment(idleAfterTrackingEnd.start).toDate();
      //     } else {
      //       leftTime = trackingEndMoment.toDate();
      //     }
      //   }
      // } else {
      // Still within tracking window
      //     console.log(`User ${user.username} is still within tracking hours.`);
      //     continue;
      //   }
      // } else {
      //   // If no trackingEndTime set, fallback
      //   const lastIdle = session.idlePeriods?.[session.idlePeriods.length - 1];
      //   leftTime = lastIdle?.start || new Date();
      // }

      session.leftTime = leftTime;
      await session.save();

      console.log(
        `[CRON] Set leftTime for user ${
          user?.username || session.userId
        }: ${leftTime}`
      );
    }

    console.log("[CRON] sessionStop completed");
  } catch (error) {
    console.error("[CRON Error in sessionStop]", error);
  }
});

function isWithinTrackingHours(user) {
  if (user.flexibleHours) return true;

  const now = moment().tz(user.timeZone || user.timeZone);
  const todayName = now.format("dddd"); // e.g., "Monday"

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
module.exports = {
  tracking,
  idleTimeTracker,
  activeTimeTracker,
  endSession,
  getUserTrackingInfo,
  getSessionById,
  getTodaySessionByUserId,
};
