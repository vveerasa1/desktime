import React, { useState, useMemo } from "react";
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
  useTheme,
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
  const theme = useTheme();

  // column width distribution (adjust if you want different layout)
  const colWidths = ["20%", "20%", "20%", "20%", "20%"];

  const renderedHeader = useMemo(
    () => (
      <TableHead>
        <TableRow>
          {tableHeaders.map((header, index) => (
            <TableCell
              key={index}
              className={`${styles.headerCell} ${
                index === 0 ? styles.firstHeaderCell : ""
              } ${index === 4 ? styles.lastHeaderCell : ""}`}
              sx={{
                width: colWidths[index],
                fontWeight: 600,
                background: "#143351",
                color: "#fff",
                padding: "8px 12px",
                whiteSpace: "nowrap",
              }}
            >
              {header.title}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    ),
    [tableHeaders] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const renderedRows = useMemo(() => {
    if (!mappedTaskData || mappedTaskData.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={tableHeaders.length}
            align="center"
            sx={{
              borderBottom: "none !important",
              padding: 0,
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 105,
                borderRadius: 2,
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
                  fontWeight: 600,
                }}
              >
                No tasks
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      );
    }

    return mappedTaskData.map((item) => (
      <TableRow
        key={item._id}
        sx={{
          "& td": {
            paddingTop: "8px",
            paddingBottom: "8px",
            verticalAlign: "middle",
          },
        }}
      >
        <TableCell
          className={styles.bodyCell}
          sx={{
            width: colWidths[0],
            paddingLeft: "20px",
            borderLeft: `4px solid ${item.barColor}`,
            borderRadius: "12px 0 0 12px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <Typography variant="body2" noWrap>
            {item.task_name}
          </Typography>
        </TableCell>

        <TableCell
          className={styles.bodyCell}
          sx={{
            width: colWidths[1],
            padding: "8px 12px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <Typography variant="body2" noWrap>
            {item.project}
          </Typography>
        </TableCell>

        <TableCell
          className={styles.bodyCell}
          sx={{
            width: colWidths[2],
            padding: "8px 12px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <Typography variant="body2" noWrap>
            {item.assignee}
          </Typography>
        </TableCell>

        <TableCell
          className={styles.bodyCell}
          sx={{
            width: colWidths[3],
            padding: "8px 12px",
          }}
        >
          <Typography variant="body2">{item.status}</Typography>
        </TableCell>

        <TableCell
          className={styles.bodyCell}
          sx={{
            width: colWidths[4],
            padding: "8px 12px",
            color:
              item.status === "In-Progress"
                ? theme.palette.warning.main
                : "inherit",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <Typography variant="body2">{item.created_by}</Typography>
        </TableCell>
      </TableRow>
    ));
  }, [mappedTaskData, tableHeaders, theme]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid item size={{ xs: 12, md: 6 }}>
      <Paper elevation={3} className={styles.card}>
        <Box className={styles.content}>
          <Box className={styles.header}>
            <Typography
              sx={{ fontSize: "18px", fontWeight: 600 }}
              className={styles.headingText}
            >
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

          {/* === TableContainer with sticky header and scrollable body === */}
          <TableContainer
            className={styles.tableContainer}
            sx={{
              display: "flex",
              justifyContent: "center", // center table horizontally
            }}
          >
            <Table
              aria-label="project table"
              sx={{
                borderSpacing: "0 8px",
                borderCollapse: "separate",
                tableLayout: "auto", // let browser auto-adjust widths
                width: "100%", // use full width
              }}
            >
              {renderedHeader}
              <TableBody>{renderedRows}</TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Grid>
  );
};

export default ProjectCard;
