// ProjectTaskTabs.js
import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Paper, IconButton,Button } from "@mui/material";
import ProjectTable from "../../components/UserProjects/ProjectTable";
import { projectData } from "../../components/UserProjects/StaticDatas/";
import CustomSearchInput from "../../components/CustomSearchInput";
import FilterListIcon from "@mui/icons-material/FilterList";
import styles from "./index.module.css";
import AddTaskIcon from '@mui/icons-material/AddTask';const Projects = () => {
   const [selected, setSelected] = useState([]);
 
  const projectColumns = [
    "Project Name",
    "Task Name",
    "Created By",
    "Assignee",
    "Urgency",
  ];

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = projectData.map((row) => row._id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1),
      ];
    }

    setSelected(newSelected);
  };

  return (
    <Box className={styles.container}>
     <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap", 
            mb: 2, 
          }}
        >
          {/* Left-aligned Title */}
          <Typography variant="h5" component="h1" fontWeight="bold">
            Projects
          </Typography>

          {/* Right-aligned controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CustomSearchInput />

            <IconButton size="small">
              <FilterListIcon fontSize="medium" />
            </IconButton>
            
            <Button
              variant="contained"
              sx={{ textTransform: "none",whiteSpace:"nowrap",px:4, backgroundColor:"#1564bf"}}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                     <AddTaskIcon   />
                Add Task
                </Box>
               
            </Button>
          </Box>
        </Box>
      <Paper className={styles.paperContainer}>
        <Box>
          <>
            <ProjectTable  data={projectData} columns={projectColumns} handleSelectAll={handleSelectAll} handleSelectOne={handleSelectOne}
                        selected={selected}

            />
          </>
        </Box>
      </Paper>
    </Box>
  );
};

export default Projects;
