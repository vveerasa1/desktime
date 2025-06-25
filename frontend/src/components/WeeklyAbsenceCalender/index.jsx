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
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AbsenceCalenderModal from "./AbsenceCalenderModal";
import { weekDays,teamMembers,leaveTypes } from "../../constants/absenceCalenderData";
export default function WeeklyAbsenceCalendar() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [isFullMode, setIsFullMode] = useState(false);
  const [allLeaves, setAllLeaves] = useState([...teamMembers]);

  const handleCellClick = (dayIdx, memberId) => {
    setSelectedDay(weekDays[dayIdx]);
    setIsFullMode(false);
    setDialogOpen(true);
  };

  const handleAddAwayTimeClick = () => {
    setSelectedDay("");
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

    const updated = [...allLeaves];
    updated[0].leaves.push(newLeave); // Add to first member for demo
    setAllLeaves(updated);
    setDialogOpen(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h6">Absence Calendar</Typography>

      <Box mt={2} display="flex" alignItems="center">
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="All Team Members" />
          <Tab label="Team 1" />
        </Tabs>
        <Box flexGrow={1} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddAwayTimeClick}>
          Add Away Time
        </Button>
      </Box>

      <Box mt={2} display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <IconButton><ArrowBackIosIcon /></IconButton>
          <Typography component="span" mx={1}>This Week</Typography>
          <IconButton><ArrowForwardIosIcon /></IconButton>
        </Box>
      </Box>

      <Box
        mt={2}
        sx={{
          display: "grid",
          gridTemplateColumns: "2fr repeat(7, 1fr)",
          gridAutoRows: "minmax(48px, auto)",
          gap: 1,
          bgcolor: "#fff",
          p: 2,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box />
        {weekDays.map((day, idx) => (
          <Box
            key={idx}
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={0.5}
          >
            <CalendarTodayIcon fontSize="small" />
            <Typography fontWeight={500}>{day}</Typography>
          </Box>
        ))}

        {allLeaves.map((m) => (
          <React.Fragment key={m.id}>
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar>{m.avatar}</Avatar>
              <Box>
                <Typography fontWeight={600}>{m.name}</Typography>
                <Typography variant="caption" color="text.secondary">{m.role}</Typography>
              </Box>
            </Box>

            {weekDays.map((_, d) => {
              const leave = m.leaves.find((l) => d >= l.start && d <= l.end);
              if (leave && d === leave.start) {
                return (
                  <Box
                    key={d}
                    gridColumn={`span ${leave.end - leave.start + 1}`}
                    sx={{
                      bgcolor: leaveTypes[leave.type] || '#e0f7fa',
                      borderRadius: 1,
                      p: 1,
                      textAlign: "center",
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
                    sx={{
                      height: "100%",
                      '&:hover': { bgcolor: "#f0f0f0", cursor: "pointer" },
                    }}
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
