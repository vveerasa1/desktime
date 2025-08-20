const mongoose = require("mongoose");

const ActiveAppsSchema = new mongoose.Schema(
  {
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "TrackingSession" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    appName: {
      type: String,
    },
    appIcon: {
      type: String,
    },
    duration: {
      type: Number,
    },
    productivity: {
      type: String,
      enum: ["Productive", "Unproductive", "Neutral"],
      default: "Neutral",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActiveApps", ActiveAppsSchema);
