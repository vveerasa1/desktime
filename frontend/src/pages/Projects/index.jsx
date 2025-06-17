// ProjectTaskTabs.js
import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import DataTable from "./ProjectTable/index";
import { projectData, taskData } from "./StaticDatas/index";

const Projects = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const projectColumns = [
    "Project Name",
    "Created",
    "Created By",
    "Integration",
    "Progress",
    "Edit",
  ];

  const taskColumns = [
    "Task Name",
    "Project",
    "Created By",
    "Assignee",
    "Label",
    "Progress",
    "Urgency",
    "Edit",
  ];

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Tabs value={tabIndex} onChange={handleChange}>
        <Tab label="Projects" />
        <Tab label="Tasks" />
      </Tabs>

      <Box mt={2}>
        {tabIndex === 0 ? (
          <>
            <Typography variant="h6" mb={2}>
              Project List
            </Typography>
            <DataTable data={projectData} columns={projectColumns} />
          </>
        ) : (
          <>
            <Typography variant="h6" mb={2}>
              Task List
            </Typography>
            <DataTable data={taskData} columns={taskColumns} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default Projects;
