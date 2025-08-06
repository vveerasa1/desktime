import React, { useMemo, useState } from "react";
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
import Tooltip from "@mui/material/Tooltip";
import TeamMembersForm from "../../components/TeamMembers/TeamMembersForm";
import { useGetAllTeamQuery } from "../../redux/services/team";
import MuiToaster from "../../components/MuiToaster";
import AbsentMembers from "../../components/TeamMembers/AbsentMembers";
import TeamSnapShot from "../../components/TeamMembers/TeamSnapShots";
import EmployeeList from "../../components/TeamMembers/EmployeeList";
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

const ssrows = [
  {
    name: "Savannah Nguyen",
    role: "Admin",
    initials: "SN",
    status: "online",
    timeline: [
      ...Array(6).fill("off"),
      "inactive",
      "neutral",
      "active",
      "inactive",
      "neutral",
      "active",
      ...Array(156).fill("off"),
    ],
    totalTime: "5h 20m",
    avgActivity: "39%",
  },
  {
    name: "Cody Fisher",
    role: "Admin",
    initials: "CF",
    status: "online",
    timeline: [
      ...Array(10).fill("off"),
      "inactive",
      "inactive",
      "active",
      "active",
      "active",
      ...Array(153).fill("off"),
    ],
    totalTime: "3h 21m",
    avgActivity: "88%",
  },
  {
    name: "Guy Hawkins",
    role: "Admin",
    initials: "GH",
    status: "offline",
    timeline: [
      ...Array(8).fill("off"),
      "inactive",
      "neutral",
      "neutral",
      "active",
      "inactive",
      ...Array(155).fill("off"),
    ],
    totalTime: "2h 35m",
    avgActivity: "25%",
  },
  {
    name: "Ronald Richards",
    role: "Admin",
    initials: "RR",
    status: "offline",
    timeline: [
      ...Array(6).fill("off"),
      "inactive",
      "active",
      "neutral",
      "active",
      "active",
      ...Array(157).fill("off"),
    ],
    totalTime: "7h 55m",
    avgActivity: "75%",
  },
];

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
  } = useGetAllTeamMembersQuery({ id: ownerId }, { skip: skipQuery });

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

  console.log(inactiveUsers, "IN ACTIVE");
  const [activeTab, setActiveTab] = useState("tab1");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
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
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3}>
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
            <CustomSearchInput />

            <IconButton size="small">
              <FilterListIcon fontSize="medium" />
            </IconButton>

            <Button
              onClick={handleOpen}
              variant="contained"
              sx={{
                textTransform: "none",
                whiteSpace: "nowrap",
                px: 1,
                backgroundColor: "#143352",
                width: "100%",
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
              {/* <Button
                variant=""
                onClick={() => setActiveTab("tab3")}
                className={`${styles.tabButton} ${
                  activeTab === "tab3" ? styles.active : ""
                }`}
              >
                <Typography variant="h4" className={styles.tabHeadingTexts}>
                  Slacking
                </Typography>
                <Typography variant="h4" className={styles.tabHeadingCount}>
                  0
                </Typography>
              </Button> */}
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
              {/* <Button
                variant=""
                onClick={() => setActiveTab("tab5")}
                className={`${styles.tabButton} ${
                  activeTab === "tab5" ? styles.active : ""
                }`}
              >
                <Typography variant="h4" className={styles.tabHeadingTexts}>
                  Late
                </Typography>
                <Typography variant="h4" className={styles.tabHeadingCount}>
                  0
                </Typography>
              </Button> */}
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

              {/* {activeTab === "tab3" && (
                <Box className={styles.tabContentWrapper}>
                  <Box className={styles.noMenbersBox}>
                    <Typography variant="h3">
                      No team members are currently working
                    </Typography>
                    <Typography variant="body2">
                      To see all team members, clear the filters and switch to
                      the Employees tab.
                    </Typography>
                  </Box>
                </Box>
              )} */}

              {activeTab === "tab4" && (
                <AbsentMembers
                  inactiveUsers={inactiveUsers}
                  columns={columns}
                  role={role}
                  formatTime={formatTime}
                />
              )}
              {activeTab === "tab5" && (
                <Box className={styles.tabContentWrapper}>
                  <Box className={styles.noMenbersBox}>
                    <Typography variant="h3">
                      No team members are currently working
                    </Typography>
                    <Typography variant="body2">
                      To see all team members, clear the filters and switch to
                      the Employees tab.
                    </Typography>
                  </Box>
                </Box>
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
      />
      <MuiToaster
        open={toaster.open}
        message={toaster.message}
        severity={toaster.severity}
        handleClose={handleCloseToaster}
      />{" "}
    </Box>
  );
};

export default TeamMembers;
