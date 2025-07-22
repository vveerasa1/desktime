const Project = require("../models/Project");

// Add or Update Project
const saveProject = async (req, res) => {
  try {
    const { id, name, taskName, assignee, userId } = req.body;

    if (!name || !taskName || !assignee || !userId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    let project;

    if (id) {
      // Update
      project = await Project.findByIdAndUpdate(
        id,
        {
          name,
          taskName,
          assignee,
          modifiedBy: userId,
        },
        { new: true }
      );
      if (!project) {
        return res.status(404).json({ error: "Project not found." });
      }
    } else {
      // Create
      project = new Project({
        name,
        taskName,
        assignee,
        createdBy: userId,
      });
      await project.save();
      res.status(200).json({
        code: 200,
        status: "Success",
        message: "Project created successfully",
        data: project,
      });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Project modified successfully",
      data: project,
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

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "assignee createdBy modifiedBy",
      "username"
    );
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Projects fetched successfully",
      data: projects,
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

// Get project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "assignee createdBy modifiedBy",
      "username"
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Internal server error.",
      data: project,
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

// Delete project by ID
const deleteProjectById = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Project not found." });
    }
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Project deleted successfully",
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
  deleteProjectById,
  getProjectById,
  getAllProjects,
  saveProject,
};
