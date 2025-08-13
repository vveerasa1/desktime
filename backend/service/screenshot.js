const moment = require("moment/moment");
const User = require("../models/user");
const TrackingSession = require("../models/trackingSession");
const ScreenshotLog = require("../models/screenshot");
const { uploadFileToS3 } = require("./upload");
const config = require("../config");

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
    console.log("now :" + now);

    let screenshotLog = await ScreenshotLog.findOne({
      userId: user._id,
      sessionId: session._id,
    });

    let screenshotEntries = [];

    const lastScreenshot =
      screenshotLog?.dailyScreenshots?.screenshots?.slice(-1)[0];
    console.log("lastScreenshot" + lastScreenshot);

    if (lastScreenshot) {
      const lastTime = new Date(lastScreenshot.screenshotTime).getTime(); // in ms
      console.log("lastTime" + lastTime);

      const nowMs = Date.now(); // current time in ms
      const diffMs = nowMs - lastTime; // difference in ms

      console.log("lastTime (ms):", lastTime);
      console.log("diffMs:", diffMs);

      console.log("Utc time :" + new Date().toISOString());

      // 4 minutes 30 seconds = 270,000 ms
      if (diffMs < 270000) {
        return res.status(400).json({
          code: 400,
          status: "Rejected",
          message:
            "Minimum 4 minutes 30 seconds gap required between screenshots",
        });
      }
    }
    const files = req.files;
    const screenshotFile = files.screenshot && files.screenshot[0];
    const iconFile = files.screenshotAppIcon && files.screenshotAppIcon[0];
    let screenshotUrl = null;
    if (screenshotFile) {
      const folderPath = `${user.employeeId}/${date}`;
      const uploadedScreenshot = await uploadFileToS3(
        screenshotFile,
        folderPath
      );
      screenshotUrl =
        config.AWS.publicUrl +
        `${folderPath}/${uploadedScreenshot.Key.split("/").pop()}`;
    }
    let iconUrl = null;
    if (iconFile) {
      const folderPath = `${user.employeeId}/${date}/icons`; // Create a subfolder for icons
      const uploadedIcon = await uploadFileToS3(iconFile, folderPath);
      iconUrl =
        config.AWS.publicUrl +
        `${folderPath}/${uploadedIcon.Key.split("/").pop()}`;
    }
    if (screenshotFile) {
      screenshotEntries.push({
        screenshotTime: now,
        screenshotApp: req.body.screenshotApp || "",
        screenshotPath: screenshotUrl,
        screenshotAppIcon: iconUrl, // Store the icon URL here
      });
    }

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
