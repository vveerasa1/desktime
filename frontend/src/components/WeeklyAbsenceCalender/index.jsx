// WeeklyAbsenceCalendar.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  IconButton,
  useTheme,
} from "@mui/material";
import styles from './index.module.css'
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AbsenceCalenderModal from "./AbsenceCalenderModal";
import {
  weekDays,
  teamMembers,
  leaveTypes,
} from "../../constants/absenceCalenderData";
import { jwtDecode } from "jwt-decode";
import { useGetAllProfileQuery } from "../../redux/services/user";
export default function WeeklyAbsenceCalendar() {
  const token = localStorage.getItem('token')
  let ownerId = null
  if(token){
    let decoded = jwtDecode(token)
    ownerId =decoded?.ownerId
  } 
   const {data:getAllProfileData,isLoading} = useGetAllProfileQuery({id:ownerId}) 
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [isFullMode, setIsFullMode] = useState(false);
  const [allLeaves, setAllLeaves] = useState([...teamMembers]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const handleCellClick = (dayIdx, id) => {
    setSelectedDay(weekDays[dayIdx]);
    setSelectedMemberId(id); // track which member is clicked
    setIsFullMode(false);
    setDialogOpen(true);
  };

  const handleAddAwayTimeClick = () => {
    setSelectedDay("");
    setSelectedMemberId(null);
    setIsFullMode(true);
    setDialogOpen(true);
  };

  const handleClose = () => setDialogOpen(false);

  const handleSave = (reason, start, end) => {
    const newLeave = {
      type: "personal",
      start,
      end,
      label: reason,
      dateRange: `${weekDays[start]}–${weekDays[end]}`,
    };

    const updated = allLeaves.map((member) => {
      if (member.id === selectedMemberId || selectedMemberId === null) {
        return {
          ...member,
          leaves: [...member.leaves, newLeave],
        };
      }
      return member;
    });
    setAllLeaves(updated);
    setDialogOpen(false);
  };
  
  return (
   <Box className={styles.calendarRoot}>
      <Typography variant="h6">Absence Calendar</Typography>

      <Box className={styles.headerRow}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="All Team Members" />
          <Tab label="Team 1" />
        </Tabs>
        <Box flexGrow={1} />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddAwayTimeClick}
        >
          Add Away Time
        </Button>
      </Box>

      <Box className={styles.weekControl}>
        <Box>
          <IconButton>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography component="span" mx={1}>
            This Week
          </Typography>
          <IconButton>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>

      <Box className={styles.calendarGrid}>
        <Box />
        {weekDays.map((day, idx) => (
          <Box key={idx} className={styles.dayHeader}>
            <CalendarTodayIcon fontSize="small" />
            <Typography fontWeight={500}>{day}</Typography>
          </Box>
        ))}

        {allLeaves.map((m) => (
          <React.Fragment key={m.id}>
            <Box className={styles.memberCell}>
              <Avatar>{m.avatar}</Avatar>
              <Box>
                <Typography fontWeight={600}>{m.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {m.role}
                </Typography>
              </Box>
            </Box>
            {weekDays.map((_, d) => {
              const leave = m.leaves.find((l) => d >= l.start && d <= l.end);
              if (leave && d === leave.start) {
                return (
                  <Box
                    key={d}
                    onClick={() => handleCellClick(d, m.id)}
                    className={styles.leaveBlock}
                    style={{
                      gridColumn: `span ${leave.end - leave.start + 1}`,
                      backgroundColor: leaveTypes[leave.type] || "#e0f7fa",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {leave.dateRange}
                    </Typography>
                    <br />
                    <Typography variant="body2">{leave.label}</Typography>
                  </Box>
                );
              } else if (!leave) {
                return (
                  <Box
                    key={d}
                    onClick={() => handleCellClick(d, m.id)}
                    className={styles.emptyCell}
                  />
                );
              } else {
                return null;
              }
            })}
          </React.Fragment>
        ))}
      </Box>

      <AbsenceCalenderModal
        dialogOpen={dialogOpen}
        handleClose={handleClose}
        handleSave={handleSave}
        selectedDay={selectedDay}
        isFullMode={isFullMode}
      />
    </Box>
  );
}
