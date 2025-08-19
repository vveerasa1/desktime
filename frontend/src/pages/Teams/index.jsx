import React, { useState } from "react";
import TeamsTable from "../../components/Teams/TeamsTable";
import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import TeamModal from "../../components/Teams/TeamModal";
import {
  useGetAllTeamQuery,
  useSearchTeamQuery,
} from "../../redux/services/team";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import LoadingComponent from "../../components/ComponentLoader";
import MuiToaster from "../../components/MuiToaster";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useDebounce } from "../../hooks/useDebounce";
import SearchIcon from "@mui/icons-material/Search";
import CustomTextField from "../../components/CustomTextField";

const Teams = () => {
  const autUser =JSON.parse(localStorage.getItem("autUser"));
  let ownerId = autUser?.ownerId;
  let role = autUser?.role;
  // if (token) {
  //   let decoded = jwtDecode(token);
  //   ownerId = decoded.ownerId;
  //   role = decoded.role;
  // }
  const [selected, setSelected] = useState([]);

  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);

  // Team data queries
  const { data: teamsData, isLoading: teamDataIsLoading } =
    useGetAllTeamQuery(ownerId);
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchTeamQuery(
    {
      id: ownerId,
      searchParams: { name: debouncedSearchText },
    },
    { skip: !debouncedSearchText }
  );

  const [getTeamData, setGetTeamData] = useState([]);
  const [teamId, setTeamId] = useState();
  const [open, setOpen] = useState(false);

  // Update team data based on search or all teams
  useEffect(() => {
    // Handle search results
    if (debouncedSearchText && searchResults?.data) {
      setGetTeamData(
        Array.isArray(searchResults?.data) ? searchResults.data : []
      );
      console.log(searchResults, "SEARCH RESULT");
    }
    // Handle regular team data
    else if (teamsData?.data) {
      setGetTeamData(Array.isArray(teamsData.data) ? teamsData.data : []);
      console.log(teamsData, "TEAMS FETCH");
    }
  }, [teamsData, searchResults, debouncedSearchText]);
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
    if (id) {
      setTeamId(id);
    } else {
      setTeamId(undefined);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [toaster, setToaster] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleOpenToaster = (message, severity = "success") => {
    setToaster({ open: true, message, severity });
  };

  const handleCloseToaster = () => {
    setToaster({ ...toaster, open: false });
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Determine which loading state to show
  const isLoading =
    teamDataIsLoading || (debouncedSearchText && isSearchLoading);

  return (
    <Box sx={{ margin: "auto" }}>
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
          <Typography
            sx={{ fontSize: "23px" }}
            fontWeight={600}
            color="#333333"
          >
            Teams
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ height: 40 }}>
              <CustomTextField
                name="search"
                fullWidth
                startIcon={<SearchIcon />}
                placeholder="Search Teams"
                value={searchText}
                handleChange={(e) => handleSearchChange(e, "name")}
              />
            </Box>

            <IconButton size="small">
              <FilterListIcon fontSize="medium" />
            </IconButton>

            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                whiteSpace: "nowrap",
                px: 4,
                backgroundColor: "#143351",
              }}
              onClick={() => handleOpen()}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <GroupAddIcon />
                Add Team
              </Box>
            </Button>
          </Box>
        </Box>

        {isLoading ? (
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
