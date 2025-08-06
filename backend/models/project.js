const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Project name
    },
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The user responsible for the task
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Completed"],
      default: "Active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ownerId: {
      type: String,
      ref: "User",
      required: true,
    },

    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
