import React, { useState } from "react";
import {
  Box,
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
  getTeamData = [],
  selected,
  onSelectAll,
  onSelectOne,
  handleOpen,
  openToaster,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteTeamId, setDeleteTeamId] = useState(null);
  const [deleteTeam] = useDeleteTeamMutation();
  const [loading, setLoading] = useState(false);

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
        setLoading(true);
        await deleteTeam(deleteTeamId).unwrap();
        openToaster("Team Deleted Successfully!", "success");
      } catch (error) {
        const errorMessage =
          error?.data?.error || "Failed to delete team. Please try again.";
        openToaster(errorMessage, "error");
        console.error("Failed to delete team:", error);
      } finally {
        setLoading(false);
      }
    }
    handleClosePopover();
  };

  const open = Boolean(anchorEl);
  const totalColumns = 4; // Name, Team Members, Created, Actions

  return (
    <>
      {getTeamData.length === 0 ? (
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '250px',
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
            style={{ width: '80px', height: '80px', marginBottom: '16px', opacity: 0.6 }}
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
            <Table sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      width: `calc(100% / ${totalColumns})`
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      width: `calc(100% / ${totalColumns})`
                    }}
                  >
                    Team members
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      width: `calc(100% / ${totalColumns})`
                    }}
                  >
                    Created
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      width: `calc(100% / ${totalColumns})`
                    }}
                  >
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
                      key={row._id}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell
                        sx={{
                          width: `calc(100% / ${totalColumns})`,
                          textAlign: "center"
                        }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: `calc(100% / ${totalColumns})`,
                          textAlign: "center"
                        }}
                      >
                        {row.teamMembersCount}
                      </TableCell>
                      <TableCell
                        sx={{
                          width: `calc(100% / ${totalColumns})`,
                          textAlign: "center"
                        }}
                      >
                        {new Date(row.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          width: `calc(100% / ${totalColumns})`
                        }}
                      >
                        <Box display="flex" justifyContent="center" gap={0}>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!loading) {
                                handleOpen(row._id);
                              }
                            }}
                          >
                            <EditIcon sx={{ color: "#143351" }} color="primary" />
                          </IconButton>
                          <IconButton
                            onClick={(e) => handleDeleteClick(e, row._id)}
                            disabled={loading}
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
              disabled={loading}
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