const moment = require("moment/moment");
const config = require("../config");
const User = require("../models/user");

const addUser = async (req, res) => {
  try {
    const {
      username,
      employeeId,
      email,
      password,
      team,
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

    const user = new User({
      username,
      employeeId,
      email,
      password,
      team,
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
      const users = await User.find(req.params.id);
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

module.exports = {
    addUser,
    getUserById,
    updateUser,
    getAllUser
}