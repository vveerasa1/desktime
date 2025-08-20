import React, { useMemo, useState, useCallback } from "react";
import styles from "../../pages/TeamMembers/index.module.css";
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
  Paper,
  Avatar,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useGetAllTeamMembersQuery } from "../../redux/services/teamMembers";
import { jwtDecode } from "jwt-decode";
import SearchIcon from "@mui/icons-material/Search";
import TeamMembersForm from "../../components/TeamMembers/TeamMembersForm";
import { useGetAllTeamQuery } from "../../redux/services/team";
import MuiToaster from "../../components/MuiToaster";
import AbsentMembers from "../../components/TeamMembers/AbsentMembers";
import TeamSnapShot from "../../components/TeamMembers/TeamSnapShots";
import EmployeeList from "../../components/TeamMembers/EmployeeList";
import CustomTextField from "../../components/CustomTextField";
import CustomCalendar from "../../components/CustomCalender";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useGetAllSnapShotQuery } from "../../redux/services/teamMembers";

const columns = [
  "Name",
  "Productive time",
  "Offline time",
  "DeskTime",
  "Arrived at",
  "Left at",
];

const sscolumns = ["Name", "Timeline", "Total Time", "Avg Activity"];

const getStatusColor = (status) => {
  if (status === "active") return "#5fba2b";
  if (status === "neutral") return "#b6afafff";
  if (status === "inactive") return "#e6e1e1ff";
  if (status === "off") return "#ffffffff";
  return "#ccc";
};

const styletimeblock = {
  timelineBlock: {
    height: "100%",
    borderRadius: "1px",
  },
};

const formatTime = (seconds) => {
  if (seconds === null) return "-";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const TeamMembers = () => {
  const [formData, setFormData] = useState({
    teamMembers: [
      {
        id: 1,
        username: "",
        email: "",
        team: "",
        role: "",
        touched: {},
        errors: {},
      },
    ],
    selectAll: false,
    sendInvite: false,
    submissionError: "",
  });
  const [search, setSearch] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [date, setDate] = useState(dayjs());

  const handleDateChange = useCallback((newDate) => {
    setDate(newDate);
  }, []);

  const handleNextClick = () => {
    const nextDate = dayjs(date).add(1, "day");
    if (!nextDate.isAfter(dayjs(), "day")) {
      setDate(nextDate);
    }
  };

  const handlePrevClick = () => {
    const prevDate = dayjs(date).subtract(1, "day");
    setDate(prevDate);
  };

  const isNextDisabled =
    dayjs(date).isSame(dayjs(), "day") || dayjs(date).isAfter(dayjs(), "day");

  const formattedDate = date.format("YYYY-MM-DD");

  const token = localStorage.getItem("token");
  let ownerId = null;
  let role = null;
  if (token) {
    const decoded = jwtDecode(token);
    ownerId = decoded.ownerId;
    role = decoded?.role;
  }

  const skipQuery = !ownerId;
  const {
  data: getAllTeamMembersData,
  isLoading: getAllTeamMembersIsLoading,
  refetch: refetchTeamMembers,
} = useGetAllTeamMembersQuery(
  { id: ownerId, search: search, date: formattedDate },
  {
    skip: skipQuery,
    pollingInterval: 10000, // fetch every 10 seconds
  }
);

  const { data: getAllSnapShotData, isLoading: getAllSnapShotIsLoading } =
    useGetAllSnapShotQuery({ id: ownerId });

  const transformApiDataToSsrows = (apiData) => {
    if (!apiData?.data) return [];
    
    return apiData.data
      .filter((user) => user.username && user.session && user.session.length > 0)
      .map((user) => {
        // Calculate total time in hours and minutes
        const hours = Math.floor(user.totalTime / 3600);
        const minutes = Math.floor((user.totalTime % 3600) / 60);
        const totalTimeFormatted = `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;

        // Calculate average productivity
        const avgProductivity = Math.round(
          user.session.reduce((sum, session) => sum + session.productive, 0) /
            user.session.length
        );

        // Convert session times to minutes
        const sessionTimes = user.session.map(s => {
          const [hour, min] = s.time.split(':').map(Number);
          return hour * 60 + min;
        });
        
        const minTime = Math.min(...sessionTimes);
        const maxTime = Math.max(...sessionTimes);
        
        // Fixed timeline from 8 AM (480 minutes) to 8 PM (1200 minutes)
        const timelineStart = 480; // 8 AM in minutes
        const timelineEnd = 1200;  // 8 PM in minutes
        const totalSlots = (timelineEnd - timelineStart) / 5; // 144 slots (12 hours * 12 slots/hour)
        const timeline = Array(totalSlots).fill("off");

        // Process each session
        user.session.forEach((session) => {
          const [hour, min] = session.time.split(":").map(Number);
          const sessionTimeInMinutes = hour * 60 + min;
          
          // Only process sessions within our 8 AM - 8 PM window
          if (sessionTimeInMinutes >= timelineStart && sessionTimeInMinutes <= timelineEnd) {
            const slotIndex = Math.floor((sessionTimeInMinutes - timelineStart) / 5);

            // Calculate duration in 5-min intervals
            const durationMatch = session.total.match(/(\d+)m (\d+)s/);
            const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 0;
            const durationSeconds = durationMatch ? parseInt(durationMatch[2]) : 0;
            const durationSlots = Math.ceil((durationMinutes * 60 + durationSeconds) / 300);

            // Determine status
            let status;
            if (session.productive >= 80) status = "active";
            else if (session.productive >= 50) status = "neutral";
            else if (session.break > 0) status = "off";
            else status = "inactive";

            // Fill the timeline slots
            for (let i = 0; i < durationSlots && slotIndex + i < timeline.length; i++) {
              timeline[slotIndex + i] = status;
            }
          }
        });

        // Determine online status
        const now = new Date();
        const isOnline = user.session.some((session) => {
          const endTimeStr = session.timeRange.split(" - ")[1];
          const [endHour, endMin] = endTimeStr.split(":").map(Number);
          const sessionEndTime = new Date();
          sessionEndTime.setHours(endHour, endMin, 0, 0);
          return now - sessionEndTime <= 30 * 60 * 1000;
        });
        return {
          name: user.username,
          role: user.role || "User",
          userId: user.userId,
          initials: user.username
            .split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase(),
          photo: user.photo,
          status: isOnline ? "online" : "offline",
          timeline,
          totalTime: totalTimeFormatted,
          avgActivity: `${avgProductivity}%`,
          sessions: user.session.length,
          timelineStart: "08:00", // Fixed start at 8 AM
          timelineEnd: "20:00"    // Fixed end at 8 PM
        };
      });
  };

  const ssrows = transformApiDataToSsrows(getAllSnapShotData);

  const {
    data: teamsData,
    isLoading: isTeamsLoading,
    isError: isTeamsError,
    isSuccess,
    refetch: refetchTeams,
  } = useGetAllTeamQuery(ownerId, {
    skip: !ownerId,
  });

  const formattedTeamOptions = useMemo(() => {
    if (isSuccess && Array.isArray(teamsData?.data)) {
      return teamsData?.data?.map((team) => ({
        id: team._id,
        name: team.name,
      }));
    }
    return [];
  }, [isSuccess, teamsData]);

  const userData = getAllTeamMembersData?.data || [];
  const userCount = userData?.length || 0;
  const inactiveUserCount = userData.filter(
    (item) => item.user?.active === false
  ).length;
  const inactiveUsers = userData?.filter((item) => item.user?.active === false);

  const [activeTab, setActiveTab] = useState("tab1");
  const [open, setOpen] = useState(false);
  const [toaster, setToaster] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleOpenToaster = (message, severity = "success") => {
    setToaster({ open: true, message, severity });
  };

  const handleCloseToaster = () => {
    setToaster({ ...toaster, open: false });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      teamMembers: [
        {
          id: 1,
          username: "",
          email: "",
          team: "",
          role: "",
          touched: {},
          errors: {},
        },
      ],
      selectAll: false,
      sendInvite: false,
      submissionError: "",
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(() => {
        refetchTeamMembers();
      }, 500)
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3}>
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontSize: "23px" }}
              fontWeight={600}
              color="#333333"
            >
              Team Members
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ height: 40, width: "100%" }}>
                <Box>
                  <CustomTextField
                    name="search"
                    fullWidth
                    startIcon={<SearchIcon />}
                    placeholder="Search"
                    value={search}
                    handleChange={(e) => handleSearchChange(e, "name")}
                  />
                </Box>
              </Box>

              <IconButton size="small">
                <FilterListIcon fontSize="medium" />
              </IconButton>

              <Box sx={{ height: "40px" }} className={styles.datePicker}>
                <CustomCalendar
                  selectedDate={date}
                  name="date"
                  onChange={handleDateChange}
                  fontSize="small"
                  maxDate={dayjs()}
                />
              </Box>
              <Box sx={{ height: "40px" }} className={styles.nextPrevIcons}>
                <Box className={styles.npIcon} onClick={handlePrevClick}>
                  <ChevronLeft
                    sx={{ cursor: "pointer" }}
                    className={styles.icon}
                  />
                </Box>

                <Box
                  className={styles.npIcon}
                  onClick={!isNextDisabled ? handleNextClick : undefined}
                  sx={{
                    "& .MuiSvgIcon-root": {
                      cursor: isNextDisabled ? "not-allowed" : "pointer",
                      color: isNextDisabled ? "#ccc" : "inherit",
                    },
                  }}
                >
                  <ChevronRight
                    sx={{ cursor: "pointer" }}
                    className={styles.icon}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <Button
              onClick={handleOpen}
              variant="contained"
              sx={{
                textTransform: "none",
                whiteSpace: "nowrap",
                px: 1,
                backgroundColor: "#143352",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <GroupAddIcon />
                Add Team Members
              </Box>
            </Button>
          </Box>

          <Box className={styles.tabsContainer}>
            <Box className={styles.tabButtons}>
              <Button
                variant=""
                onClick={() => setActiveTab("tab1")}
                className={`${styles.tabButton} ${
                  activeTab === "tab1" ? styles.active : ""
                }`}
              >
                <Typography variant="h4" className={styles.tabHeadingTexts}>
                  Employees
                </Typography>
                <Typography variant="h4" className={styles.tabHeadingCount}>
                  {userCount}
                </Typography>
              </Button>
              <Button
                variant=""
                onClick={() => setActiveTab("tab2")}
                className={`${styles.tabButton} ${
                  activeTab === "tab2" ? styles.active : ""
                }`}
              >
                <Typography variant="h4" className={styles.tabHeadingTexts}>
                  Snapshot
                </Typography>
                <Typography variant="h4" className={styles.tabHeadingCount}>
                  {ssrows.length}
                </Typography>
              </Button>
              <Button
                variant=""
                onClick={() => setActiveTab("tab4")}
                className={`${styles.tabButton} ${
                  activeTab === "tab4" ? styles.active : ""
                }`}
              >
                <Typography variant="h4" className={styles.tabHeadingTexts}>
                  Absent
                </Typography>
                <Typography variant="h4" className={styles.tabHeadingCount}>
                  {inactiveUserCount}
                </Typography>
              </Button>
            </Box>

            <Box className={styles.tabContent}>
              {activeTab === "tab1" && (
                <EmployeeList
                  columns={columns}
                  userData={userData}
                  role={role}
                  formatTime={formatTime}
                />
              )}
              {activeTab === "tab2" && (
                <TeamSnapShot
                  sscolumns={sscolumns}
                  ssrows={ssrows}
                  role={role}
                  styletimeblock={styletimeblock}
                  getStatusColor={getStatusColor}
                />
              )}

              {activeTab === "tab4" && (
                <AbsentMembers
                  inactiveUsers={inactiveUsers}
                  columns={columns}
                  role={role}
                  formatTime={formatTime}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Stack>
      <TeamMembersForm
        openToaster={handleOpenToaster}
        refetchTeamMembers={refetchTeamMembers}
        formattedTeamOptions={formattedTeamOptions}
        ownerId={ownerId}
        open={open}
        handleClose={handleClose}
        formData={formData}
        setFormData={setFormData}
      />
      <MuiToaster
        open={toaster.open}
        message={toaster.message}
        severity={toaster.severity}
        handleClose={handleCloseToaster}
      />
    </Box>
  );
};

export default TeamMembers;