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
import { Height } from "@mui/icons-material";

const ProjectCard = ({userId,ownerId,errors,setErrors,taskFormData,setTaskFormData,  formattedProfile, mappedProjectOptions, handleCloseToaster, handleOpenToaster, mappedTaskData, handleBlur, handleSelect, handleChange, openTask, onTaskClose, handleTaskOpen , tableHeaders }) => {
  
  console.log(mappedTaskData,"TASK DATA")
  const renderedHeader = useMemo(
    () => (
      <TableHead >
        <TableRow >
          {tableHeaders.map((header, index) => (
            <TableCell
              key={index}
              className={styles.headerCell}
              style={{
                paddingLeft: header.title === "Project" ? 10 : 8,
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

  const renderedRows = useMemo(
  () => (
    <TableBody>
      {mappedTaskData?.map((item) => (
        <TableRow 
          key={item._id} 
          sx={{
            height: '48px', // Reduced from default 56px
            '&:last-child td': {
              borderBottom: 0 ,// Remove border for last row

            }
          }}
        >
          <TableCell
            sx={{
              position: 'relative',
              padding: '8px 8px 8px 24px',
               // Reduced padding
              minWidth: '200px',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '3px',
                height: '36px', // Smaller bar
                backgroundColor: item.barColor,
                borderRadius: '2px',
              }
            }}
          >
            <Typography variant="body2" noWrap>
              {item.task_name}
            </Typography>
          </TableCell>
          <TableCell sx={{ padding: '8px', minWidth: '150px' }}>
            <Typography variant="body2" noWrap>
              {item.project}
            </Typography>
          </TableCell>
          <TableCell sx={{ padding: '8px', minWidth: '120px' }}>
            <Typography variant="body2" noWrap>
              {item.assignee}
            </Typography>
          </TableCell>
          <TableCell sx={{ padding: '8px', minWidth: '100px' }}>
            <Typography variant="body2">
              {item.status}
            </Typography>
          </TableCell>
          <TableCell 
            sx={{ 
              padding: '8px',
              minWidth: '120px',
              color: item.status === "In-Progress" ? theme.palette.warning.main : 'inherit'
            }}
          >
            <Typography variant="body2">
              {item.created_by}
            </Typography>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  ),
  [mappedTaskData] // Added dependency for proper memoization
);

  return (
    <Grid item xs={12} md={9} className={styles.container}>
      <Paper elevation={3} className={styles.card}>
        <Box className={styles.content}>
          <Box className={styles.header}>
            <Typography variant="" mt={2} className={styles.headingText}>
              Projects
            </Typography>
            <Button className={styles.addButton} onClick={()=>handleTaskOpen()}>
              Add Task <ControlPointIcon className={styles.icon} />
            </Button>
          </Box>

          <TaskForm errors={errors}
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
