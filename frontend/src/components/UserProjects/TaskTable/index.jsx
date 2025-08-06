import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  // Checkbox, // Keep commented as per original
  IconButton,
  Box,
  Popover,
  Typography,
  Button,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useDeleteTaskMutation } from "../../../redux/services/task";
import contract from "../../../assets/images/gray-pen.png"; // Import the image

const TaskTable = ({
  data = [],
  columns = [],
  selected,
  handleSelectAll, // Not used, consider removing if no checkbox functionality
  handleSelectOne, // Not used, consider removing if no checkbox functionality
  onEdit,
  onDelete,
  handleTaskOpen,
  openToaster,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteTask] = useDeleteTaskMutation();
  const selectedCount = selected.length; // Keep if needed for potential future checkbox functionality
  const rowCount = data.length; // Keep if needed for potential future checkbox functionality

  const handleDeleteClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setDeleteTargetId(id);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setDeleteTargetId(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId) {
      try {
        await deleteTask(deleteTargetId).unwrap();
        openToaster("Task Deleted Successfully!", "success");
        onDelete?.(deleteTargetId); // optional callback to refresh or remove from UI
      } catch (err) { // Catch the error to log it
        console.error("Delete failed", err); // Log the actual error
        openToaster("Failed to delete task", "error");
      }
    }
    handleClosePopover();
  };

  return (
    <>
      {data.length === 0 ? (
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '250px', // Adjust height as needed
            p: 3,
            textAlign: 'center',
            color: '#666',
            border: "1px solid #e0e0e0",
            boxShadow: "none",
          }}
        >
          <img
            src={contract}
            alt="No data icon"
            style={{ width: '80px', height: '80px', marginBottom: '16px', opacity: 0.6 }} // Adjust size and opacity
          />
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            No tasks added yet.
          </Typography>
          <Typography variant="body1">
            Start by creating a new task.
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ border: "1px solid #e0e0e0", boxShadow: "none" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {/* Commented out checkbox column header */}
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selectedCount > 0 && selectedCount < rowCount}
                    checked={rowCount > 0 && selectedCount === rowCount}
                    onChange={handleSelectAll}
                  />
                </TableCell> */}

                {columns.map((col) => (
                  <TableCell key={col} sx={{ fontWeight: "bold" }}>
                    {col}
                  </TableCell>
                ))}

                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => {
                const isItemSelected = selected.indexOf(row._id) !== -1;
                return (
                  <TableRow
                    key={row._id}
                    hover
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    {/* Commented out checkbox cell for each row */}
                    {/* <TableCell
                      padding="checkbox"
                      onClick={(event) => handleSelectOne(event, row._id)}
                    >
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": `table-checkbox-${row._id}`,
                        }}
                      />
                    </TableCell> */}

                    {columns.map((col) => {
                      const dataKey = col.toLowerCase().replace(/ /g, "_");
                      return <TableCell style={{ width: "400px" }} key={col}>{row[dataKey]}</TableCell>;
                    })}

                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={0.5}>
                        <IconButton
                          aria-label="edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskOpen(row._id);
                          }}
                        >
                          <EditIcon color="primary" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(e, row._id);
                          }}
                        >
                          <DeleteIcon sx={{ color: "red" }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}


      {/* MUI Popover for delete confirmation */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box sx={{ p: 2, maxWidth: 250 }}>
          <Typography variant="subtitle1" gutterBottom>
            Are you sure you want to delete this task?
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <Button size="small" onClick={handleClosePopover}>
              Cancel
            </Button>
            <Button size="small" color="error" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default TaskTable;