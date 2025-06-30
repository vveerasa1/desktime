// ProjectCard/index.jsx

import React from "react";
import { Paper, Box, Typography, Grid } from "@mui/material";
import { projectData } from "./ProjectData/ProjectData";
const ProjectCard = () => {
  return (
    // This Grid item is correct assuming ProjectCard is placed inside a parent Grid container
    <Grid item size={{xs:12,md:9}}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          marginBottom: "15px",
          borderRadius: "8px",
          // Removed display: "flex" from Paper directly, let Box handle content
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#333", mb: 2 }}
          >
            Projects
          </Typography>

          {/* Table Headers - MUST be a Grid container */}
          {/* Added py:0.5 for header padding based on screenshot */}
          <Grid container sx={{ borderBottom: "1px solid #eee", pb: 1, mb: 1, px: 1, py: 0.5 }}>
            {/* Headers are now correctly within a Grid container */}
            <Grid item xs={2.5}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "#999" }}
              >
                Project
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "#999" }}
              >
                Task
              </Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "#999" }}
              >
                Task Date
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "#999" }}
              >
                Time
              </Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "#999" }}
              >
                Status
              </Typography>
            </Grid>
            <Grid item xs={1.5}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, color: "#999", textAlign: "right" }}
              >
                Total Hours
              </Typography>
            </Grid>
          </Grid>

          {/* Project List */}
          {/* Added maxHeight for scroll based on screenshot. Adjust as needed. */}
          <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
            {projectData.map((item) => (
              // Each row is a Grid container
              <Grid
                container
                key={item.id}
                sx={{
                  py: 1.5,
                  px: 1,
                  borderBottom: "1px solid #f5f5f5",
                  position: "relative", // For the left bar
                  "&:last-child": { borderBottom: "none" },
                  alignItems: 'center', // Vertically align items in the row
                }}
              >
                {/* Left Colored Bar */}
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px", // Width of the bar
                    backgroundColor: item.barColor,
                    borderRadius: "2px", // Rounded corners for the bar
                  }}
                />

                {/* Content Columns - Directly children of the Grid container row */}
                {/* Ensure xs values match header xs values for alignment */}
                <Grid item xs={2.5} sx={{ pl: 1 }}> {/* Add left padding to content */}
                  <Typography
                    variant="body2"
                    sx={{ color: "#333", fontWeight: 500 }}
                  >
                    {item.project}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    {item.task}
                  </Typography>
                </Grid>
                <Grid item xs={1.5}>
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    {item.taskDate}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: item.status === "In-Progress" ? "#FFA500" : "#555",
                    }}
                  >
                    {item.time}
                  </Typography>
                </Grid>
                <Grid item xs={1.5}>
                  <Typography
                    variant="body2"
                    sx={{ color: item.statusColor, fontWeight: 500 }}
                  >
                    {item.status}
                  </Typography>
                </Grid>
                <Grid item xs={1.5}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#333",
                      fontWeight: 500,
                      textAlign: "right",
                    }}
                  >
                    {item.totalHours}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default ProjectCard;