const OfflineRequest = require("../models/offlineRequest");
const moment = require("moment-timezone");

// Create a new offline request
const createOfflineRequest = async (req, res) => {
  try {
    console.log("createOfflineRequest", req.body);
    const { startTime, date, endTime, description, projectName, taskName, productivity } = req.body;
    const userId = req.user.userId;
    console.log("userId", userId);
    const user = req.user
    let timeZone = user.timeZone || "Asia/Kolkata";;
    const now = moment().tz(timeZone).toDate();
    const fullStart = moment.tz(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm', timeZone);
    const fullEnd = moment.tz(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm', timeZone);
    const fullStartUtc = moment.tz(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm', timeZone).utc().toDate();
    const fullEndUtc = moment.tz(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm', timeZone).utc().toDate();
    console.log(fullStart, fullEnd)
       // const fullStart = moment.tz(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm', timeZone).utc().toDate();
    // const fullEnd = moment.tz(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm', timeZone).utc().toDate();
    if (fullStart.isAfter(now) || fullEnd.isAfter(now)) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        message: "Start time and end time cannot be in the future.",
      });
    }

    if (!userId || !now) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        message: "userId and date are required",
      });
    }

    // Create the main offline request
    const newRequest = new OfflineRequest({
      userId,
      startTime: fullStartUtc,
      endTime: fullEndUtc,
      description,
      projectName,
      taskName,
      productivity,
      status: "Pending",
    });

    await newRequest.save();

    res.status(201).json({
      code: 201,
      status: "Success",
      message: "Offline request created successfully",
      data: newRequest,
    });
  } catch (error) {
    console.error("Error creating offline request:", error);
    res.status(500).json({ message: "Failed to create offline request", error });
  }
};

// Get offline requests for a user and optional date range
const getOfflineRequests = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    const query = { userId };

    if (startDate && endDate) {
      query.startTime = { $gte: new Date(startDate) };
      query.endTime = { $lte: new Date(endDate) };
    }

    const requests = await OfflineRequest.find(query).sort({ startTime: 1 });

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Offline requests fetched successfully",
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching offline requests:", error);
    res.status(500).json({ message: "Failed to fetch offline requests", error });
  }
};

// Update an offline request by ID
const updateOfflineRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRequest = await OfflineRequest.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedRequest) {
      return res.status(404).json({ message: "Offline request not found" });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Offline request updated successfully",
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating offline request:", error);
    res.status(500).json({ message: "Failed to update offline request", error });
  }
};
const deleteOfflineTimesByUserId = async (req, res) => {
  try {
    const { userId } = req.query;
    const { date } = req.query;

    if (!userId) {
      return res.status(400).json({
        code: 400,
        status: "Bad Request",
        message: "userId is required",
      });
    }

    let query = { userId };

    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      query.startTime = { $gte: startOfDay, $lte: endOfDay };
    }

    const result = await OfflineRequest.deleteMany(query);

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Offline times deleted successfully",
      data: {
        deletedCount: result.deletedCount,
        userId,
        date: date || null
      }
    });
  } catch (error) {
    console.error("Error deleting offline times:", error);
    res.status(500).json({ message: "Failed to delete offline times", error });
  }
};
module.exports = {
  createOfflineRequest,
  getOfflineRequests,
  updateOfflineRequest,
  deleteOfflineTimesByUserId

};
