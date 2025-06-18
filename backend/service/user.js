const moment = require("moment/moment");
const User = require("../models/user");
const bcrypt = require('bcrypt');

const addUser = async (req, res) => {
  try {
    const {
      username,
      employeeId,
      email,
      password,
      team,
      gender,
      role,
      phone,
      workingDays,
      workStartTime,
      workEndTime,
      minimumHours,
      flexibleHours,
      trackingDays,
      trackingStartTime,
      trackingEndTime,
      timeZone
    } = req.body;

    // Calculate work_duration in seconds
    const start = moment(workStartTime, "HH:mm:ss");
    const end = moment(workEndTime, "HH:mm:ss");

    let durationSeconds = end.diff(start, 'seconds');
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      employeeId,
      email,
      password:hashedPassword,
      team,
      gender,
      role,
      phone,
      workingDays,
      workStartTime,
      workEndTime,
      minimumHours,
      flexibleHours,
      trackingDays,
      trackingStartTime,
      trackingEndTime,
      timeZone,
      photo:`https://ui-avatars.com/api/?name=${username.split(' ').join('+')}&background=0D8ABC&color=fff`,
      workDuration: durationSeconds,
    });

    await user.save();

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "User added successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({
        code: 500,
        status: "Error",
        message: "Error adding user",
        error: error.message,
      });
  }
};

const getUserById = async (req, res) => {
    try {
      const id = req.params.id;
      const users = await User.findById(id);
      res.status(200).json({
        code: 200,
        status: "Success",
        message: "Users info fetched successfully",
        data: users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        code: 500,
        status: "Error",
        message: "Error fetching users",
        error: error.message,
      });
    }
  }
    
    const updateUser = async (req, res) => {
      try {
        const start = moment(req.body.workStartTime, "HH:mm:ss");
        const end = moment(req.body.workEndTime, "HH:mm:ss");
        let durationSeconds = end.diff(start, 'seconds');
        const updateData = {
          ...req.body,
          workDuration: durationSeconds,
        };
        const updatedUser = await User.findOneAndUpdate(
          { _id: req.params.id },
          updateData,
          { new: true }
        );
        res.status(200).json({
          code: 200,
          status: "Success",
          message: "User updated successfully",
          data: updatedUser,
        });

      } catch(error) {
        console.error("Error updating user:", error);
        res.status(500).json({
          code: 500,
          status: "Error",
          message: "Error updating user",
          error: error.message,
        });
      }
    };

    const getAllUser = async (req, res) => {
      try {
        const users = await User.find();
        res.status(200).json({
          code: 200,
          status: "Success",
          message: "Users info fetched successfully",
          data: users,
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
          code: 500,
          status: "Error",
          message: "Error fetching users",
          error: error.message,
        });
      }
    }

const ScreenshotLog = require("../models/screenshot");

const getScreenshotsById = async (req, res) => {
  try {
    const userId = req.params.id;
    const { date } = req.query;
    console.log(date);

    if (!date) {
      return res.status(400).json({ message: "Date query parameter is required (YYYY-MM-DD)" });
    }
    const screenshots = await ScreenshotLog.findOne({
      userId: userId,
      "dailyScreenshots.date": date
    });
    console.log(screenshots);

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Gathered screenshots successfully",
      data: screenshots?.dailyScreenshots?.screenshots
    });

  } catch (error) {
    console.error("Error fetching screenshots:", error);
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Error fetching screenshots",
      error: error.message,
    });
  }
};

module.exports = {
    addUser,
    getUserById,
    updateUser,
    getAllUser,
    getScreenshotsById
}