const moment = require("moment-timezone");
const TrackingSession = require("../models/trackingSession");
const User = require("../models/user");
const OfflineRequest = require("../models/offlineRequest");

const splitOfflineTimeIntoIntervals = (startTime, endTime, description, projectName, taskName, productivity, userId) => {
  const intervals = [];
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end - start;
 
  const totalMinutes = Math.floor(durationMs / (1000 * 60));
  // Split into 5-minute intervals
  for (let i = 0; i < totalMinutes; i += 5) {
    const intervalStart = new Date(start.getTime() + (i * 60 * 1000));
    const intervalEnd = new Date(Math.min(start.getTime() + ((i + 5) * 60 * 1000), end.getTime()));

    intervals.push({
      userId,
      startTime: intervalStart,
      endTime: intervalEnd,
      description: description || `Offline activity ${i / 5 + 1}`,
      projectName,
      taskName,
      productivity,
      status: "Pending"
    });
  }
  return intervals;
};

const dashboardCard = async (req, res) => {
  try {
    const { type, date } = req.query; // expects type=day|week|month
    // const user = req.user;
    const { userId } = req.query;
    // let userId = user.userId;

    const user = await User.findById(userId);
    let timeZone = user.timeZone;
    console.log(date);

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

      const nowUserTZ = moment().tz(timeZone);
      console.log("nowUserTz :" + nowUserTZ);
      const nowDateStr = nowUserTZ.format("YYYY-MM-DD");
      console.log("nowDateStr :" + nowDateStr);
      const trackingEndHour = user.trackingEndTime;
      console.log(trackingEndHour); // e.g. "20:00"
      const trackingEndTimeStr = `${formattedDate} ${trackingEndHour}`; // e.g. "2025-07-28 20:00"
      console.log("trackingEndTimeStr :" + trackingEndTimeStr);

      const trackingEndTimeTz = moment.tz(
        trackingEndTimeStr,
        "YYYY-MM-DD HH:mm",
        timeZone
      );
      console.log("trackingEndTimeTz :" + trackingEndTimeTz);

      const trackingEndTimeUTC = trackingEndTimeTz.toDate();
      console.log("trackingEndTimeUTC :" + trackingEndTimeUTC);

      // If date in query ≠ current date or time exceeded
      if (nowDateStr !== formattedDate || new Date() > trackingEndTimeUTC) {
        if (!session.leftTime) {
          const lastActivePeriod =
            session.activePeriods?.[session.activePeriods.length - 1];
          let leftTime;

          if (lastActivePeriod?.end) {
            console.log("here");
            const lastEndTime = lastActivePeriod?.end;
            console.log("lastEndTime :" + lastEndTime);

            const endTimeIST = moment(lastEndTime).tz(timeZone);
            console.log("endTimeIST :" + endTimeIST);

            const endHour = endTimeIST.hour();
            const endMin = endTimeIST.minute();
            if (lastEndTime.getTime() <= trackingEndTimeUTC.getTime()) {
              leftTime = `${endHour}:${endMin < 10 ? "0" + endMin : endMin}`;
              console.log("here");
              console.log("leftTime :" + leftTime);
            } else {
              leftTime = trackingEndHour;
              console.log("leftTime :" + leftTime);
            }
          } else {
            leftTime = trackingEndHour;
            console.log("leftTime :" + leftTime);
          }

          // Store leftTime in session
          session.leftTime = leftTime;

          const arrivalIST = moment(session.arrivalTime).tz(timeZone);

          console.log("arrivalIST :" + arrivalIST);
          const [leftEndHour, leftEndMin] = session.leftTime
            .split(":")
            .map(Number);

          const leftIST = arrivalIST
            .clone()
            .hour(leftEndHour)
            .minute(leftEndMin)
            .second(0);
          console.log("leftIST :" + leftIST);

          // Recalculate timeAtWork (in seconds)
          const newTimeAtWork = leftIST.diff(arrivalIST, "seconds");
          session.timeAtWork = newTimeAtWork;

          // Adjust totalTrackedTime if needed
          if (session.totalTrackedTime > newTimeAtWork) {
            session.totalTrackedTime = newTimeAtWork;
          }

          await session.save();
        }
      }

      if (session.leftTime) {
        timeAtWork = session.timeAtWork; // seconds
        idleTime = (session.idlePeriods || []).reduce(
          (acc, p) => acc + (p.duration || 0),
          0
        );
        deskTime = session.totalTrackedTime;
        if (deskTime > timeAtWork) {
          deskTime = timeAtWork;
          session.totalTrackedTime = timeAtWork;
          await session.save();
        }
      } else {
        const now = new Date();
        timeAtWork = Math.floor((now - arrivalTime) / 1000); // seconds
        deskTime = session.totalTrackedTime;
      }

      result = {
        type: "day",
        arrivalTime: moment(session.arrivalTime)
          .tz(timeZone)
          .format("HH:mm:ss"),
        leftTime: session?.leftTime,
        deskTime,
        idleTime,
        timeAtWork,
      };
    } else if (type === "week" || type === "month") {
      const baseDate = date ? moment(date).tz(timeZone) : moment().tz(timeZone);

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
      let totalTimeAtWork = 0;
      let totalArrivalTime = 0;
      let totalLeftTime = 0;
      let count = 0;
      let leftCount = 0;

      sessions.forEach((session) => {
        const arrival = moment(session.arrivalTime).tz(timeZone);
        const timeAtWork = session.timeAtWork ? session.timeAtWork : 0;
        const activeTime = (session.activePeriods || []).reduce(
          (acc, p) => acc + (p.duration || 0),
          0
        );
        const desktime = activeTime ? activeTime : 0;

        totalDeskTime += desktime;
        totalTimeAtWork += timeAtWork;
        totalArrivalTime += arrival.valueOf(); // milliseconds
        if (session?.leftTime) {
          const leftMoment = moment(session.leftTime, "HH:mm");
          const durationFromStart =
            leftMoment.hours() * 3600 * 1000 + leftMoment.minutes() * 60 * 1000;
          totalLeftTime += durationFromStart;
          leftCount++;
        }
        count++;
      });

      result = {
        type,
        arrivalTime: moment(totalArrivalTime / count).format("HH:mm:ss"),
        leftTime: leftCount
          ? moment.utc(totalLeftTime / leftCount).format("HH:mm")
          : null,
        deskTime: Math.floor(totalDeskTime / count),
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
    const { type, date, userId } = req.query;
    const user = await User.findById(userId);
    // const user = req.user;
    // const userId = user.userId;
    let timeZone = user.timeZone;
    console.log("user", user);

    if (type === "day") {
      const targetDate = date || moment().tz(timeZone).format("YYYY-MM-DD");

      const session = await TrackingSession.findOne({
        userId,
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
      console.log(session);

      let formatted = [];

      if (session && session.activePeriods) {
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

      // Fetch offline requests for the day
      const offlineRequests = await OfflineRequest.find({
        userId,
        startTime: {
          $gte: moment(targetDate).startOf('day').toDate(),
          $lte: moment(targetDate).endOf('day').toDate(),
        },
      });
      
      // Process offline requests and split them into intervals
      const processedOfflineIntervals = [];
      
      offlineRequests.forEach((request,index) => {
        const intervals = splitOfflineTimeIntoIntervals(
          request.startTime,
          request.endTime,
          request.description,
          request.projectName,
          request.taskName,
          request.productivity,
          userId
        );
        intervals.forEach((interval) => {
          const start = moment(interval.startTime).tz(timeZone);
          const end = moment(interval.endTime).tz(timeZone);
          const duration = moment.duration(end.diff(start)).asSeconds();
          const total= formatDuration(duration)
          const productive=Math.round((duration / 300) * 100)
          const neutral=100-productive
          processedOfflineIntervals.push({
            time: start.format("HH:mm"),
            productive:productive,//Math.round((duration / 300) * 100),
// request.productivity === 'Productive' ? 100 : 
                      //  request.productivity === 'Unproductive' ? 0 : 50,
            neutral:neutral,//Math.round() request.productivity === 'Neutral' ? 50 : 0,
            break: 0,
            timeRange: `${start.format("HH:mm")} - ${end.format("HH:mm")}`,
            apps: [],
            total:total,// formatDuration(duration),
            isOfflineRequest: true,
            status: request.status,
            description: request.description,
            projectName: request.projectName,
            taskName: request.taskName,
            originalRequestId: request._id
          });
        });
      });

      // Add processed offline intervals to formatted data
      formatted = [...formatted, ...processedOfflineIntervals];

      // Sort by time
      formatted.sort((a, b) => {
        const timeA = moment(a.time, "HH:mm");
        const timeB = moment(b.time, "HH:mm");
        return timeA - timeB;
      });

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
      console.log("base", baseMoment);
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
              {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$arrivalTime",
                  timezone: timeZone,
                },
              },
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

        // Fetch offline requests for the day
        const offlineRequests = await OfflineRequest.find({
          userId,
          startTime: {
            $gte: moment(formattedDate).startOf('day').toDate(),
            $lte: moment(formattedDate).endOf('day').toDate(),
          },
        });

      // Process offline requests and split them into intervals
      const processedOfflineIntervals = [];
      
      offlineRequests.forEach((request) => {
        const intervals = splitOfflineTimeIntoIntervals(
          request.startTime,
          request.endTime,
          request.description,
          request.projectName,
          request.taskName,
          request.productivity,
          userId
        );
        
        intervals.forEach((interval) => {
          const start = moment(interval.startTime).tz(timeZone);
          const end = moment(interval.endTime).tz(timeZone);
          const duration = moment.duration(end.diff(start)).asSeconds();
          
          // Calculate productivity based on total duration / 5 minutes (300 seconds)
          const totalDurationSeconds = moment.duration(moment(request.endTime).diff(moment(request.startTime))).asSeconds();
          const productivityValue = Math.min(100, Math.round((totalDurationSeconds / 300) * 100));
          const total= formatDuration(duration)
          console.log(Math.round((total / 300) * 100),"Math.round((total / 300) * 100)")
          processedOfflineIntervals.push({
            time: start.format("HH:mm"),
            productive:Math.round((total / 300) * 100),

            //  request.productivity === 'Productive' ? productivityValue : 
            //            request.productivity === 'Unproductive' ? 0 : Math.min(50, productivityValue),
            neutral: request.productivity === 'Neutral' ? Math.min(50, productivityValue) : 0,
            break: 0,
            timeRange: `${start.format("HH:mm")} - ${end.format("HH:mm")}`,
            apps: [],
            total:total,// formatDuration(duration),
            isOfflineRequest: true,
            status: request.status,
            description: request.description,
            projectName: request.projectName,
            taskName: request.taskName,
            originalRequestId: request._id
          });
        });
      });

        // Add processed offline intervals to formatted data
        formatted = [...formatted, ...processedOfflineIntervals];

        // Sort by time
        formatted.sort((a, b) => {
          const timeA = moment(a.time, "HH:mm");
          const timeB = moment(b.time, "HH:mm");
          return timeA - timeB;
        });

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
            : moment().tz(timeZone);

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

module.exports = { dashboardCard, dashboardProductivityTime, splitOfflineTimeIntoIntervals };
