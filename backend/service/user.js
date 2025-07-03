const moment = require("moment-timezone");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const config = require("../config");
const crypto = require('crypto');
const ScreenshotLog = require("../models/screenshot");
const trackingSession = require("../models/trackingSession");

const addUser = async (req, res) => {
  try {
    const {
      username,
      employeeId,
      email,
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
    } = req.body;

    const password =await generateRandomPassword(); // plain text password
    const hashedPassword = await bcrypt.hash(password, 10);
    let durationSeconds=0;
    const admin = await User.findById(`${config.adminId.id}`);
    if(workStartTime && workEndTime){
    const start = moment(workStartTime, "HH:mm:ss");
    const end = moment(workEndTime, "HH:mm:ss");

    durationSeconds = end.diff(start, "seconds");
    }
    const allUsers = await User.find();
    let user;
    if(admin) {
      const start = moment(admin.workStartTime, "HH:mm:ss");
    const end = moment(admin.workEndTime, "HH:mm:ss");

    durationSeconds = end.diff(start, "seconds");
      user = new User({
      username,
      employeeId:employeeId ? employeeId : allUsers.length() + 1,
      email,
      password: hashedPassword,
      team:admin.team,
      gender,
      role:"Employee",
      phone,
      workingDays:admin.workingDays,
      workStartTime:admin.workStartTime,
      workEndTime:admin.workEndTime,
      minimumHours:admin.minimumHours,
      flexibleHours:flexibleHours?true:false,
      trackingDays:admin.trackingDays,
      trackingStartTime:admin.trackingStartTime,
      trackingEndTime:admin.trackingEndTime,
      timeZone:admin.timeZone,
      photo: `https://ui-avatars.com/api/?name=${username
        .split(" ")
        .join("+")}&background=0D8ABC&color=fff`,
      workDuration: durationSeconds,
      })
    } else {

    user = new User({
      username,
      employeeId,
      email,
      password: hashedPassword,
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
      photo: `https://ui-avatars.com/api/?name=${username
        .split(" ")
        .join("+")}&background=0D8ABC&color=fff`,
      workDuration: durationSeconds,
    });
  }

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

function generateRandomPassword(length = 8) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map(x => charset[x % charset.length])
    .join('');
}

const getUserById = async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    let id = user.userId;
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
};

const updateUser = async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    let id = user.userId;
    const start = moment(req.body.workStartTime, "HH:mm:ss");
    const end = moment(req.body.workEndTime, "HH:mm:ss");
    let durationSeconds = end.diff(start, "seconds");
    const updateData = {
      ...req.body,
      workDuration: durationSeconds,
    };
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Error updating user",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = req.user;
    let id = user.userId;
    await User.findOneAndUpdate({ _id: id }, { isDeleted: true });
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Error deleting user",
      error: error.message,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false });
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
};

const getScreenshotsById = async (req, res) => {
  try {
    const user = req.user;
    let userId = user.userId;
    const { date } = req.query;
    console.log(date);

    if (!date) {
      return res
        .status(400)
        .json({ message: "Date query parameter is required (YYYY-MM-DD)" });
    }
    const screenshots = await ScreenshotLog.findOne({
      userId: userId,
      "dailyScreenshots.date": date,
    });
    console.log(screenshots);

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Gathered screenshots successfully",
      data: screenshots?.dailyScreenshots?.screenshots,
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

const getUser = async (req, res) => {
  try {
    const { date } = req.query; // expects type=day|week|month
    const user = req.user;
    console.log(user);
    let userId = user.userId;
    const session = await trackingSession.findOne({
      userId: userId,
      $expr: {
        $eq: [
          { $dateToString: { format: "%Y-%m-%d", date: "$arrivalTime" } },
          date,
        ],
      },
    });
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Gathered user info successfully",
      data: session,
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Error fetching user info",
      error: error.message,
    });
  }
};

module.exports = {
  addUser,
  getUserById,
  updateUser,
  getAllUser,
  getScreenshotsById,
  getUser,
  deleteUser,
};
