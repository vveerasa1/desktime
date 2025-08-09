import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Popover,
  Button,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useDeleteProjectMutation } from "../../../redux/services/projects";
import contract from "../../../assets/images/gray-pen.png";

const ProjectTable = ({
  data = [],
  columns = [],
  selected,
  handleProjectSelectOne,
  handleProjectSelectAll,
  onDelete,
  handleOpen,
  openToaster,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteProject] = useDeleteProjectMutation();

  const handleDeleteClick = (event, id) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setDeleteId(id);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteProject(deleteId).unwrap();
        openToaster("Project Deleted Successfully!", "success");
        if (onDelete) onDelete(deleteId);
      } catch (err) {
        console.error("Delete failed", err);
        openToaster("Failed to delete project.", "error");
      }
    }
    handleClosePopover();
  };

  const openPopover = Boolean(anchorEl);

  return (
    <>
      {data.length === 0 ? (
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "250px",
            p: 3,
            textAlign: "center",
            color: "#666",
            border: "1px solid #e0e0e0",
            boxShadow: "none",
          }}
        >
          <img
            src={contract}
            alt="No data icon"
            style={{
              width: "80px",
              height: "80px",
              marginBottom: "16px",
              opacity: 0.6,
            }}
          />
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            No projects added yet.
          </Typography>
          <Typography variant="body1">
            Start by creating a new project.
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ border: "1px solid #e0e0e0", boxShadow: "none" }}
        >
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col}
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      width: `calc(100% / ${columns.length + 1})`
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: `calc(100% / ${columns.length + 1})`
                  }}
                >
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
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    {columns.map((col) => {
                      const dataKey = col.toLowerCase().replace(/ /g, "_");
                      return (
                        <TableCell
                          key={col}
                          sx={{
                            width: `calc(100% / ${columns.length + 1})`,
                            textAlign: "center",
                          }}
                        >
                          <Box>{row[dataKey]}</Box>
                        </TableCell>
                      );
                    })}
                    <TableCell
                      sx={{
                        textAlign: "center",
                        width: `calc(100% / ${columns.length + 1})`,
                      }}
                    >
                      <Box display="flex" justifyContent="center" gap={0.5}>
                        <IconButton
                          aria-label="edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpen(row._id);
                          }}
                        >
                          <EditIcon sx={{ color: "#143351" }} />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={(e) => handleDeleteClick(e, row._id)}
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

      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box p={2} textAlign="center">
          <Typography>Are you sure you want to delete?</Typography>
          <Box mt={2} display="flex" justifyContent="center" gap={1}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClosePopover}
            >
              No
            </Button>
            <Button variant="contained" color="error" onClick={confirmDelete}>
              Yes
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default ProjectTable;