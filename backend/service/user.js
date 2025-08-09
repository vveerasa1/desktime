const moment = require("moment-timezone");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const config = require("../config");
const crypto = require("crypto");
const ScreenshotLog = require("../models/screenshot");
const trackingSession = require("../models/trackingSession");
const Team = require("../models/team");
const AWS = require("aws-sdk");

// Configure AWS Cognito
const cognito = new AWS.CognitoIdentityServiceProvider({
  region: config.AWS.region,
  accessKeyId: config.AWS.ACCESS_KEY_ID,
  secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
});

const isUserExist = async (req, res) => {

  try {
    console.log('user', req.user)
    let user = await User.findOne({ cognitoId: req.user.sub });
    let isUpdate = true;
    if (!user) {
      user = await User.create({ cognitoId: req.user.sub });
      isUpdate = false;
    }
    res.status(200).json({
      message: `User ${isUpdate ? "updated" : "created"} successfully`,
      user
    } );
  } catch (err) {
    console.log(err);
    next(err);
  }
};

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
      teamId,
      ownerId,
    } = req.body;
    const password = await generateRandomPassword(12); // plain text password

    // Create user in AWS Cognito first
    const params = {
      UserPoolId: config.cognito.userPoolId,
      Username: email,
      // email:email,
      TemporaryPassword: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "email_verified", Value: "true" },
        { Name: "name", Value: username },
      ],
      MessageAction: "SUPPRESS", // Do not send invitation email from Cognito
    };

    let cognitoUser;
    try {
      const createUserResponse = await cognito.adminCreateUser(params).promise();
      cognitoUser = createUserResponse.User;
    } catch (cognitoError) {
      console.error("Error creating user in Cognito:", cognitoError);
      return res.status(500).json({
        code: 500,
        status: "Error",
        message: "Error creating user in Cognito",
        error: cognitoError.message,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let durationSeconds = 0;
    const admin = await User.findOne({ cognitoId: ownerId });
    console.log("printing");
    console.log(admin);
    if (workStartTime && workEndTime) {
      const start = moment(workStartTime, "HH:mm:ss");
      const end = moment(workEndTime, "HH:mm:ss");

      durationSeconds = end.diff(start, "seconds");
    }
    const allUsers = await User.find();
    let user;
    if (admin) {
      const start = moment(admin.workStartTime, "HH:mm:ss");
      const end = moment(admin.workEndTime, "HH:mm:ss");

      durationSeconds = end.diff(start, "seconds");
      user = new User({
        username,
        employeeId: employeeId ? employeeId : allUsers.length + 1,
        email,
        password: hashedPassword,
        team: admin.team,
        gender,
        role: "Employee",
        phone,
        workingDays: admin.workingDays,
        workStartTime: admin.workStartTime,
        workEndTime: admin.workEndTime,
        minimumHours: admin.minimumHours,
        flexibleHours: flexibleHours ? true : false,
        trackingDays: admin.trackingDays,
        trackingStartTime: admin.trackingStartTime,
        trackingEndTime: admin.trackingEndTime,
        timeZone: admin.timeZone,
        photo: `https://ui-avatars.com/api/?name=${username
          .split(" ")
          .join("+")}&background=0D8ABC&color=fff`,
        workDuration: durationSeconds,
        teamId,
        ownerId,
        cognitoId: cognitoUser.Attributes.find(attr => attr.Name === "sub").Value,
      });
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
        teamId,
        cognitoId: cognitoUser.Attributes.find(attr => attr.Name === "sub").Value,
      });
    }

    await user.save();
    if (role === "Owner") {
      user.ownerId = user._id;
      await user.save();
    }
    if (teamId) {
      await Team.findByIdAndUpdate(teamId, { $inc: { teamMembersCount: 1 } });
    }
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

// function generateRandomPassword(length = 8) {
//   const charset =
//     "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
//   return Array.from(crypto.randomFillSync(new Uint32Array(length)))
//     .map((x) => charset[x % charset.length])
//     .join("");
// }
const generateRandomPassword = (length = 12) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const all = uppercase + lowercase + numbers + symbols;

  // Ensure at least one of each requirement
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 4; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  return password.split('').sort(() => Math.random() - 0.5).join('');
};

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


const getUserByCognitoId = async (req, res) => {
  try {
    const users = await User.findOne({ cognitoId: req.params.id });
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
    const oldTeamId = existingUser.teamId?.toString();
    const newTeamId = req.body.teamId?.toString();
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
      $or: [
        { cognitoId: ownerId },
        { ownerId: ownerId }],
    });
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
    const screenshots = await ScreenshotLog.findOne({
      userId: id,
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
  getUserByCognitoId,
  updateUser,
  getAllUser,
  getScreenshotsById,
  getUser,
  deleteUser,
  isUserExist
};
