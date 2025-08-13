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
    console.log('screenshot',req.body.userId)
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

    if (lastScreenshot) {
      const lastTime = new Date(lastScreenshot.screenshotTime);
      console.log("lastTime :" + lastTime);
      const diffSeconds = (now - lastTime) / 1000;
      console.log("diffSeconds :" + diffSeconds);

      if (diffSeconds < 270) {
        return res.status(400).json({
          code: 400,
          status: "Rejected",
          message:
            "Minimum 4 minutes 30 seconds gap required between screenshots",
        });
      }
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const folderPath = `${user.employeeId}/${date}`;
        const uploadedFile = await uploadFileToS3(file, folderPath);
        const newFileName = uploadedFile.Key.split("/").pop();
        console.log(newFileName);
        const screenShotUrl =
          config.AWS.publicUrl + `${folderPath}/${newFileName}`;
        screenshotEntries.push({
          screenshotTime: now,
          screenshotApp: req.body.screenshotApp || "",
          screenshotPath: screenShotUrl,
        });
      }
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
