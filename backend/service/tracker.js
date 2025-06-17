const IdleLog = require("../models/idleTimeLogs");
const TrackingSession = require("../models/trackingSession");


const tracking = async (req, res) => {
  try {
    const { userId } = req.body;
    const session = await TrackingSession.create({
      userId,
      arrivalTime: new Date(),
    });
    res.json({ sessionId: session._id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start session', error });
  }
}

const getUserTrackingInfo = async (req, res) => {
  try {
   const { userId, date } = req.query;

    if (!userId || !date) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        message: "userId and date are required",
      });
    }
    
    const formattedDate = new Date(date).toISOString().split('T')[0];
    const session = await TrackingSession.findOne({
        userId,
        $expr: {
            $eq: [
                { $dateToString: { format: "%Y-%m-%d", date: "$arrivalTime" } },
                formattedDate
            ]
        }
    });

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Tracking session fetched successfully",
      data: session,
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
    const { userId, sessionId, idleStartTime, idleEndTime } = req.body;

    const duration = (new Date(idleEndTime) - new Date(idleStartTime)) / 1000;

    // Log idle entry separately (optional for audit)
    await IdleLog.create({
      userId,
      sessionId,
      idleStartTime,
      idleEndTime,
      duration
    });

    // Update session with idle period and increment total idleTime
    await TrackingSession.findByIdAndUpdate(sessionId, {
      $push: {
        idlePeriods: {
          start: idleStartTime,
          end: idleEndTime,
          duration
        }
      },
      $inc: { idleTime: duration }
    });

    res.json({ status: 'Idle time logged successfully.' });

  } catch (error) {
    console.error('[IdleTimeTracker Error]', error);
    res.status(500).json({ message: 'Failed to log idle time', error });
  }
};

// body: { sessionId, duration }
const activeTimeTracker = async (req, res) => {
  try {
    const { sessionId, duration } = req.body;
    await TrackingSession.findByIdAndUpdate(sessionId, {
      $inc: { totalTrackedTime: duration }
    });
    res.json({ status: 'active time updated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update active time', error });
  }
};

// body: { sessionId }
const endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    await TrackingSession.findByIdAndUpdate(sessionId, {
      leftTime: new Date()
    });
    res.json({ status: 'session ended' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to end session', error });
  }
};

module.exports = { tracking, idleTimeTracker, activeTimeTracker, endSession, getUserTrackingInfo };

