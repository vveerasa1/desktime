import React, { useState } from "react";
import {
  Box,
  Checkbox,
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

const TeamsTable = ({
  getTeamData,
  selected,
  onSelectAll,
  onSelectOne,
  handleOpen,
  openToaster
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteTeamId, setDeleteTeamId] = useState(null);
  const [deleteTeam] = useDeleteTeamMutation();

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
        await deleteTeam(deleteTeamId).unwrap();
        openToaster("Team Deleted Successfully!", "success");

      } catch (error) {
        console.error("Failed to delete team:", error);
      }
    }
    handleClosePopover();
  };

  const open = Boolean(anchorEl);

  return (
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
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 &&
                    selected.length < getTeamData.length
                  }
                  checked={
                    getTeamData.length > 0 &&
                    selected.length === getTeamData.length
                  }
                  onChange={onSelectAll}
                  inputProps={{ "aria-label": "select all teams" }}
                />
              </TableCell>
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
                  onClick={(event) => onSelectOne(event, row._id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row._id}
                  selected={isItemSelected}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": `team-table-checkbox-${row._id}`,
                      }}
                    />
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="center">{row.teamMembersCount}</TableCell>
                  <TableCell align="center">
                    {new Date(row.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={1}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen(row._id);
                        }}
                      >
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton
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

      {/* Delete confirmation popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
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
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Popover>
    </Paper>
  );
};

export default TeamsTable;
