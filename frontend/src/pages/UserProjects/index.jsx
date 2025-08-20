import React, { useState, useMemo } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  CircularProgress,
  Alert
} from "@mui/material";
import ProjectTable from "../../components/UserProjects/ProjectTable";
import CustomSearchInput from "../../components/CustomSearchInput";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import styles from "./index.module.css";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ProjectModal from "../../components/UserProjects/ProjectModal";
import MuiToaster from "../../components/MuiToaster";
import { jwtDecode } from "jwt-decode";
import { useGetAllProfileQuery } from "../../redux/services/user";
import { useGetAllProjectsQuery, useSearchProjectQuery } from "../../redux/services/projects";
import { useGetAllTasksQuery, useSearchTaskQuery } from "../../redux/services/task";
import TaskTable from "../../components/UserProjects/TaskTable";
import TaskModal from "../../components/UserProjects/TaskModal";
import LoadingComponent from "../../components/ComponentLoader";
import { useDebounce } from "../../hooks/useDebounce";
import SearchIcon from "@mui/icons-material/Search";
import CustomTextField from "../../components/CustomTextField";
const Projects = () => {
  const autUser = JSON.parse(localStorage.getItem("autUser"));
  let userId = autUser?._id || null;
  let ownerId = autUser?.ownerId || null;
  // if (token) {
  //   const decoded = jwtDecode(token);
  //   userId = decoded?.userId;
  //   ownerId = decoded?.ownerId;
  // } else {
  //   console.log("ERROR");
  // }

  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
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

  // Data fetching queries
  const { data: getAllProjectsData, isLoading: getAllProjectsIsLoading } =
    useGetAllProjectsQuery({ id: ownerId });

  const { data: getAllTaskData, isLoading: getAllTaskDataIsLoading } =
    useGetAllTasksQuery({ id: ownerId });

  const { data: profileData, isSuccess } = useGetAllProfileQuery({ id: ownerId });

  // Search queries
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchProjectQuery(
    {
      id: ownerId,
      searchParams: { name: debouncedSearchText },
    },
    { skip: !debouncedSearchText || tabIndex !== 0 }
  );

  const {
    data: searchTaskResults,
    isLoading: searchTaskLoading,
    isError: isTaskSearchError,
  } = useSearchTaskQuery(
    {
      id: ownerId,
      searchParams: { name: debouncedSearchText },
    },
    { skip: !debouncedSearchText || tabIndex !== 1 }
  );

  // Data mapping
  const mappedProjectData = useMemo(() => {
    const dataSource = debouncedSearchText && tabIndex === 0 ? 
      searchResults?.data?.projects : 
      getAllProjectsData?.data;

    return (
      dataSource?.map((item) => ({
        _id: item._id,
        project_name: item.name,
        team_lead: item.lead?.username || "—",
        status: item.status,
        created_by: item.createdBy?.username || "—",
      })) || []
    );
  }, [getAllProjectsData, searchResults, debouncedSearchText, tabIndex]);

  const mappedProjectOptions = useMemo(() => {
    return (
      getAllProjectsData?.data?.map((item) => ({
        id: item._id,
        name: item.name,
      })) || []
    );
  }, [getAllProjectsData]);

  const mappedTaskData = useMemo(() => {
    const dataSource = debouncedSearchText && tabIndex === 1 ? 
      searchTaskResults?.data?.tasks : 
      getAllTaskData?.data;

    return (
      dataSource?.map((item) => ({
        _id: item._id,
        task_name: item.name,
        description: item.description || "—",
        project: item.projectId?.name || "—",
        assignee: item.assignee?.username || "—",
        status: item.status || "—",
        created_by: item.createdBy?.username || "—",
        created_at: new Date(item.createdAt).toLocaleString(),
      })) || []
    );
  }, [getAllTaskData, searchTaskResults, debouncedSearchText, tabIndex]);

  const formattedProfile = useMemo(() => {
    if (isSuccess && Array.isArray(profileData?.data?.users)) {
      return profileData.data.users.map((profile) => ({
        id: profile._id,
        name: profile.username,
      }));
    }
    return [];
  }, [isSuccess, profileData]);

  // Table columns
  const projectColumns = ["Project Name", "Team Lead", "Status", "Created By"];
  const taskColumn = ["Task Name", "Project", "Status", "Created By", "assignee"];

  // Selection handlers
  const handleProjectSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = mappedProjectData.map((row) => row._id);
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

  // Modal handlers
  const handleOpen = (id) => {
    if (id) {
      setProjectId(id);
      const project = mappedProjectData.find(p => p._id === id);
      if (project) {
        setProjectFormData({
          projectName: project.project_name,
          teamLead: project.team_lead_id || "",
          status: project.status || ""
        });
      }
    } else {
      setProjectId(null);
      setProjectFormData({
        projectName: "",
        teamLead: "",
        status: ""
      });
    }
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setProjectId(null);
    setErrors({});
    setProjectFormData({
      projectName: "",
      teamLead: "",
      status: ""
    });
  };

  const handleTaskOpen = (id) => {
    if (id) {
      setTaskId(id);
      const task = mappedTaskData.find(t => t._id === id);
      if (task) {
        setTaskFormData({
          taskName: task.task_name,
          description: task.description,
          project: task.project_id || "",
          assignee: task.assignee_id || "",
          status: task.status || ""
        });
      }
    } else {
      setTaskId(null);
      setTaskFormData({
        taskName: "",
        description: "",
        project: "",
        assignee: "",
        status: ""
      });
    }
    setOpenTask(true);
  };

  const onTaskClose = () => {
    setOpenTask(false);
    setTaskId(null);
    setErrors({});
    setTaskFormData({
      taskName: "",
      description: "",
      project: "",
      assignee: "",
      status: ""
    });
  };

  // Form handlers
  const handleChange = (event, name) => {
    const { value } = event.target;
    if (tabIndex === 0) {
      setProjectFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setTaskFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelect = (event, name) => {
    const { value } = event.target;
    if (tabIndex === 0) {
      setProjectFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setTaskFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (event, name) => {
    const value = tabIndex === 0 ? projectFormData[name] : taskFormData[name];
    if (!value || value.trim() === "") {
      setErrors(prev => ({
        ...prev,
        [name]: `${labelMap[name]} is required.`,
      }));
    }
  };

  const labelMap = {
    projectName: "Project Name",
    taskName: "Task Name",
    assignee: "Assignee",
  };

  const statusOptions = [
    { id: "To-do", name: "To-do" },
    { id: "In-progress", name: "In-progress" },
    { id: "Done", name: "Done" },
  ];

  // Toaster handlers
  const handleOpenToaster = (message, severity = "success") => {
    setToaster({ open: true, message, severity });
  };

  const handleCloseToaster = () => {
    setToaster(prev => ({ ...prev, open: false }));
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    setSearchText(""); // Clear search when switching tabs
  };

  const handleClearSearch = () => {
    setSearchText("");
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
        <Typography sx={{ fontSize: "23px" }} fontWeight={600} color="#333333">
          Projects
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{height:40}} >
           <CustomTextField
                            name="search"
                            fullWidth
                            startIcon={<SearchIcon />}
              placeholder={tabIndex === 0 ? "Search projects..." : "Search tasks..."}
                            value={searchText}
                            handleChange={(e) => setSearchText(e.target.value)}
                          />
                          
            {searchText && (
              <IconButton
                size="small"
                onClick={handleClearSearch}
                sx={{ 
                  position: 'absolute', 
                  right: '10px', 
                  top: '8px',
                  color: 'text.secondary'
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
            {(isSearchLoading || searchTaskLoading) && (
              <CircularProgress 
                size={20} 
                sx={{ 
                  position: 'absolute', 
                  right: '40px', 
                  top: '10px' 
                }} 
              />
            )}
          </Box>
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

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        sx={{ mb: 2 }}
        TabIndicatorProps={{ style: { display: "none" } }}
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

      {/* Error Handling */}
      {(isSearchError || isTaskSearchError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load search results. Please try again.
        </Alert>
      )}

      {/* Tab Content */}
      {tabIndex === 0 ? (
        <>
          <Paper className={styles.paperContainer}>
            {(getAllProjectsIsLoading || isSearchLoading) ? (
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
                isEmpty={mappedProjectData.length === 0}
                isSearching={!!debouncedSearchText}
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
          {(getAllTaskDataIsLoading || searchTaskLoading) ? (
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
              isEmpty={mappedTaskData.length === 0}
              isSearching={!!debouncedSearchText}
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