const moment = require("moment-timezone");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const config = require("../config");
const crypto = require("crypto");
const ScreenshotLog = require("../models/screenshot");
const trackingSession = require("../models/trackingSession");
const Team = require("../models/team");

const addUser = async (req, res) => {
  try {
    const usersData = Array.isArray(req.body) ? req.body : [req.body];
    const results = [];
    const errors = [];

    for (const data of usersData) {
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
        trackingDays,
        trackingStartTime,
        trackingEndTime,
        timeZone,
        ownerId,
      } = data;

      try {
        const existingUser = await User.findOne({
          email,
          ownerId,
          isDeleted: false,
        });
        if (existingUser) {
          errors.push({ email, error: "Email already exists" });
          continue;
        }

        const password = await generateRandomPassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        let durationSeconds = 0;
        const admin = await User.findById(ownerId);
        const allUsers = await User.find();

        let user;
        if (admin) {
          const start = moment(admin.workStartTime, "HH:mm:ss");
          const end = moment(admin.workEndTime, "HH:mm:ss");
          durationSeconds = end.diff(start, "seconds");

          user = new User({
            username,
            employeeId: employeeId || allUsers.length + 1,
            email,
            password: hashedPassword,
            team,
            gender,
            role,
            phone,
            workingDays: admin.workingDays,
            workStartTime: admin.workStartTime,
            workEndTime: admin.workEndTime,
            minimumHours: admin.minimumHours,
            trackingDays: admin.trackingDays,
            trackingStartTime: admin.trackingStartTime,
            trackingEndTime: admin.trackingEndTime,
            timeZone: admin.timeZone,
            photo: `https://ui-avatars.com/api/?name=${username
              .split(" ")
              .join("+")}&background=143351&color=fff`,
            workDuration: durationSeconds,
            ownerId,
          });
        } else {
          const start = moment(workStartTime, "HH:mm:ss");
          const end = moment(workEndTime, "HH:mm:ss");
          durationSeconds = end.diff(start, "seconds");

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

        if (role === "Owner") {
          user.ownerId = user._id;
          await user.save();
        }

        if (team) {
          await Team.findByIdAndUpdate(team, { $inc: { teamMembersCount: 1 } });
        }

        // Send Email
        const transporter = nodemailer.createTransport({
          service: config.smtp?.service,
          auth: {
            user: config.smtp?.email,
            pass: config.smtp?.password,
          },
        });

        const mailOptions = {
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
            console.error("Email error for", email, ":", error.message);
          }
        });

        results.push(user);
      } catch (err) {
        console.error(`Error processing user ${email || username}:`, err);
        errors.push({ email, error: err.message });
      }
    }

    return res.status(200).json({
      code: 200,
      status: "Completed",
      message: "User(s) processed",
      successCount: results.length,
      failureCount: errors.length,
      users: results,
      failed: errors,
    });
  } catch (error) {
    console.error("Error in addUser:", error);
    return res.status(500).json({
      code: 500,
      status: "Error",
      message: "Failed to process users",
      error: error.message,
    });
  }
};

function generateRandomPassword(length = 8) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => charset[x % charset.length])
    .join("");
}

const getUserById = async (req, res) => {
  try {
    const users = await User.findById(req.params.id);
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
    const { id } = req.params;
    const start = moment(req.body.workStartTime, "HH:mm:ss");
    const end = moment(req.body.workEndTime, "HH:mm:ss");
    let durationSeconds = end.diff(start, "seconds");

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        code: 404,
        status: "Error",
        message: "User not found",
      });
    }
    const oldTeamId = existingUser.team?.toString();
    const newTeamId = req.body.team?.toString();
    const updateData = {
      ...req.body,
      workDuration: durationSeconds,
    };
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (newTeamId && oldTeamId && newTeamId !== oldTeamId) {
      await Team.findByIdAndUpdate(oldTeamId, {
        $inc: { teamMembersCount: -1 },
      });
      await Team.findByIdAndUpdate(newTeamId, {
        $inc: { teamMembersCount: 1 },
      });
    }
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
    const { id } = req.params;
    await User.findOneAndUpdate({ _id: id }, { isDeleted: true });
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "User deleted successfully",
    });
    const user = await User.findById(id);
    if (user.team) {
      const teamId = user.team;
      await Team.findByIdAndUpdate(teamId, {
        $inc: { teamMembersCount: -1 },
      });
    }
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
    const { ownerId } = req.params;
    const users = await User.find({
      isDeleted: false,
      $or: [{ _id: ownerId }, { ownerId: ownerId }],
    }).populate("team", "name");
    const activeCount = users.filter((user) => user.active === true).length;
    const inactiveCount = users.filter((user) => user.active === false).length;
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Users info fetched successfully",
      data: {
        users,
        activeCount,
        inactiveCount,
      },
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
    const { date } = req.query;
    const { id } = req.params;

    if (!date) {
      return res
        .status(400)
        .json({ message: "Date query parameter is required (YYYY-MM-DD)" });
    }
    const screenshotsDoc = await ScreenshotLog.findOne({
      userId: id,
      "dailyScreenshots.date": date,
    });
    // console.log(screenshots);
    if (!screenshotsDoc || screenshotsDoc.dailyScreenshots.date !== date) {
      return res.status(404).json({
        code: 200,
        status: "Not Found",
        message: "No screenshots found for the provided date",
        data: [],
      });
    }

    const reversedScreenshots =
      screenshotsDoc.dailyScreenshots.screenshots?.slice().reverse() || [];

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Gathered screenshots successfully",
      data: reversedScreenshots,
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
