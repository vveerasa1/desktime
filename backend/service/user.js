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
const { addUserToGroups } = require("../utils/cognito");

// Configure AWS Cognito
const cognito = new AWS.CognitoIdentityServiceProvider({
  region: config.AWS.region,
  accessKeyId: config.AWS.ACCESS_KEY_ID,
  secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
});

async function handleRefreshToken(refreshToken, clientId) {
  try {
    const params = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    };
    const response = await cognito.initiateAuth(params).promise();
    console.log("New tokens:", response.AuthenticationResult);
    return response.AuthenticationResult; // contains access_token, id_token, etc.
  } catch (error) {
    console.error("Refresh token failed:", error.message);
    if (error.code === 'NotAuthorizedException') {
      throw new Error("Refresh token expired or invalid");
    }
    throw error;
  }
}
const refreshTokens = async (req, res) => {
  console.log(req.body)
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const tokens = await handleRefreshToken(refreshToken, config.cognito.clientId);
    res.status(200).json({
      message: "Token refreshed successfully",
      tokens,
    });
  } catch (err) {
    res.status(401).json({ message: err.message || "Failed to refresh token" });
  }
};
const globalLogout = async (req, res) => {
  try {

    const { email } = req.body; // short-lived token from client
    const response = await cognito.adminUserGlobalSignOut({
      UserPoolId: config.cognito.userPoolId,
      Username: email, // 👈 email as username
    }).promise().then((data) => {
      console.log(data);
    }).catch((err) => {
      console.error("Error during global sign out:", err);
    })
    res.status(200).json({ message: "User globally signed out" });
  } catch (err) {
    res.status(500).json({ message: "Failed to sign out globally" });
  }

};
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
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

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
        const password = await generateRandomPassword(12);
        console.log(password, "password*******************")
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
          const userPoolId = config.cognito.userPoolId
          cognitoUser = createUserResponse.User;
          addUserToGroups(email, userPoolId, ["trackmeAccess"]);

        } catch (cognitoError) {
          console.error("Error creating user in Cognito:", cognitoError);
          return res.status(500).json({
            code: 500,
            status: "Error",
            message: "Error creating user in Cognito",
            error: cognitoError.message,
          });
        }

        const existingUser = await User.findOne({
          email,
          ownerId,
          isDeleted: false,
        });
        if (existingUser) {
          errors.push({ email, error: "Email already exists" });
          continue;
        }

        // const password = await generateRandomPassword();
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
            cognitoId: cognitoUser.Attributes.find(attr => attr.Name === "sub").Value,

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
          subject: "TrackMe - Invitation",
          text: `Hi ${user.username},

You have been invited to join TrackMe.

        Here are your login credentials:
        Email: ${user.email}
        Password: ${password}

Please log in to your account:
https://trackme.pentabay.com

        ***** This is an auto-generated email. Please do not reply. *****

Best regards,  
TrackMe - Pentabay Team`,
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
    const oldTeamId = existingUser.team?.toString();
    const newTeamId = req.body.team;
    const updateData = {
      ...req.body,
      workDuration: durationSeconds,
    };
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (newTeamId && oldTeamId === undefined) {
      await Team.findByIdAndUpdate(newTeamId, {
        $inc: { teamMembersCount: 1 },
      });
    }

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
    const { search } = req.query;
    let filter = {
      isDeleted: false,
      $or: [{ _id: ownerId }, { ownerId: ownerId }],
    };

    if (search && search.trim() !== "") {
      filter.$and = [
        {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }
    const users = await User.find(filter).populate("team", "name");

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
      return res.status(200).json({
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
      userId: req.params.id,
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

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    const user = await User.findOne({ email, isDeleted: false });
    if (!user)
      return res
        .status(400)
        .json({ message: "New password must not be the old password" });

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res
        .status(400)
        .json({ message: "New password must not be the old password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Password reset successfully",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Failed to reset password",
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
  isUserExist,
  // searchUsers,
  resetPassword,
  globalLogout,
  refreshTokens
};
