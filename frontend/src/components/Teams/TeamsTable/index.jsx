import React, { useState } from "react";
import {
  Box,
  // Checkbox, // Keep commented as per original
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Popover,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useDeleteTeamMutation } from "../../../redux/services/team";
import contract from "../../../assets/images/gray-pen.png"; // Import the image

const TeamsTable = ({
  getTeamData = [], // Ensure it defaults to an empty array
  selected,
  onSelectAll, // Not used, consider removing if no checkbox functionality
  onSelectOne, // Not used, consider removing if no checkbox functionality
  handleOpen,
  openToaster,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteTeamId, setDeleteTeamId] = useState(null);
  const [deleteTeam] = useDeleteTeamMutation();
  const [loading, setLoading] = useState(false); // Consider if this state is actually used for UI loading indicators

  const handleDeleteClick = (event, teamId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setDeleteTeamId(teamId);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setDeleteTeamId(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteTeamId) {
      try {
        setLoading(true); // Set loading true when starting delete
        await deleteTeam(deleteTeamId).unwrap();
        openToaster("Team Deleted Successfully!", "success");
      } catch (error) {
        const errorMessage =
          error?.data?.error || "Failed to delete team. Please try again.";
        openToaster(errorMessage, "error");
        console.error("Failed to delete team:", error);
      } finally {
        setLoading(false); // Set loading false after delete attempt
      }
    }
    handleClosePopover();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {getTeamData.length === 0 ? (
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
            No teams added yet.
          </Typography>
          <Typography variant="body1">
            Start by creating a new team.
          </Typography>
        </Paper>
      ) : (
        <Paper
          sx={{
            border: "1px solid #e0e0e0",
            boxShadow: "none",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {/* Commented out checkbox column header */}
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        selected.length > 0 && selected.length < getTeamData.length
                      }
                      checked={
                        getTeamData.length > 0 &&
                        selected.length === getTeamData.length
                      }
                      onChange={onSelectAll}
                      inputProps={{ "aria-label": "select all teams" }}
                    />
                  </TableCell> */}
                  <TableCell align="left" sx={{ fontWeight: "bold" }}>
                    Name
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Team members
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Created
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {getTeamData?.map((row) => {
                  const isItemSelected = selected.indexOf(row._id) !== -1;
                  return (
                    <TableRow

                      hover
                      // Removed onClick handler for selection since checkboxes are commented out
                      key={row._id}
                      sx={{ cursor: "pointer" }}

                    >
                      {/* Commented out checkbox cell for each row */}
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": `team-table-checkbox-${row._id}`,
                          }}
                        />
                      </TableCell> */}
                      <TableCell style={{ width: "400px" }} align="left">{row.name}</TableCell>
                      <TableCell style={{ width: "400px" }} align="center">{row.teamMembersCount}</TableCell>
                      <TableCell style={{ width: "400px" }} align="center">
                        {new Date(row.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell style={{ width: "0px" }} align="center">
                        <Box display="flex" justifyContent="center" gap={0}>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!loading) { // Prevent interaction while loading (deleting)
                                handleOpen(row._id);
                              }
                            }}
                          >
                            <EditIcon sx={{ color: "#143351" }} color="primary" />
                          </IconButton>

                          <IconButton
                            onClick={(e) => handleDeleteClick(e, row._id)}
                            disabled={loading} // Disable delete button while loading
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
        </Paper>
      )}


      {/* Delete confirmation popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 2, maxWidth: 200 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Are you sure you want to delete this team?
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button size="small" onClick={handleClosePopover}>
              Cancel
            </Button>
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={handleConfirmDelete}
              disabled={loading} // Disable confirm button while loading
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default TeamsTable;