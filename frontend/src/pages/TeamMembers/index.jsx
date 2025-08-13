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
import CustomSearchInput from "../../components/CustomSearchInput";
import FilterListIcon from "@mui/icons-material/FilterList";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { Link } from "react-router-dom";
import { useGetAllTeamMembersQuery } from "../../redux/services/teamMembers";
import { jwtDecode } from "jwt-decode";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
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

// snapshot data
const sscolumns = ["Name", "Timeline", "Total Time", "Avg Activity"];

// const ssrows = [
//   {
//     name: "Savannah Nguyen",
//     role: "Admin",
//     initials: "SN",
//     status: "online",
//     timeline: [
//       ...Array(6).fill("off"),
//       "inactive",
//       "neutral",
//       "active",
//       "inactive",
//       "neutral",
//       "active",
//       ...Array(156).fill("off"),
//     ],
//     totalTime: "5h 20m",
//     avgActivity: "39%",
//   },
//   {
//     name: "Cody Fisher",
//     role: "Admin",
//     initials: "CF",
//     status: "online",
//     timeline: [
//       ...Array(10).fill("off"),
//       "inactive",
//       "inactive",
//       "active",
//       "active",
//       "active",
//       ...Array(153).fill("off"),
//     ],
//     totalTime: "3h 21m",
//     avgActivity: "88%",
//   },
//   {
//     name: "Guy Hawkins",
//     role: "Admin",
//     initials: "GH",
//     status: "offline",
//     timeline: [
//       ...Array(8).fill("off"),
//       "inactive",
//       "neutral",
//       "neutral",
//       "active",
//       "inactive",
//       ...Array(155).fill("off"),
//     ],
//     totalTime: "2h 35m",
//     avgActivity: "25%",
//   },
//   {
//     name: "Ronald Richards",
//     role: "Admin",
//     initials: "RR",
//     status: "offline",
//     timeline: [
//       ...Array(6).fill("off"),
//       "inactive",
//       "active",
//       "neutral",
//       "active",
//       "active",
//       ...Array(157).fill("off"),
//     ],
//     totalTime: "7h 55m",
//     avgActivity: "75%",
//   },
// ];

// const ssrows = [
//   {
//     name: "Mohamed Ashraf",
//     role: "Owner",
//     initials: "MA",
//     status: "online",
//     timeline: [
//       ...Array(155).fill("off"), // 12:00 AM to 12:55 PM (155 intervals of 5 mins)
//       "active",   // 12:55 - 1:00 PM (100% productive)
//       "neutral",  // 1:00 - 1:03 PM (47% productive)
//       ...Array(32).fill("off"), // 1:03 - 1:35 PM
//       "neutral",  // 1:35 - 1:38 PM (60% productive)
//       "neutral",  // 1:35 - 1:38 PM (duplicate in sample data)
//       ...Array(57).fill("off"), // 1:38 - 2:31 PM
//       "active",   // 2:31 - 2:36 PM
//       "inactive", // 2:36 - 2:37 PM (20% productive)
//       "active",   // 2:37 - 2:42 PM
//       "active",   // 2:42 - 2:47 PM
//       "active",   // 2:47 - 2:52 PM
//       "active",   // 2:52 - 2:57 PM
//       "active",   // 2:57 - 3:02 PM
//       "active",   // 3:02 - 3:07 PM
//       "active",   // 3:07 - 3:12 PM
//       "active",   // 3:12 - 3:17 PM
//       "neutral",  // 3:17 - 3:20 PM (63% productive)
//       "active",   // 3:20 - 3:25 PM
//       "active",   // 3:25 - 3:30 PM
//       "active",   // 3:30 - 3:36 PM
//       ...Array(108).fill("off") // 3:36 PM - 12:00 AM
//     ],
//     totalTime: "1h 17m", // 4670 seconds = 1h17m50s (rounded)
//     avgActivity: "78%", // Average of productive percentages
//   },
//   {
//     name: "Savannah Nguyen",
//     role: "Admin",
//     initials: "SN",
//     status: "online",
//     timeline: [
//       ...Array(6).fill("off"),
//       "inactive",
//       "neutral",
//       "active",
//       "inactive",
//       "neutral",
//       "active",
//       ...Array(156).fill("off"),
//     ],
//     totalTime: "5h 20m",
//     avgActivity: "39%",
//   },
//   {
//     name: "Cody Fisher",
//     role: "Admin",
//     initials: "CF",
//     status: "online",
//     timeline: [
//       ...Array(10).fill("off"),
//       "inactive",
//       "inactive",
//       "active",
//       "active",
//       "active",
//       ...Array(153).fill("off"),
//     ],
//     totalTime: "3h 21m",
//     avgActivity: "88%",
//   },
//   {
//     name: "Guy Hawkins",
//     role: "Admin",
//     initials: "GH",
//     status: "offline",
//     timeline: [
//       ...Array(8).fill("off"),
//       "inactive",
//       "neutral",
//       "neutral",
//       "active",
//       "inactive",
//       ...Array(155).fill("off"),
//     ],
//     totalTime: "2h 35m",
//     avgActivity: "25%",
//   },
//   {
//     name: "Ronald Richards",
//     role: "Admin",
//     initials: "RR",
//     status: "offline",
//     timeline: [
//       ...Array(6).fill("off"),
//       "inactive",
//       "active",
//       "neutral",
//       "active",
//       "active",
//       ...Array(157).fill("off"),
//     ],
//     totalTime: "7h 55m",
//     avgActivity: "75%",
//   }
// ];
const getStatusColor = (status) => {
  if (status === "active") return "#aaffadff";
  if (status === "neutral") return "#ffffff";
  if (status === "inactive") return "#ffb3aaff";
  if (status === "off") {
    return "#f0f0f0";
  }
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



    const autUser = JSON.parse(localStorage.getItem("autUser"));
  let ownerId = autUser?.ownerId;
  let role = autUser?.role;

  const skipQuery = !ownerId;
  const {
    data: getAllTeamMembersData,
    isLoading: getAllTeamMembersIsLoading,
    refetch: refetchTeamMembers,
  } = useGetAllTeamMembersQuery(
    { id: ownerId, search: search, date: formattedDate },
    { skip: skipQuery }
  );

  const { data: getAllSnapShotData, isLoading: getAllSnapShotIsLoading } =
    useGetAllSnapShotQuery({ id: ownerId });
  console.log(getAllSnapShotData, "SNAP DATAA");

  const snapData = getAllSnapShotData;
  const transformApiDataToSsrows = (apiData) => {
    return apiData?.data
      .filter(
        (user) => user.username && user.session && user.session.length > 0
      )
      .map((user) => {
        // Calculate total time in hours and minutes
        const hours = Math.floor(user.totalTime / 3600);
        const minutes = Math.floor((user.totalTime % 3600) / 60);
        const totalTimeFormatted = `${
          hours > 0 ? `${hours}h ` : ""
        }${minutes}m`;

        // Calculate average productivity
        const avgProductivity = Math.round(
          user.session.reduce((sum, session) => sum + session.productive, 0) /
            user.session.length
        );

        // Generate timeline from 9:00 AM to 6:30 PM (114 slots = 9.5 hours * 12 intervals)
        const timeline = Array(114).fill("off"); // 9:00 AM to 6:30 PM in 5-min intervals

        user.session.forEach((session) => {
          const [hour, min] = session.time.split(":").map(Number);
          // Only map sessions between 9:00 AM and 6:30 PM
          if (hour >= 9 && (hour < 18 || (hour === 18 && min <= 30))) {
            const startIndex = (hour - 9) * 12 + Math.floor(min / 5);

            // Calculate duration in 5-min intervals
            const durationMatch = session.total.match(/(\d+)m (\d+)s/);
            const durationMinutes = durationMatch
              ? parseInt(durationMatch[1])
              : 0;
            const durationSeconds = durationMatch
              ? parseInt(durationMatch[2])
              : 0;
            const duration = Math.ceil(
              (durationMinutes * 60 + durationSeconds) / 300
            );

            let status;
            if (session.productive >= 80) status = "active";
            else if (session.productive >= 50) status = "neutral";
            else if (session.break > 0) status = "off";
            else status = "inactive";

            // Fill the timeline slots
            for (
              let i = 0;
              i < duration && startIndex + i < timeline.length;
              i++
            ) {
              timeline[startIndex + i] = status;
            }
          }
        });

        // Determine online status based on last activity within 30 minutes
        const now = new Date();
        const isOnline = user.session.some((session) => {
          const endTimeStr = session.timeRange.split(" - ")[1];
          const [endHour, endMin] = endTimeStr.split(":").map(Number);
          const sessionEndTime = new Date();
          sessionEndTime.setHours(endHour, endMin, 0, 0);
          return now - sessionEndTime <= 30 * 60 * 1000; // 30 minutes in milliseconds
        });

        return {
          name: user.username,
          role: user.role || "User",
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
        };
      });
  };

  // Usage with your API response:
  const ssrows = transformApiDataToSsrows(snapData);
  console.log(ssrows, "ROWSSS");
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

    // Debounce the search to avoid too many API calls
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
            {/* Left-aligned Title */}
            <Typography
              variant="h6"
              sx={{ fontSize: "23px" }}
              fontWeight={600}
              color="#333333"
            >
              Team Members
            </Typography>
            {/* Right-aligned controls */}
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

          {/* tabs */}
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
                  4
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
