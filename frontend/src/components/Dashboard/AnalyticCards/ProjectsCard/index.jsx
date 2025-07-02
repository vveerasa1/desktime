import { useState, useMemo, useCallback } from "react";
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
import { projectData } from "../constant";
import TaskForm from "./TaskForm";
import styles from "./index.module.css";

const ProjectCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const tableHeaders = useMemo(() => [
    { title: "Project" },
    { title: "Task" },
    { title: "Task Date" },
    { title: "Time" },
    { title: "Status" },
    { title: "Total Hours" },
  ], []);

  const renderedHeader = useMemo(() => (
    <TableHead>
      <TableRow>
        {tableHeaders.map((header, index) => (
          <TableCell
            key={index}
            className={styles.headerCell}
            style={{
              paddingLeft: header.title === "Project" ? 24 : 8,
            }}
          >
            {header.title}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  ), [tableHeaders]);

  const renderedRows = useMemo(() => (
    <TableBody>
      {projectData.map((item) => (
        <TableRow key={item.id} className={styles.tableRow}>
          <TableCell
            className={styles.projectCell}
            style={{
              "--bar-color": item.barColor,
            }}
          >
            <Typography variant="overline">{item.project}</Typography>
          </TableCell>
          <TableCell className={`${styles.bodyCell} ${styles.noWrap}`}>
            {item.task}
          </TableCell>
          <TableCell className={styles.bodyCell}>{item.taskDate}</TableCell>
          <TableCell
            className={`${styles.bodyCell} ${item.status === "In-Progress" ? styles.inProgress : ""}`}
          >
            {item.time}
          </TableCell>
          <TableCell
            className={styles.statusCell}
            style={{ color: item.statusColor }}
          >
            {item.status}
          </TableCell>
          <TableCell className={styles.totalHoursCell}>
            {item.totalHours}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  ), []);

  return (
    <Grid item xs={12} md={9}>
      <Paper elevation={3} className={styles.card}>
        <Box className={styles.content}>
          <Box className={styles.header}>
            <Typography variant="body1" className={styles.headingText}>
              Projects
            </Typography>
            <Button className={styles.addButton} onClick={handleOpen}>
              Add Task <ControlPointIcon className={styles.icon} />
            </Button>
          </Box>

          <TaskForm open={isModalOpen} onClose={handleClose} />

          <TableContainer className={styles.tableContainer}>
            <Table stickyHeader aria-label="project table">
              {renderedHeader}
              {renderedRows}
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Grid>
  );
};

export default ProjectCard;
