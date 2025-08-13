const mongoose = require("mongoose");

const screenshotSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "TrackingSession" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Array of entries per date
    dailyScreenshots: {
      date: { type: String }, // Format: 'YYYY-MM-DD'

      screenshots: [
        {
          screenshotTime: { type: Date },
          screenshotApp: { type: String },
          screenshotPath: { type: String },
          screenshotAppIcon: { type: String },
        },
      ],
    },
  },
  { timestamps: true }
);

const ScreenshotLog = mongoose.model("ScreenshotLog", screenshotSchema);

module.exports = ScreenshotLog;
