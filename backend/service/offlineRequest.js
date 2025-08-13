const OfflineRequest = require("../models/offlineRequest");
const moment = require("moment-timezone");
const User = require("../models/user");

// Create a new offline request
const createOfflineRequest = async (req, res) => {
  try {
    console.log("createOfflineRequest", req.body);
    const {
      startTime,
      date,
      endTime,
      description,
      projectName,
      taskName,
      productivity,
    } = req.body;
    const userId = req.user.userId;
    let status = "Pending";
    console.log("userId", userId);
    const user = req.user;
    const role = user.role;
    if (role === "Admin" || role === "Owner") {
      status = "Approved";
    }

    let timeZone = user.timeZone || "Asia/Kolkata";
    const now = moment().tz(timeZone).toDate();
    const fullStart = moment.tz(
      `${date} ${startTime}`,
      "YYYY-MM-DD HH:mm",
      timeZone
    );
    const fullEnd = moment.tz(
      `${date} ${endTime}`,
      "YYYY-MM-DD HH:mm",
      timeZone
    );
    const fullStartUtc = moment
      .tz(`${date} ${startTime}`, "YYYY-MM-DD HH:mm", timeZone)
      .utc()
      .toDate();
    const fullEndUtc = moment
      .tz(`${date} ${endTime}`, "YYYY-MM-DD HH:mm", timeZone)
      .utc()
      .toDate();
    console.log(fullStart, fullEnd);
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
      status,
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
    res
      .status(500)
      .json({ message: "Failed to create offline request", error });
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
    res
      .status(500)
      .json({ message: "Failed to fetch offline requests", error });
  }
};

// Update an offline request by ID
const updateOfflineRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRequest = await OfflineRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

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
    res
      .status(500)
      .json({ message: "Failed to update offline request", error });
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
        date: date || null,
      },
    });
  } catch (error) {
    console.error("Error deleting offline times:", error);
    res.status(500).json({ message: "Failed to delete offline times", error });
  }
};

const getAllOfflineRequestByStatus = async (req, res, next) => {
  try {
    const { ownerId } = req.params;
    const { status, date } = req.query;

    if (!status) {
      return res
        .status(400)
        .json({ message: "Status query param is required" });
    }

    // Step 1: Get owner's timezone
    const owner = await User.findById(ownerId).select("timeZone");
    const timezone = owner?.timeZone || "UTC";

    // Step 2: Get users (owner + team)
    const users = await User.find({
      isDeleted: false,
      $or: [{ _id: ownerId }, { ownerId }],
    }).select("username photo role active");

    const userIds = users.map((u) => u._id);

    const filter = {
      userId: { $in: userIds },
      status: status,
    };

    if (date) {
      // Parse date in owner's timezone
      const startOfDay = moment
        .tz(date, "YYYY-MM-DD", timezone)
        .startOf("day")
        .toDate();
      const endOfDay = moment
        .tz(date, "YYYY-MM-DD", timezone)
        .endOf("day")
        .toDate();

      filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // Step 3: Fetch offline requests with matching status
    const requests = await OfflineRequest.find(filter)
      .populate({ path: "modifiedBy", select: "username" })
      .populate({
        path: "userId",
        select: "username team",
        populate: {
          path: "team",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });
    let productiveTime = 0;
    let unproductiveTime = 0;
    let neutralTime = 0;

    // Step 4: Format results with duration
    const formattedRequests = requests.map((r) => {
      const durationInSeconds = Math.floor(
        (new Date(r.endTime) - new Date(r.startTime)) / 1000
      );
      if (r.productivity === "Productive") {
        productiveTime += durationInSeconds;
      } else if (r.productivity === "Unproductive") {
        unproductiveTime += durationInSeconds;
      } else if (r.productivity === "Neutral") {
        neutralTime += durationInSeconds;
      }

      return {
        ...r._doc,
        durationInSeconds,
        startTime: moment(r.startTime)
          .tz(timezone)
          .format("YYYY-MM-DD hh:mm A"),
        endTime: moment(r.endTime).tz(timezone).format("YYYY-MM-DD hh:mm A"),
      };
    });

    res.status(200).json({
      code: 200,
      status: "Success",
      totalOfflineTimes: formattedRequests.length,
      formattedRequests,
      productiveTime,
      unproductiveTime,
      neutralTime,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  createOfflineRequest,
  getOfflineRequests,
  updateOfflineRequest,
  deleteOfflineTimesByUserId,
  getAllOfflineRequestByStatus,
};
