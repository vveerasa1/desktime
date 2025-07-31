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
import CustomSearchInput from "../../components/CustomSearchInput";
import FilterListIcon from "@mui/icons-material/FilterList";
import styles from "./index.module.css";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ProjectModal from "../../components/UserProjects/ProjectModal";
import MuiToaster from "../../components/MuiToaster";
import { jwtDecode } from "jwt-decode";
import { useGetAllProfileQuery } from "../../redux/services/user";
import { useGetAllProjectsQuery } from "../../redux/services/projects";
import { useGetAllTasksQuery } from "../../redux/services/task";
import TaskTable from "../../components/UserProjects/TaskTable";
import TaskModal from "../../components/UserProjects/TaskModal";
import LoadingComponent from "../../components/ComponentLoader";

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

  const mappedProjectOptions = useMemo(() => {
    return (
      getAllProjectsData?.data?.map((item) => ({
        id: item._id, // or item._id if you meant actual ID
        name: item.name,
      })) || []
    );
  }, [getAllProjectsData]);

  const { data: getAllTaskData, isLoading: getAllTaskDataIsLoading } =
    useGetAllTasksQuery({ id: ownerId });

  const mappedTaskData = useMemo(() => {
    return (
      getAllTaskData?.data?.map((item) => ({
        _id: item._id,
        task_name: item.name,
        description: item.description || "—",
        project: item.projectId?.name || "—",
        assignee: item.assignee?.username || "—",
        status: item.status || "—",
        created_by: item.createdBy?.username || "—",
        created_at: new Date(item.createdAt).toLocaleString(), // Optional formatting
      })) || []
    );
  }, [getAllTaskData]);

  console.log(mappedTaskData, "TASK DATA");
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
  const [projectSelected, setProjectSelected] = useState([]);
  const [taskSelected, setTaskSelected] = useState([]);

  const [open, setOpen] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [taskId, setTaskId] = useState(null);

  const [projectFormData, setProjectFormData] = useState({
    projectName: "",
    teamLead: "",
    status: "",
  });

  const [taskFormData, setTaskFormData] = useState({
    taskName: "",
    description: "",
    project: "",
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

  const handleProjectSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = mappedProjectData.map((row) => row._id);
      console.log(allIds, "ALL IDS");
      setProjectSelected(allIds);
    } else {
      setProjectSelected([]);
    }
  };

  const handleProjectSelectOne = (event, id) => {
    event.stopPropagation();

    const selectedIndex = projectSelected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...projectSelected, id];
    } else {
      newSelected = projectSelected.filter((item) => item !== id);
    }

    setProjectSelected(newSelected);
  };

  const handleTaskSelectAll = (event) => {
    if (event?.target?.checked) {
      const allIds = mappedTaskData.map((row) => row._id);
      setTaskSelected(allIds);
    } else {
      setTaskSelected([]);
    }
  };

  const handleTaskSelectOne = (event, id) => {
    const selectedIndex = taskSelected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...taskSelected, id];
    } else if (selectedIndex === 0) {
      newSelected = taskSelected.slice(1);
    } else if (selectedIndex === taskSelected.length - 1) {
      newSelected = taskSelected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [
        ...taskSelected.slice(0, selectedIndex),
        ...taskSelected.slice(selectedIndex + 1),
      ];
    }

    setTaskSelected(newSelected);
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
    setProjectId(null);
    setErrors({});

    setProjectFormData({
      projectName: "",
      teamLead: "",
      status: "",
    });
  };
  const handleTaskOpen = (id) => {
    if (id) {
      setTaskId(id);
    } else {
      setTaskId(null);
    }
    setOpenTask(true);
  };

  console.log(taskId, "TASK ID");

  const onTaskClose = () => {
    setOpenTask(false);
    setTaskId(null);
    setErrors({});
    setTaskFormData({
      taskName: "",
      description: "",
      project: "",
      assignee: "",
      status: "",
    });
    console.log("Task closed, taskId reset to:", null);
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

  const statusOptions = [
    {
      id: "To-do",
      name: "To-do",
    },
    { id: "In-progress", name: "In-progress" },
    { id: "Done", name: "Done" },
  ];

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
        <Typography sx={{fontSize:"23px"}} fontWeight={400} color="#333333">
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
                backgroundColor: "#143351",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AddTaskIcon />
                Add Project
              </Box>
            </Button>
          ) : (
            <Button
              onClick={() => handleTaskOpen()}
              variant="contained"
              sx={{
                textTransform: "none",
                whiteSpace: "nowrap",
                px: 4,
                backgroundColor: "#143351",
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
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        sx={{ mb: 2 }}
        TabIndicatorProps={{ style: { display: "none" } }} // hide the default underline
      >
        <Tab
          label="Projects"
          sx={{
            textTransform: "none",
            borderRadius: "8px 8px 0 0",
            color: "#143351",
            "&.Mui-selected": {
              backgroundColor: "#143351",
              color: "#fff",
            },
          }}
        />
        <Tab
          label="Tasks"
          sx={{
            textTransform: "none",
            borderRadius: "8px 8px 0 0",
            color: "#143351",
            "&.Mui-selected": {
              backgroundColor: "#143351",
              color: "#fff",
            },
          }}
        />
      </Tabs>

      {/* Tab Content */}
      {tabIndex === 0 ? (
        <>
          <Paper className={styles.paperContainer}>
            {getAllProjectsIsLoading ? (
              <LoadingComponent />
            ) : (
              <ProjectTable
                data={mappedProjectData}
                columns={projectColumns}
                handleProjectSelectAll={handleProjectSelectAll}
                handleProjectSelectOne={handleProjectSelectOne}
                selected={projectSelected}
                handleOpen={handleOpen}
                openToaster={handleOpenToaster}
              />
            )}
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
            statusOptions={statusOptions}
          />
        </>
      ) : (
        <Box>
          {getAllTaskDataIsLoading ? (
            <LoadingComponent />
          ) : (
            <TaskTable
              handleSelectAll={handleTaskSelectAll}
              handleSelectOne={handleTaskSelectOne}
              selected={taskSelected}
              data={mappedTaskData}
              columns={taskColumn}
              handleTaskOpen={handleTaskOpen}
              openToaster={handleOpenToaster}
            />
          )}

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
            mappedProjectOptions={mappedProjectOptions}
            taskId={taskId}
            statusOptions={statusOptions}
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
