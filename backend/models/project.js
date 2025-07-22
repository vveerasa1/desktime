const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Project name
    },

    taskName: {
      type: String,
      required: true, // Task under this project
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The user responsible for the task
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
