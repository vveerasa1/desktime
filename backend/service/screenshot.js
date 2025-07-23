const moment = require("moment/moment");
const User = require("../models/user");
const TrackingSession = require("../models/trackingSession");
const ScreenshotLog = require("../models/screenshot");
const { uploadFileToS3 } = require("./upload");

const addScreenshot = async (req, res) => {
  try {
    console.log(req.body);
    console.log("Screenshot process");
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const session = await TrackingSession.findById(req.body.sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const date = moment().format("YYYY-MM-DD");
    const now = new Date();

    let screenshotEntries = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const folderPath = `${user.employeeId}/${date}`;
        const uploadedFile = await uploadFileToS3(file, folderPath);
        screenshotEntries.push({
          screenshotTime: now,
          screenshotApp: req.body.screenshotApp || "",
          screenshotPath: uploadedFile.Location,
        });
      }
    }

    let screenshotLog = await ScreenshotLog.findOne({
      userId: user._id,
      sessionId: session._id,
    });

    if (screenshotLog) {
      // Check if the date matches
      if (screenshotLog.dailyScreenshots.date === date) {
        screenshotLog.dailyScreenshots.screenshots.push(...screenshotEntries);
      } else {
        // Overwrite with new date and screenshots
        screenshotLog.dailyScreenshots = {
          date,
          screenshots: screenshotEntries,
        };
      }

      await screenshotLog.save();
    } else {
      // Create new document
      screenshotLog = await ScreenshotLog.create({
        userId: user._id,
        sessionId: session._id,
        dailyScreenshots: {
          date,
          screenshots: screenshotEntries,
        },
      });
    }
    console.log("Screenshot processed successfully");
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Screenshots added successfully",
      data: screenshotLog,
    });
  } catch (err) {
    console.error("Error in addScreenshot:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addScreenshot };
