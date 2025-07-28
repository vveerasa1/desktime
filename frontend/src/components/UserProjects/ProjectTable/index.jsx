import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Box,
  Popover,
  Button,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useDeleteProjectMutation } from "../../../redux/services/projects";
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
      }
    }
    handleClosePopover();
  };

  const openPopover = Boolean(anchorEl);

  console.log(selected,"SELECTED")
  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ border: "1px solid #e0e0e0", boxShadow: "none" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell  padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 &&
                    selected.length < data.length
                  }
                  checked={
                    data.length > 0 &&
                    selected.length === data.length
                  }
                  onChange={handleProjectSelectAll}
                  inputProps={{ "aria-label": "select all items" }}
                />
              </TableCell>

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
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  selected={isItemSelected}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={(event) =>
                        handleProjectSelectOne(event, row._id)
                      }
                      inputProps={{
                        "aria-labelledby": `table-checkbox-${row._id}`,
                      }}
                    />
                  </TableCell>

                  {columns.map((col) => {
                    const dataKey = col.toLowerCase().replace(/ /g, "_");
                    return <TableCell key={col}>{row[dataKey]}</TableCell>;
                  })}

                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={0.5}>
                      <IconButton
                        aria-label="edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen(row._id);
                        }}
                      >
                        <EditIcon color="primary" />
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

      {/* Delete Confirmation Popover */}
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
