// ProjectCard/index.jsx

import React,{useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { projectData } from "./ProjectData/ProjectData";
import TaskForm from './TaskForm'
const ProjectCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);
  const tableHeaders = [
    { title: "Project" },
    { title: "Task" },
    { title: "Task Date" },
    { title: "Time" },
    { title: "Status" },
    { title: "Total Hours" },
  ];

  return (
    <Grid item xs={12} md={9}>
      <Paper
        elevation={3}
        sx={{
          marginBottom: "15px",
          borderRadius: "8px",
        }}
      >
        <Box sx={{ p: 2.3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "#333" }}
              >
                Projects
              </Typography>
            </Box>
            <Box sx={{}}>
              <Button onClick={handleOpen} sx={{ border: "1px solid", backgroundColor: "#194CF0", color: "white", borderRadius: "12px" }}>
                Add Task <ControlPointIcon sx={{ ml: 1 }} />
              </Button>
            </Box>
          </Box>
          <TaskForm open={isModalOpen} onClose={handleClose} />
          {/* Adjust the TableContainer's sx prop */}
          <TableContainer sx={{ overflowY: "scroll", maxHeight: "175px" }}>
            {" "}
            {/* Changed to 50px */}
            <Table stickyHeader aria-label="project table">
              {/* Table Headers */}
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header, index) => (
                    <TableCell
                      key={index}
                      align={header.align} // Note: header.align is undefined in your current tableHeaders structure
                      sx={{
                        fontWeight: 600,
                        color: "#999",
                        width: header.width, // Note: header.width is undefined
                        whiteSpace: "nowrap",
                        pl: header.title === "Project" ? 3 : 1,
                        borderBottom: "none",
                      }}
                    >
                      {header.title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {/* Table Body */}
              <TableBody>
                {projectData.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      position: "relative",
                    }}
                  >
                    {/* Left Colored Bar - Integrated into the first TableCell */}
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        pl: 3,
                        py: 2,
                        color: "#333",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        position: "relative",
                        borderRadius: "11px", // This borderRadius is for the TableCell itself, not the bar
                        borderBottom: "none",

                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "5px",
                          backgroundColor: item.barColor,
                        },
                      }}
                    >
                      <Typography variant="overline">{item.project}</Typography>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        py: 1.5,
                        color: "#555",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        borderBottom: "none",
                      }}
                    >
                      {item.task}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        py: 1.5,
                        color: "#555",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        borderBottom: "none",
                      }}
                    >
                      {item.taskDate}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        py: 1.5,
                        color:
                          item.status === "In-Progress" ? "#FFA500" : "#555",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        borderBottom: "none",
                      }}
                    >
                      {item.time}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        py: 1.5,
                        color: item.statusColor,
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        borderBottom: "none",
                      }}
                    >
                      {item.status}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        py: 1.5,
                        color: "#333",
                        fontWeight: 500,
                        textAlign: "right",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        borderBottom: "none",
                      }}
                    >
                      {item.totalHours}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Grid>
  );
};

export default ProjectCard;
