const Project = require("../models/project");
const Task = require("../models/task");

// Add or Update Task
const saveTask = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      projectId,
      assignee,
      status,
      userId,
      ownerId,
    } = req.body;

    if (!name || !projectId || !assignee || !userId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    let taskDoc;

    if (id) {
      // Update
      taskDoc = await Task.findByIdAndUpdate(
        id,
        {
          name,
          description,
          projectId,
          assignee,
          status,
          modifiedBy: userId,
          ownerId,
        },
        { new: true }
      );

      if (!taskDoc) {
        return res.status(404).json({ error: "Task not found." });
      }

      if (status === "Done") {
        const tasks = await Task.find({ projectId });
        const allDone = tasks.every((t) => t.status === "Done");

        if (allDone) {
          await Project.findByIdAndUpdate(projectId, {
            status: "Completed",
          });
        }
      }
    } else {
      // Create
      taskDoc = new Task({
        name,
        description,
        projectId,
        assignee,
        createdBy: userId,
        ownerId,
      });

      await taskDoc.save();

      await Project.findByIdAndUpdate(projectId, {
        status: "Active",
      });

      return res.status(200).json({
        code: 200,
        status: "Success",
        message: "Task created successfully",
        data: taskDoc,
      });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Task modified successfully",
      data: taskDoc,
    });
  } catch (err) {

    console.error(err);
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Internal server error.",
      error: err.message,
    });
  }
};


// Get all Tasks
const getAllTasks = async (req, res) => {
  const { ownerId } = req.params;
  try {
    const Tasks = await Task.find({ ownerId })
      .populate("assignee createdBy modifiedBy", "username")
      .populate("projectId", "name");
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Tasks fetched successfully",
      data: Tasks,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Internal server error.",
      error: err.message,
    });
  }
};

// Get Task by ID
const getTaskById = async (req, res) => {
  try {
    const TaskData = await Task.findById(req.params.id)
      .populate("assignee createdBy modifiedBy", "username")
      .populate("projectId", "name");

    if (!TaskData) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Internal server error.",
      data: TaskData,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Internal server error.",
      error: err.message,
    });
  }
};

// Delete Task by ID
const deleteTaskById = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Task deleted successfully",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Failed to delete teams",
      error: err.message,
    });
  }
};
module.exports = {
  deleteTaskById,
  getTaskById,
  getAllTasks,
  saveTask,
};
