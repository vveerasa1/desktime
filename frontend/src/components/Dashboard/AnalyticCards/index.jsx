import { Grid, Box, Typography } from "@mui/material"; // Added Typography import
import { statCardsData } from "./constant";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import moment from "moment";
import { useMemo } from "react";
import TrackingCard from "./Tracking";
import ProjectCard from "./Projects";
import styles from "./index.module.css";
import { jwtDecode } from "jwt-decode";
import { useGetAllProfileQuery } from "../../../redux/services/user";
import { useGetAllProjectsQuery } from "../../../redux/services/projects";
import { useGetAllTasksQuery } from "../../../redux/services/task";
import { useState } from "react";
dayjs.extend(duration);
import MuiToaster from "../../MuiToaster";
import PhonelinkOffIcon from "@mui/icons-material/PhonelinkOff"; // Helper to convert seconds to "Xh Ym"
const formatSecondsToHHMM = (seconds) => {
  if (typeof seconds !== "number" || isNaN(seconds)) return "--";
  const dur = dayjs.duration(seconds, "seconds");
  const hours = dur.hours();
  const minutes = dur.minutes();
  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`.trim();
};

const AnalyticCards = ({ getDashboardData, userId, ownerId }) => {
  const { data: getAllProjectsData, isLoading: getAllProjectsIsLoading } =
    useGetAllProjectsQuery({ id: ownerId });

  const mappedProjectOptions = useMemo(() => {
    return (
      getAllProjectsData?.data?.map((item) => ({
        id: item._id,
        name: item.name,
      })) || []
    );
  }, [getAllProjectsData]);

  const { data: getAllTaskData, isLoading: getAllTaskDataIsLoading } =
    useGetAllTasksQuery({ id: ownerId });

  const STATUS_COLORS = {
    done: "#23b413ff",
    "In-progress": "#FFF287",
    "to-do": "#C83F12",
    default: "#f1e156ff",
  };

  const mappedTaskData = useMemo(() => {
    return (
      getAllTaskData?.data?.map((item) => ({
        _id: item._id,
        task_name: item.name,
        description: item.description || "—",
        project: item.projectId?.name || "—",
        assignee: item.assignee?.username || "—",
        status: item.status || "—",
        barColor:
          STATUS_COLORS[item.status?.toLowerCase()] || STATUS_COLORS.default,
        created_by: item.createdBy?.username || "—",
        created_at: new Date(item.createdAt).toLocaleString(),
      })) || []
    );
  }, [getAllTaskData]);

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

  const dashboardData = getDashboardData?.data || {};

  // Check if there's any tracking data
  const hasTrackingData = useMemo(() => {
    return (
      dashboardData?.arrivalTime ||
      dashboardData?.leftTime ||
      dashboardData?.deskTime ||
      dashboardData?.timeAtWork
    );
  }, [dashboardData]);

  const dynamicStatCards = useMemo(() => {
    return statCardsData.map((card) => {
      switch (card.title) {
        case "Arrival time":
          return {
            ...card,
           value: dashboardData?.arrivalTime
  ? moment(dashboardData.arrivalTime, "HH:mm:ss").format("hh:mm A")
  : "00:00",

          };

        case "Left time":
          return {
            ...card,
            value: dashboardData.leftTime
              ? moment(dashboardData.leftTime, "HH:mm:ss").format("HH:mm")
              : dashboardData.arrivalTime
              ? "ONLINE"
              : "00:00",
            valueColor:
              !dashboardData.leftTime && dashboardData.arrivalTime
                ? "#FFA500"
                : undefined,
          };

        case "Desktime":
          return {
            ...card,
            value: dashboardData.deskTime
              ? formatSecondsToHHMM(dashboardData.deskTime)
              : "00:00",
          };

        case "Time at work":
          return {
            ...card,
            value: dashboardData.timeAtWork
              ? formatSecondsToHHMM(dashboardData.timeAtWork)
              : "00:00",
          };

        default:
          return card;
      }
    });
  }, [dashboardData]);

  const orderedCards = useMemo(() => {
    return [
      dynamicStatCards.find((card) => card.title === "Arrival time"),
      dynamicStatCards.find((card) => card.title === "Left time"),
      dynamicStatCards.find((card) => card.title === "Desktime"),
      dynamicStatCards.find((card) => card.title === "Time at work"),
    ].filter(Boolean);
  }, [dynamicStatCards]);

  const [openTask, setOpenTask] = useState(false);
  const tableHeaders = useMemo(
    () => [
      { title: "Task" },
      { title: "Project" },
      { title: "Assignee" },
      { title: "Status" },
      { title: "Created By" },
    ],
    []
  );
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

  const handleTaskOpen = () => {
    setOpenTask(true);
  };

  const onTaskClose = () => {
    setOpenTask(false);
    setErrors({});
    setTaskFormData({
      taskName: "",
      description: "",
      project: "",
      assignee: "",
      status: "",
    });
  };

  const handleChange = (event, name) => {
    const { value } = event.target;
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
    if (taskFormData[name].trim() === "") {
      setErrors({
        ...errors,
        [name]: `${[name]} is required.`,
      });
    }
  };

  const handleOpenToaster = (message, severity = "success") => {
    setToaster({ open: true, message, severity });
  };

  const handleCloseToaster = () => {
    setToaster({ ...toaster, open: false });
  };

  return (
    <Grid>
      <Box >
        {hasTrackingData ? (
          <TrackingCard orderedCards={orderedCards} />
        ) : (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <PhonelinkOffIcon sx={{ fontSize: 70, color: "grey" }} />
            </Box>
            <Typography
              variant="h6"
              align="center"
              sx={{ p: 3, color: "grey" }}
            >
              To track your time, make sure you have downloaded the desktop app
              and logged in.
              <br />
              You can download TrackMe app
            </Typography>
          </Box>
        )}
      </Box>
      <Box mt={1}>
        <ProjectCard
          userId={userId}
          ownerId={ownerId}
          taskFormData={taskFormData}
          setTaskFormData={setTaskFormData}
          errors={errors}
          setErrors={setErrors}
          formattedProfile={formattedProfile}
          mappedProjectOptions={mappedProjectOptions}
          handleCloseToaster={handleCloseToaster}
          handleOpenToaster={handleOpenToaster}
          mappedTaskData={mappedTaskData}
          handleBlur={handleBlur}
          handleSelect={handleSelect}
          handleChange={handleChange}
          openTask={openTask}
          onTaskClose={onTaskClose}
          handleTaskOpen={handleTaskOpen}
          tableHeaders={tableHeaders}
        />
      </Box>

      <MuiToaster
        open={toaster.open}
        message={toaster.message}
        severity={toaster.severity}
        handleClose={handleCloseToaster}
      />
    </Grid>
  );
};

export default AnalyticCards;
