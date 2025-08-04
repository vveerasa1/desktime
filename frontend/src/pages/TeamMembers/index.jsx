import React, { useState } from "react";
import styles from "../../pages/TeamMembers/index.module.css";
import { Box, Button, Stack, Typography, IconButton, Grid } from "@mui/material";
import CustomSearchInput from "../../components/CustomSearchInput";
import FilterListIcon from "@mui/icons-material/FilterList";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { Link } from "react-router-dom";
import { useGetAllProfileQuery } from "../../redux/services/user";
import { jwtDecode } from "jwt-decode";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
} from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import exampleProductivityData from "../../../../example-productivity-bar-data";
import ProductivityBar from "../../components/Dashboard/ProductivityBar";
import TeamMembersForm from "../../components/TeamMembers/TeamMembersForm";


const rows = [
  { name: "Aakash C", dept: "Edumpus - QA" },
  { name: "Aarif", dept: "IT" },
  { name: "Akash Poovan", dept: "IT Pentabay" },
  { name: "Avinesh", dept: "IT Pentabay" },
];

const columns = [
  "Name",
  //   "Status",
  "Productive time",
  "Offline time",
  "DeskTime",
  "Arrived at",
  "Left at",
  //   "At work",
  //   "Active app",
  //   "Active project",
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
      "inactive", "neutral", "active", "inactive", "neutral", "active",
      ...Array(156).fill("off") // total 168
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
      "inactive", "inactive", "active", "active", "active",
      ...Array(153).fill("off")
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
      "inactive", "neutral", "neutral", "active", "inactive",
      ...Array(155).fill("off")
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
      "inactive", "active", "neutral", "active", "active",
      ...Array(157).fill("off")
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
}
// snopshot end

const TeamMembers = () => {
  const token = localStorage.getItem("token");
  let ownerId = null;

  if (token) {
    const decoded = jwtDecode(token);
    ownerId = decoded.ownerId;
  }

  const { data: getAllProfileData, isLoading } = useGetAllProfileQuery({
    id: ownerId,
  });
  const userData = getAllProfileData?.data?.users;
  const userCount = userData?.length || 0
  const [activeTab, setActiveTab] = useState("tab1");
  const [open,setOpen] = useState()
  const handleOpen = () =>{
        setOpen(true)
  }
  const handleClose = () =>{
        setOpen(false)

  }
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

                onClick={()=> handleOpen()}
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
                className={`${styles.tabButton} ${activeTab === "tab1" ? styles.active : ""
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
                className={`${styles.tabButton} ${activeTab === "tab2" ? styles.active : ""
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
                onClick={() => setActiveTab("tab3")}
                className={`${styles.tabButton} ${activeTab === "tab3" ? styles.active : ""
                  }`}
              >
                <Typography variant="h4" className={styles.tabHeadingTexts}>
                  Slacking
                </Typography>
                <Typography variant="h4" className={styles.tabHeadingCount}>
                  0
                </Typography>
              </Button>
              <Button
                variant=""
                onClick={() => setActiveTab("tab4")}
                className={`${styles.tabButton} ${activeTab === "tab4" ? styles.active : ""
                  }`}
              >
                <Typography variant="h4" className={styles.tabHeadingTexts}>
                  Absent
                </Typography>
                <Typography variant="h4" className={styles.tabHeadingCount}>
                  34
                </Typography>
              </Button>
              <Button
                variant=""
                onClick={() => setActiveTab("tab5")}
                className={`${styles.tabButton} ${activeTab === "tab5" ? styles.active : ""
                  }`}
              >
                <Typography variant="h4" className={styles.tabHeadingTexts}>
                  Late
                </Typography>
                <Typography variant="h4" className={styles.tabHeadingCount}>
                  0
                </Typography>
              </Button>
            </Box>

            <Box className={styles.tabContent}>
              {activeTab === "tab1" && (
                <TableContainer
                  className={styles.tabContentWrapper}
                  component={Paper}
                >
                  <Table className={styles.teamTable}>
                    <TableHead className={styles.tHead}>
                      <TableRow className={styles.tHeadRow}>
                        {columns.map((col, index) => (
                          <TableCell className={styles.tHeadSell} key={index}>
                            {col}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userData?.map((row, idx) => (
                        <TableRow
                          key={idx}
                          className={styles.tBodyRow}
                          sx={{
                            backgroundColor:
                              idx % 2 === 0 ? "#f4f4f4" : "#ffffff",
                          }}
                        >
                          <TableCell className={styles.tBodyCell}>
                            <Box className={styles.tPersonInfo}>
                              <Box>
                                <Avatar
                                  alt="User Profile"
                                  src={row.photo}
                                  className={styles.avatarImage}
                                />
                              </Box>
                              <Box>
                                <Link className={styles.tPersonName} to="/">
                                  {row.username}
                                </Link>
                                <Typography className={styles.tPersonDept}>
                                  {row.role}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          {/* Empty cells to match "-" look */}
                          {[...Array(columns.length - 1)].map((_, i) => (
                            <TableCell className={styles.tBodyCell} key={i}>
                              -
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {activeTab === "tab2" && (
                <>
                  <TableContainer className={styles.tabContentWrapper} component={Paper}>
                    <Table className={styles.teamTable}>
                      <TableHead className={styles.tHead}>
                        <TableRow className={styles.tHeadRow}>
                          {sscolumns.map((col, index) => (
                            <TableCell key={index} className={styles.tHeadSell}>
                              {col === "Timeline" ? (
                                <Box>
                                  <Box className={styles.timelineLabelsRow}>
                                    {["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM"].map((label, i) => (
                                      <Typography key={i} variant="caption" className={styles.timelineLabel}>
                                        {label}
                                      </Typography>
                                    ))}
                                  </Box>
                                </Box>
                              ) : (
                                col
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {ssrows.map((row, idx) => (
                          <TableRow
                            key={idx}
                            className={styles.tBodyRow}
                            sx={{
                              backgroundColor:
                                idx % 2 === 0 ? "#f8f8f8" : "#ffffff",
                            }}
                          >
                            {/* Name & Avatar */}
                            <TableCell className={styles.tBodyCell}>
                              <Box className={styles.tPersonInfo}>
                                <Box position="relative">
                                  <Avatar className={styles.avatarImage}>{row.initials}</Avatar>
                                </Box>
                                <Box>
                                  <Link className={styles.tPersonName} to="/">
                                    {row.name}
                                  </Link>
                                  <Typography className={styles.tPersonDept}>
                                    {row.role}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>

                            {/* Timeline */}
                            <TableCell className={styles.tBodyCell}>
                              <Box className={styles.timelineBar}>
                                {[
                                  ...(row.timeline || []),
                                  ...Array(Math.max(0, 168 - (row.timeline?.length || 0))).fill("off"),
                                ]
                                  .slice(0, 168)
                                  .map((block, i) => {
                                    const totalMinutes = 8 * 60 + i * 5; // Start from 8:00 AM
                                    const hour = Math.floor(totalMinutes / 60);
                                    const minute = totalMinutes % 60;
                                    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
                                    const ampm = hour < 12 ? "AM" : "PM";
                                    const timeLabel = `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;

                                    const statusLabel = block.charAt(0).toUpperCase() + block.slice(1); // Capitalize

                                    return (
                                      <Tooltip key={i} title={`${statusLabel} at ${timeLabel}`} arrow>
                                        <Box
                                          sx={{
                                            ...styletimeblock.timelineBlock,
                                            width: `${100 / 168}%`,
                                            background:
                                              block === "off"
                                                ? getStatusColor(block)
                                                : undefined,
                                            backgroundColor:
                                              block !== "off"
                                                ? getStatusColor(block)
                                                : undefined,
                                          }}
                                        />
                                      </Tooltip>
                                    );
                                  })}
                              </Box>
                            </TableCell>

                            {/* Total Time */}
                            <TableCell className={styles.tBodyCell}>{row.totalTime}</TableCell>

                            {/* Avg Activity */}
                            <TableCell className={styles.tBodyCell}>
                              <Typography
                                sx={{
                                  fontSize: '14px',
                                  color: parseInt(row.avgActivity) > 70 ? "#2ecc71" :
                                    parseInt(row.avgActivity) > 40 ? "#f39c12" : "#e74c3c",
                                }}
                              >
                                {row.avgActivity}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}

              {activeTab === "tab3" && (
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
              {activeTab === "tab4" && (
                <Box className={styles.tabContentWrapper}>
                  {/* <Box className={styles.noMenbersBox}>
                    <Typography variant="h3">
                      No team members are currently working
                    </Typography>
                    <Typography variant="body2">
                      To see all team members, clear the filters and switch to
                      the Employees tab.
                    </Typography>
                  </Box> */}
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2, marginTop: "10px" }}>
                    {["Akash", "avinesh", "Ashraf"]?.map((name, index) => (
                      <Box>
                        <ProductivityBar key={index} getProductiviyData={exampleProductivityData} isSnap={true} title={name}/>
                      </Box>
                    ))}
                  </Box>
                </Box>
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
      <TeamMembersForm open={open} handleClose={handleClose}/>
    </Box>
  );
};

export default TeamMembers;
