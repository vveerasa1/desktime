// ProjectTaskTabs.js
import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Paper, IconButton } from "@mui/material";
import ProjectTable from "../../components/UserProjects/ProjectTable";
import {
  projectData,
} from "../../components/UserProjects/StaticDatas/";
import CustomSearchInput from "../../components/CustomSearchInput";
import FilterListIcon from "@mui/icons-material/FilterList";
import styles from './index.module.css'
const Projects = () => {
  const projectColumns = [
    "Project Name",
    "Task Name",
    "Created By",
    "Assignee",
    "Urgency",
    "Edit",
  ];

  return (
    <Box className={styles.container}>
      <Paper className={styles.paperContainer}>
        <Box >
          <>
            <Box py={2} display={"flex"} justifyContent={"end"}>
              <Box>
                <CustomSearchInput />
              </Box>
              <Box>
                <IconButton size="small">
                  <FilterListIcon fontSize="medium" />
                </IconButton>
              </Box>
            </Box>
            <ProjectTable data={projectData} columns={projectColumns} />
          </>
        </Box>
      </Paper>
    </Box>
  );
};

export default Projects;
