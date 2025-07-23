// ProjectTaskTabs.js
import React, { useState, useMemo } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import ProjectTable from "../../components/UserProjects/ProjectTable";
import { projectData } from "../../components/UserProjects/StaticDatas/";
import CustomSearchInput from "../../components/CustomSearchInput";
import FilterListIcon from "@mui/icons-material/FilterList";
import styles from "./index.module.css";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ProjectModal from "../../components/UserProjects/ProjectModal";
import MuiToaster from "../../components/MuiToaster";
import { jwtDecode } from "jwt-decode";
import { useGetAllProfileQuery } from "../../redux/services/user";
import { useGetAllProjectsQuery } from "../../redux/services/projects";
import TaskTable from "../../components/UserProjects/TaskTable";
import TaskModal from "../../components/UserProjects/TaskModal";

const Projects = () => {
  const token = localStorage.getItem("token");
  let userId = null;
  let ownerId = null;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded?.userId;
    ownerId = decoded?.ownerId;
  } else {
    console.log("ERROR");
  }

  const { data: getAllProjectsData, isLoading: getAllProjectsIsLoading } =
    useGetAllProjectsQuery({ id: ownerId });

  const mappedProjectData = useMemo(() => {
    return (
      getAllProjectsData?.data?.map((item) => ({
        _id: item._id,
        project_name: item.name,
        team_lead: item.lead?.username || "—",
        status: item.status,
        created_by: item.createdBy?.username || "—",
      })) || []
    );
  }, [getAllProjectsData]);

  const {
    data: profileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
    isSuccess,
  } = useGetAllProfileQuery({
    id: ownerId,
  });

  const formattedProfile = useMemo(() => {
    if (isSuccess && Array.isArray(profileData?.data?.users)) {
      return profileData.data.users.map((profile) => ({
        id: profile._id,
        name: profile.username,
      }));
    }
    return [];
  }, [isSuccess, profileData]);

  const [tabIndex, setTabIndex] = useState(0);
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [projectFormData, setProjectFormData] = useState({
    projectName: "",
    teamLead: "",
    status: "",
  });

  const [taskFormData, setTaskFormData] = useState({
    taskName: "",
    description: "",
    assignee: "",
    status: "",
  });
  const [errors, setErrors] = useState({});
  const [toaster, setToaster] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const projectColumns = ["Project Name", "Team Lead", "Status", "Created By"];

  const taskColumn = [
    "Task Name",
    "Project",
    "Status",
    "Created By",
    "assignee",
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

  const handleOpen = (id) => {
    if (id) {
      setProjectId(id);
    } else {
      setProjectId(null);
    }
    setOpen(true);
  };

 // In ProjectTaskTabs.js

const onClose = () => {
  setOpen(false);
  setProjectId(null); // Reset the project ID
  setErrors({});     // Clear any validation errors
  
  // Reset the form data to its initial empty state
  setProjectFormData({
    projectName: "",
    teamLead: "",
    status: "",
  });

  setTaskFormData({
      taskName: "",
    description: "",
    assignee: "",
    status: "",
  })
};
  const handleTaskOpen = () => {
    setOpenTask(true);
  };

  const onTaskClose = () => {
    setOpenTask(false);
  };

  const handleChange = (event, name) => {
    const { value } = event.target;
    setProjectFormData((prev) => ({
      ...prev,
      [name]: value,
      errors: {
        ...prev.errors,
        [name]: "",
      },
    }));

    setTaskFormData((prev) => ({
      ...prev,
      [name]: value,
      errors: {
        ...prev.errors,
        [name]: "",
      },
    }));
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSelect = (event, name) => {
    const { value } = event.target;
    setProjectFormData((prev) => ({
      ...prev,
      [name]: value,
      errors: {
        ...prev.errors,
        [name]: "",
      },
    }));

    setTaskFormData((prev) => ({
      ...prev,
      [name]: value,
      errors: {
        ...prev.errors,
        [name]: "",
      },
    }));
  };

  const handleBlur = (event, name) => {
    if (projectFormData[name].trim() === "") {
      setErrors({
        ...errors,
        [name]: `${labelMap[name]} is required.`,
      });
    }

    if (taskFormData[name].trim() === "") {
      setErrors({
        ...errors,
        [name]: `${labelMap[name]} is required.`,
      });
    }
  };

  const labelMap = {
    projectName: "Project Name",
    taskName: "Task Name",
    assignee: "Assignee",
  };

  const handleOpenToaster = (message, severity = "success") => {
    setToaster({ open: true, message, severity });
  };

  const handleCloseToaster = () => {
    setToaster({ ...toaster, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box className={styles.container}>
      {/* Page Heading */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h1" fontWeight="bold">
          Projects
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CustomSearchInput />
          <IconButton size="small">
            <FilterListIcon fontSize="medium" />
          </IconButton>
          {tabIndex === 0 ? (
            <Button
              onClick={() => handleOpen()}
              variant="contained"
              sx={{
                textTransform: "none",
                whiteSpace: "nowrap",
                px: 4,
                backgroundColor: "#1564bf",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AddTaskIcon />
                Add Project
              </Box>
            </Button>
          ) : (
            <Button
              onClick={handleTaskOpen}
              variant="contained"
              sx={{
                textTransform: "none",
                whiteSpace: "nowrap",
                px: 4,
                backgroundColor: "#1564bf",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AddTaskIcon />
                Add Task
              </Box>
            </Button>
          )}
        </Box>
      </Box>

      {/* Tabs placed below the heading */}
      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Projects" />
        <Tab label="Tasks" />
      </Tabs>

      {/* Tab Content */}
      {tabIndex === 0 ? (
        <>
          <Paper className={styles.paperContainer}>
            <ProjectTable
              data={mappedProjectData}
              columns={projectColumns}
              handleSelectAll={handleSelectAll}
              handleSelectOne={handleSelectOne}
              selected={selected}
              handleOpen={handleOpen}
            />
          </Paper>

          <ProjectModal
            handleOpen={handleOpen}
            errors={errors}
            setErrors={setErrors}
            handleChange={handleChange}
            handleCloseToaster={handleCloseToaster}
            handleBlur={handleBlur}
            formData={projectFormData}
            setFormData={setProjectFormData}
            open={open}
            onClose={onClose}
            openToaster={handleOpenToaster}
            userId={userId}
            ownerId={ownerId}
            formattedProfile={formattedProfile}
            handleSelect={handleSelect}
            projectId={projectId}
          />
        </>
      ) : (
        <Box>
          <TaskTable
            handleSelectAll={handleSelectAll}
            handleSelectOne={handleSelectOne}
            selected={selected}
            data={projectData}
            columns={taskColumn}
          />
          <TaskModal
            errors={errors}
            setErrors={setErrors}
            handleChange={handleChange}
            handleCloseToaster={handleCloseToaster}
            handleBlur={handleBlur}
            formData={taskFormData}
            setFormData={setTaskFormData}
            open={openTask}
            onClose={onTaskClose}
            openToaster={handleOpenToaster}
            userId={userId}
            ownerId={ownerId}
            formattedProfile={formattedProfile}
            handleSelect={handleSelect}
          />
        </Box>
      )}
      {/* Toaster */}
      <MuiToaster
        open={toaster.open}
        message={toaster.message}
        severity={toaster.severity}
        handleClose={handleCloseToaster}
      />
    </Box>
  );
};

export default Projects;
