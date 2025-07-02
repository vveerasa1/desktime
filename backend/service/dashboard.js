const moment = require("moment-timezone");
const TrackingSession = require("../models/trackingSession");
const User = require("../models/user");

const dashboardCard = async (req, res) => {
  try {
    const { type, date } = req.query; // expects type=day|week|month
    const user = req.user;
    console.log(user);
    let userId = user.userId;
    let timeZone = user.timeZone;

    let result = {};
    if (type === "day") {
      const formattedDate = date || moment().tz(timeZone).format("YYYY-MM-DD");
      const session = await TrackingSession.findOne({
        userId,
        $expr: {
          $eq: [
            { $dateToString: { format: "%Y-%m-%d", date: "$arrivalTime" } },
            formattedDate,
          ],
        },
      });

      if (!session) {
        return res
          .status(200)
          .json({ message: "No tracking data found for today." });
      }

      const arrivalTime = new Date(session.arrivalTime);
      let deskTime = 0;
      let idleTime = 0;
      let timeAtWork = 0;
      if (session.leftTime) {
        deskTime = Math.floor((session.leftTime - arrivalTime) / 1000); // seconds
        idleTime = (session.idlePeriods || []).reduce(
          (acc, p) => acc + (p.duration || 0),
          0
        );
       const activeTime = (session.activePeriods || []).reduce((acc, p) => acc + (p.duration || 0), 0);
        //timeAtWork = deskTime - idleTime;
        timeAtWork = activeTime?activeTime:0;
      } else {
        const now = new Date();
        deskTime = Math.floor((now - arrivalTime) / 1000); // seconds

        // idleTime = (session.idlePeriods || []).reduce(
        //   (acc, p) => acc + (p.duration || 0),
        //   0
        // );
        const activeTime = (session.activePeriods || []).reduce((acc, p) => acc + (p.duration || 0), 0);
        timeAtWork = activeTime?activeTime:0;
        // timeAtWork = deskTime - idleTime;
      }

      result = {
        type: "day",
        arrivalTime: moment(session.arrivalTime).format("HH:mm:ss"),
        leftTime: session?.leftTime
          ? moment(session.leftTime).format("HH:mm:ss")
          : null,
        deskTime, // in seconds
        idleTime, // in seconds
        timeAtWork, // in seconds
      };
    } else if (type === "week" || type === "month") {
      const baseDate = date
        ? moment(date, "YYYY-MM-DD").tz(timeZone)
        : moment().tz(timeZone);

      const start =
        type === "week"
          ? baseDate.clone().startOf("isoWeek") // Monday
          : baseDate.clone().startOf("month");

      const end =
        type === "week"
          ? baseDate.clone().endOf("isoWeek") // Sunday
          : baseDate.clone().endOf("month");

      console.log("Start:", start.toISOString());
      console.log("End:", end.toISOString());

      // Use string field `date` in 'YYYY-MM-DD' format for query
      const sessions = await TrackingSession.find({
        userId,
        arrivalTime: {
          $gte: start.toDate(),
          $lte: end.toDate(),
        },
      });

      if (sessions.length === 0) {
        return res
          .status(404)
          .json({ message: `No tracking data found for this ${type}.` });
      }

      let totalDeskTime = 0;
      let totalIdleTime = 0;
      let totalTimeAtWork = 0;
      let totalArrivalTime = 0;
      let totalLeftTime = 0;
      let count = 0;
      let leftCount = 0;

      sessions.forEach((session) => {
        const arrival = moment(session.arrivalTime);
        const left = session.leftTime ? moment(session.leftTime) : moment();

        const deskTime = left.diff(arrival, "seconds");
        const activeTime = (session.activePeriods || []).reduce((acc, p) => acc + (p.duration || 0), 0);
        const timeAtWork = activeTime?activeTime:0;

        totalDeskTime += deskTime;
        totalIdleTime += idleTime;
        totalTimeAtWork += timeAtWork;
        totalArrivalTime += arrival.valueOf(); // milliseconds
        if (session?.leftTime) {
          totalLeftTime += left.valueOf();
          leftCount++;
        }
        count++;
      });

      result = {
        type,
        arrivalTime: moment(totalArrivalTime / count).format("HH:mm:ss"),
        leftTime: leftCount
          ? moment(totalLeftTime / leftCount).format("HH:mm:ss")
          : null,
        deskTime: Math.floor(totalDeskTime / count),
        idleTime: Math.floor(totalIdleTime / count),
        timeAtWork: Math.floor(totalTimeAtWork / count),
      };
    }
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Dashboard card data fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("dashboardCard error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const dashboardProductivityTime = async (req, res) => {
  try {
    const { type, date } = req.query;
    const user = req.user;
    const userId = user.userId;
    const timeZone = user.timeZone;

    if (type === "day") {
      const targetDate = date || moment().tz(timeZone).format("YYYY-MM-DD");

      const session = await TrackingSession.findOne({
        userId,
        $expr: {
          $eq: [
            { $dateToString: { format: "%Y-%m-%d", date: "$arrivalTime" } },
            targetDate,
          ],
        },
      });
      console.log(session);

      let formatted = [];

      if (session && session.activePeriods) {
        formatted = session.activePeriods
          .filter((period) => period.start && period.end)
          .map((period) => {
            const start = moment(period.start);
            const end = moment(period.end);
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

      return res.status(200).json({
        code: 200,
        status: "Success",
        message: "Dashboard card data fetched successfully",
        data: {
          date: targetDate,
          session: formatted,
        },
      });
    }

    if (type === "week") {
      const sessions = [];

      const baseMoment = date
        ? moment(date).tz(timeZone) // custom date given
        : moment().tz(timeZone); // default to today
      const startOfWeek = baseMoment.clone().startOf("isoWeek"); // Monday
      const endOfWeek = baseMoment.clone().endOf("isoWeek"); // Sunday

      for (
        let current = startOfWeek.clone();
        current.isSameOrBefore(endOfWeek, "day");
        current.add(1, "day")
      ) {
        const formattedDate = current.format("YYYY-MM-DD");

        const session = await TrackingSession.findOne({
          userId,
          $expr: {
            $eq: [
              { $dateToString: { format: "%Y-%m-%d", date: "$arrivalTime" } },
              formattedDate,
            ],
          },
        });

        let formatted = [];

        if (session && session.activePeriods) {
          formatted = session.activePeriods.map((period) => {
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

        sessions.push({
          date: formattedDate,
          session: formatted,
        });
      }

      sessions.reverse(); // chronological order

      return res.status(200).json({
        code: 200,
        status: "Success",
        message: "Dashboard card data fetched successfully",
        data: {
          session: sessions,
        },
      });
    } else if (type === "month") {
      const baseDate = date ? moment(date).tz(timeZone) : moment().tz(timeZone);

      const startOfRange = baseDate.clone().startOf("month");
      const endOfRange = baseDate.clone().endOf("month");
      const todayKey = baseDate.format("YYYY-MM-DD");
      const sessions = await TrackingSession.find({
        userId,
        arrivalTime: {
          $gte: startOfRange.toDate(),
          $lte: endOfRange.toDate(),
        },
      });

      // Index sessions by date (YYYY-MM-DD)
      const sessionMap = {};
      for (const session of sessions) {
        const key = moment(session.arrivalTime)
          .tz(timeZone)
          .format("YYYY-MM-DD");
        sessionMap[key] = session;
      }

      const result = {};
      const dayCursor = startOfRange.clone();

      while (dayCursor.isSameOrBefore(endOfRange, "day")) {
        const key = dayCursor.format("YYYY-MM-DD");
        const session = sessionMap[key];
        // Determine status
        const status =
          key < todayKey ? "completed" : key === todayKey ? "working" : null;

        if (!session) {
          result[key] = {
            arrival: null,
            left: null,
            worked: null,
            deskTime: null,
            status,
          };
        } else {
          const arrivalTime = moment(session.arrivalTime).tz(timeZone);
          const leftTime = session.leftTime
            ? moment(session.leftTime).tz(timeZone)
            : moment();

          const deskTimeSeconds = Math.floor(
            leftTime.diff(arrivalTime, "seconds")
          );
          const idleTime = (session.idlePeriods || []).reduce(
            (acc, p) => acc + (p.duration || 0),
            0
          );
          const workedSeconds = deskTimeSeconds - idleTime;

          result[key] = {
            arrival: arrivalTime.format("HH:mm"),
            left: session.leftTime ? leftTime.format("HH:mm") : null,
            worked: formatDuration(workedSeconds),
            deskTime: formatDuration(deskTimeSeconds),
            status,
          };
        }

        dayCursor.add(1, "day");
      }
      const user = await User.findById(userId).lean();

      return res.status(200).json({
        code: 200,
        status: "Success",
        message: "User month data fetched successfully",
        data: {
          user,
          session: result,
        },
      });
    }

    return res
      .status(400)
      .json({ message: "Invalid type. Use 'day' or 'week'." });
  } catch (error) {
    console.error("Error fetching dashboard productivity time:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch tracking data", error });
  }
};

module.exports = { dashboardCard, dashboardProductivityTime };
