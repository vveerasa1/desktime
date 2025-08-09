const Project = require("../models/project");
const Task = require("../models/task");

// Add or Update Project
const saveProject = async (req, res) => {
  try {
    const { id, name, lead, status, userId, ownerId } = req.body;

    if (!name || !lead || !userId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    let project;

    if (id) {
      // Update
      project = await Project.findByIdAndUpdate(
        id,
        {
          name,
          lead,
          modifiedBy: userId,
          status,
          ownerId,
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
        lead,
        createdBy: userId,
        ownerId,
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
  const { ownerId } = req.params;
  try {
    const projects = await Project.find({ ownerId }).populate(
      "lead createdBy modifiedBy",
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
      "lead createdBy modifiedBy",
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
    const projectId = req.params.id;

    // Find all tasks linked to the project
    const tasks = await Task.find({ projectId });

    // Check if all tasks are marked as "Done"
    const allDone = tasks.every((task) => task.status === "Done");

    if (!allDone) {
      return res.status(400).json({
        code: 400,
        status: "Error",
        message:
          "Cannot delete project. All associated tasks must be marked as 'Done'.",
      });
    }

    // Delete all tasks related to the project
    await Task.deleteMany({ projectId });

    // Delete the project itself
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found." });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Project and associated tasks deleted successfully.",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Failed to delete project and tasks.",
      error: err.message,
    });
  }
};
const searchProjects = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const {
      name,
      lead,
      status,
      createdBy,
      modifiedBy,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Build the search query
    const searchQuery = { ownerId };

    // Add field-specific searches if provided
    if (name) {
      searchQuery.name = { $regex: new RegExp(name, 'i') };
    }
    if (lead) {
      searchQuery.lead = lead;
    }
    if (status) {
      searchQuery.status = status;
    }
    if (createdBy) {
      searchQuery.createdBy = createdBy;
    }
    if (modifiedBy) {
      searchQuery.modifiedBy = modifiedBy;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const total = await Project.countDocuments(searchQuery);

    // Find projects with search criteria
    const projects = await Project.find(searchQuery)
      .populate("lead createdBy modifiedBy", "username")
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      code: 200,
      status: 'Success',
      message: 'Projects fetched successfully',
      data: {
        projects,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error('Error searching projects:', err);
    res.status(500).json({
      code: 500,
      status: 'Error',
      message: 'Failed to search projects',
      error: err.message,
    });
  }
};

module.exports = {
  deleteProjectById,
  getProjectById,
  getAllProjects,
  saveProject,
  searchProjects
};
