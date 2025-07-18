import React, { useState } from "react";
import TeamsTable from "../../components/Teams/TeamsTable";
import { Box, Button, Stack, Typography, IconButton } from "@mui/material";

import CustomSearchInput from "../../components/CustomSearchInput";
import FilterListIcon from "@mui/icons-material/FilterList";
import TeamModal from "../../components/Teams/TeamModal";
import { useGetAllTeamQuery } from "../../redux/services/team";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import LoadingComponent from "../../components/ComponentLoader";
import MuiToaster from "../../components/MuiToaster";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
const Teams = () => {
  const token = localStorage.getItem("token");
  let ownerId = null;
  let role = null;
  if (token) {
    let decoded = jwtDecode(token);
    ownerId = decoded.ownerId;
    role = decoded.role;
  }
  const [selected, setSelected] = useState([]);

  const { data: teamsData, isLoading: teamDataIsLoading } =
    useGetAllTeamQuery(ownerId);
  const [getTeamData, setGetTeamData] = useState([]);
  const [teamId, setTeamId] = useState();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (teamsData?.data) {
      setGetTeamData(teamsData.data);
    }
  }, [teamsData]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = getTeamData.map((row) => row._id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [
        ...selected.slice(0, selectedIndex),
        ...selected.slice(selectedIndex + 1),
      ];
    }

    setSelected(newSelected);
  };

  const handleOpen = (id) => {
    setOpen(true);
    setTeamId(id);
    console.log(teamId);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [toaster, setToaster] = useState({
    open: false,
    message: "",
    severity: "success", // or "error"
  });

  const handleOpenToaster = (message, severity = "success") => {
    setToaster({ open: true, message, severity });
  };

  const handleCloseToaster = () => {
    setToaster({ ...toaster, open: false });
  };
  return (
    <Box sx={{ p: 2, margin: "auto" }}>
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap", 
            mb: 2, 
          }}
        >
          {/* Left-aligned Title */}
          <Typography variant="h5" component="h1" fontWeight="bold">
            Teams
          </Typography>

          {/* Right-aligned controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CustomSearchInput />

            <IconButton size="small">
              <FilterListIcon fontSize="medium" />
            </IconButton>
            
            <Button
              variant="contained"
              sx={{ textTransform: "none",whiteSpace:"nowrap",px:4, backgroundColor:"#1564bf"}}
              onClick={handleOpen}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                     <GroupAddIcon   />
                Add Team
                </Box>
               
            </Button>
          </Box>
        </Box>

        {/* Header */}

        {/* Search and Sort Controls */}

        {/* Table */}
        {teamDataIsLoading ? (
          <LoadingComponent />
        ) : (
          <TeamsTable
            openToaster={handleOpenToaster}
            getTeamData={getTeamData}
            selected={selected}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            setTeamId={setTeamId}
            handleOpen={handleOpen}
            teamId={teamId}
          />
        )}

        <TeamModal
          teamId={teamId}
          openToaster={handleOpenToaster}
          ownerId={ownerId}
          open={open}
          handleClose={handleClose}
        />
        <MuiToaster
          open={toaster.open}
          message={toaster.message}
          severity={toaster.severity}
          handleClose={handleCloseToaster}
        />
      </Stack>
    </Box>
  );
};

export default Teams;
