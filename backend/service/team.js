const Team = require("../models/team");
const User = require("../models/user");
const mongoose = require("mongoose");

// Create a team
const addTeam = async (req, res) => {
  try {
    const { name, ownerId } = req.body;

    const team = new Team({ name, ownerId });
    await team.save();

    res.status(201).json({
      code: 200,
      status: "Success",
      message: "Team created successfully",
      data: team,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Failed to create teams",
      error: err.message,
    });
  }
};

// Update a team
const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ownerId } = req.body;

    const team = await Team.findByIdAndUpdate(
      id,
      { name, ownerId },
      { new: true }
    );

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Team updated successfully",
      data: team,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Failed to update teams",
      error: err.message,
    });
  }
};

// Delete a team (only if no users are assigned)
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const userExists = await User.exists({ team: id, isDeleted: false });

    if (userExists) {
      return res
        .status(400)
        .json({ error: "Cannot delete team, users exist in this team." });
    }

    const team = await Team.findByIdAndDelete(id);

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Team deleted successfully",
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

// Get all teams
const getAllTeams = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const teams = await Team.find({ ownerId });
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "All Team fetched successfully",
      data: teams,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Failed to fetch teams",
      error: err.message,
    });
  }
};

const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Team fetched successfully",
      data: team,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      status: "Error",
      message: "Failed to fetch team",
      error: err.message,
    });
  }
};

const searchTeams = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const {
      name,
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
    } = req.query;

    // Build the search query
    const searchQuery = { ownerId };

    // Add name search if provided
    if (name) {
      searchQuery.name = { $regex: new RegExp(name, 'i') };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const total = await Team.countDocuments(searchQuery);

    // Find teams with search criteria
    const teams = await Team.find(searchQuery)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      code: 200,
      status: 'Success',
      message: 'Teams fetched successfully',
      data: {
        teams,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      status: 'Error',
      message: 'Failed to search teams',
      error: err.message,
    });
  }
};

module.exports = {
  addTeam,
  getAllTeams,
  deleteTeam,
  updateTeam,
  getTeamById,
  searchTeams
};
