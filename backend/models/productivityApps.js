const mongoose = require("mongoose");

const ProductivityAppsSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    appName: {
      type: String,
    },
    productivity: {
      type: String,
      enum: ["Productive", "Unproductive", "Neutral"],
      default: "Neutral",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductivityApps", ProductivityAppsSchema);
