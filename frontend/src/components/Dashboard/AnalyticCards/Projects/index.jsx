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
import TaskForm from "./TaskForm";
import styles from "./index.module.css";
import contract from "../../../../assets/images/gray-pen.png";
const ProjectCard = ({
  userId,
  ownerId,
  errors,
  setErrors,
  taskFormData,
  setTaskFormData,
  formattedProfile,
  mappedProjectOptions,
  handleCloseToaster,
  handleOpenToaster,
  mappedTaskData,
  handleBlur,
  handleSelect,
  handleChange,
  openTask,
  onTaskClose,
  handleTaskOpen,
  tableHeaders,
}) => {
  const renderedHeader = useMemo(
    () => (
      <TableHead>
        <TableRow
        >
          {tableHeaders.map((header, index) => (
            <TableCell
              key={index}
              className={styles.headerCell}
              style={{
            background: "rgba(244, 240, 240, 0.87)",

                paddingLeft:
                  header.title === "Project" || header.title === "Task"
                    ? 10
                    : 8,
                padding: "5px 0px",
              }}
            >
              {header.title}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    ),
    [tableHeaders]
  );

  const renderedRows = useMemo(() => {
    if (!mappedTaskData || mappedTaskData.length === 0) {
      return (
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={tableHeaders.length}
              align="center"
              sx={{
                borderBottom: "none !important",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: 105,
                  borderRadius: 2,
                  borderBottom: "none !important", // REMOVE table row bottom border
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <img
                  src={contract}
                  alt="No tasks"
                  style={{ width: 40, height: 40 }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    width: "100%",
                    fontFamily: "sans-serif",
                    fontWeight: "600",
                  }}
                >
                  No tasks
                </Typography>
              </Box>
            </TableCell>
          </TableRow>
        </TableBody>
      );
    }
    return (
      <TableBody sx={{}}>
        {mappedTaskData.map((item) => (
          <TableRow
            key={item._id}
            sx={{
              height: "40px", // sets the outer height, but not enough alone
              "& td": {
                paddingTop: "4px",
                paddingBottom: "4px",
              },
            }}
          >
            <TableCell
              className={styles.bodyCell}
              // className={`${styles.bodyCell} ${styles.bodyCell}`}
              sx={{
                position: "relative",
                padding: "8px 8px 8px 24px",
                minWidth: "200px",
                // "&::before": {
                //   content: '""',
                //   position: "absolute",
                //   left: "12px",
                //   top: "50%",
                //   transform: "translateY(-50%)",
                //   width: "5px",
                //   height: "40px",
                //   backgroundColor: item.barColor,
                //   // borderRadius: "3px", // Increased from 2px to make it more curved
                // },
                borderLeft: "6px solid green !important",
                borderRadius: "12px 0px 0px 12px !important",
              }}
            >
              <Typography variant="body2" noWrap>
                {item.task_name}
              </Typography>
            </TableCell>
            <TableCell
              className={styles.bodyCell}
              sx={{ padding: "0px !important", minWidth: "150px" }}
            >
              <Typography variant="body2" noWrap>
                {item.project}
              </Typography>
            </TableCell>
            <TableCell
              className={styles.bodyCell}
              sx={{ padding: "18px", minWidth: "120px" }}
            >
              <Typography variant="body2" noWrap>
                {item.assignee}
              </Typography>
            </TableCell>
            <TableCell
              className={styles.bodyCell}
              sx={{ padding: "8px", minWidth: "100px" }}
            >
              <Typography variant="body2">{item.status}</Typography>
            </TableCell>
            <TableCell
              className={styles.bodyCell}
              sx={{
                padding: "8px",
                minWidth: "120px",
                color:
                  item.status === "In-Progress"
                    ? theme.palette.warning.main
                    : "inherit",
              }}
            >
              <Typography variant="body2">{item.created_by}</Typography>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }, [mappedTaskData, tableHeaders]);

  return (
    <Grid item xs={12} md={9} className={styles.container}>
      <Paper elevation={3} className={styles.card}>
        <Box className={styles.content}>
          <Box className={styles.header}>
            <Typography variant="" mt={2} className={styles.headingText}>
              Projects
            </Typography>
            <Button
              className={styles.addButton}
              onClick={() => handleTaskOpen()}
            >
              Add Task <ControlPointIcon className={styles.icon} />
            </Button>
          </Box>

          <TaskForm
            errors={errors}
            userId={userId}
            ownerId={ownerId}
            setErrors={setErrors}
            handleChange={handleChange}
            handleCloseToaster={handleCloseToaster}
            handleBlur={handleBlur}
            formData={taskFormData}
            setFormData={setTaskFormData}
            open={openTask}
            onClose={onTaskClose}
            openToaster={handleOpenToaster}
            formattedProfile={formattedProfile}
            handleSelect={handleSelect}
            mappedProjectOptions={mappedProjectOptions}
          />

          <TableContainer className={styles.tableContainer}>
            <Table
            stickyHeader
              aria-label="project table"
              sx={{
                borderSpacing: "0 8px", // vertical horizontal spacing
                borderCollapse: "separate", // required for border-spacing to work
              }}
            >
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
