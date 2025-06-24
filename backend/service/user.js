const moment = require("moment");
const User = require("../models/user");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const config = require("../config");

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
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      employeeId,
      email,
      password:hashedPassword,
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
    const transporter = nodemailer.createTransport({
      service: config.smtp?.service,
      auth: {
        user: config.smtp?.email,
        pass: config.smtp?.password,
      },
    });
    mailOptions = {
  from: config.smtp?.email,
  to: user.email,
  subject: "Desktime - Invitation",
  text: `Hi ${user.username},

You have been invited to join Desktime.

Here are your login credentials:
Email: ${user.email}
Password: ${password}

Please log in to your account to get started.

***** This is an auto-generated email. Please do not reply. *****

Best regards,  
Desktime - Pentabay Team`,
};

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending Mail" });
      }
    });

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