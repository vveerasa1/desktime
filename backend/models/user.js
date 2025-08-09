const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    ownerId: { type: String },
    employeeId: { type: String },
    email: { type: String, required: true },
    password: { type: String },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
    role: { type: String },
    phone: { type: String },
    gender: { type: String },
    workingDays: { type: Array },
    workStartTime: { type: String },
    workEndTime: { type: String },
    minimumHours: { type: String },
    trackingDays: { type: Array },
    trackingStartTime: { type: String },
    trackingEndTime: { type: String },
    timeZone: { type: String },
    photo: { type: String },
    workDuration: { type: String },
    active: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    cognitoId: { type: String },  // Added field for Cognito user ID
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
