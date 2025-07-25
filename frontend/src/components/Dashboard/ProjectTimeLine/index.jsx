import React from "react";
import { Box, Paper, Typography } from "@mui/material";

// Constants for colors
const COLORS = {
  ProjectA: "#4CAF50",
  ProjectB: "#2196F3",
  ProjectC: "#FF9800",
  ProjectD: "#9C27B0",
  untracked: "#fffefeff",
};

// Time slots from 08:00 to 22:00
const timeSlots = Array.from({ length: 15 }, (_, i) => {
  const hour = (8 + i).toString().padStart(2, "0");
  return `${hour}:00`;
});

// Sample project assignment by time slot
const projectData = timeSlots.map((time) => {
  let project = "untracked";
  if (time >= "09:00" && time < "12:00") project = "ProjectA";
  else if (time >= "12:00" && time < "13:00") project = "ProjectB";
  else if (time >= "16:00" && time < "18:00") project = "ProjectC";
  else if (time >= "19:00" && time < "21:00") project = "ProjectD";
  return { time, project };
});

const ProjectTimeline = () => {
  return (
    <Paper sx={{padding:2}}>

    <Box sx={{ mt: 1}}>
      <Typography  variant="" gutterBottom>
        Project Timeline — 7h 0m
      </Typography>

      <Box
        sx={{
          display: "flex",
          height: 20,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 1,
          marginTop:2
        }}
      >
        {projectData.map((slot, idx) => (
          <Box
            key={idx}
            sx={{
              flex: 1,
              backgroundColor: COLORS[slot.project],
              cursor: "pointer",
            }}
            title={`${slot.time} - ${slot.project}`}
          />
        ))}
      </Box>

      {/* Optional: time labels below the bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 1,
          fontSize: "0.75rem",
        }}
      >
        {timeSlots.map((time, i) => (
          <Box key={i} sx={{ flex: 1, textAlign: "center" }}>
            {time}
          </Box>
        ))}
      </Box>
    </Box>
    </Paper>

  );
};

export default ProjectTimeline;
