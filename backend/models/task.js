const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Project name
    },

    description: {
      type: String,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    status: {
      type: String,
      enum: ["To-do", "In-progress", "Done"],
      default: "To-do",
    },

    assignee: {
      type: String,
      required: true,
    },
    cognitoId: { type: String },

    ownerId: {
      type: String,
      required: true,
    },

    createdBy: {
      type: String,
      required: true,
    },

    modifiedBy: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
