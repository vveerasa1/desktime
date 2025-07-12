const project = require("../model/Project");

const createProject = async (req, res) => {
    try {
        const { name, task } = req.body;
        const user = req.user;
        let userId = user.userId;
        let timeZone = user.timeZone;
        const now = moment().tz(timeZone).toDate();
        const createdProject = await project.create({
            name,
            task,
            userId,
            startDate: now
        });
    res.status(200).json({
      code: 200,
      status: "Success",
      message: "Project created successfully",
      data: createdProject,
    });
    } catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { createProject };