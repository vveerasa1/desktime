import React, { useState } from "react";
import TeamsTable from "../../components/Teams/TeamsTable";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Add, Search as SearchIcon, Sort as SortIcon } from "@mui/icons-material";
import CustomSearchInput from "../../components/CustomSearchInput";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddTeamModal from "../../components/Teams/TeamModal";
// --- Mock Data (replace with your actual API call) ---
const teamsData = [
  { id: "t1", name: "CipherBizz Team", teamMembers: 0, created: "2023-10-14" },
  { id: "t2", name: "Edumpus", teamMembers: 0, created: "2024-06-18" },
  { id: "t3", name: "Edumpus - QA", teamMembers: 1, created: "2024-09-10" },
  { id: "t4", name: "Edumpus Portal", teamMembers: 3, created: "2024-09-10" },
  { id: "t5", name: "HR - Digispoc", teamMembers: 1, created: "2022-11-14" },
  { id: "t6", name: "IT", teamMembers: 12, created: "2016-06-30" },
  { id: "t7", name: "IT Pentabay", teamMembers: 11, created: "2021-10-05" },
  { id: "t8", name: "Management", teamMembers: 1, created: "2016-06-30" },
];

const Teams = () => {
  const [selected, setSelected] = useState([]);
    const [open,setOpen] = useState(false)
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = teamsData.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleOpen = () =>{
    setOpen(true)
  }

  const handleClose = () =>{
    setOpen(false)
  }
  const handleSelectOne = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  return (
    <Box sx={{ p: 3, margin: "auto" }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            Teams
          </Typography>
          <Button
            variant="contained"
            color="success"
            sx={{ textTransform: "none" }}
            onClick={()=>{
                handleOpen()
            }}
          >
            Add new team
          </Button>
        </Box>

        {/* Search and Sort Controls */}
        <Box py={2} display={"flex"} justifyContent={"start"} gap={3}>
          <Box>
            <CustomSearchInput />
          </Box>
          <Box>
            <IconButton size="small">
              <FilterListIcon fontSize="medium" />
            </IconButton>
          </Box>
        </Box>

        {/* Table */}
        <TeamsTable
          teams={teamsData}
          selected={selected}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
        />
        <AddTeamModal open={open} handleClose={handleClose}/>
      </Stack>
      {/* Support Button - using FAB as an example */}
      <Box sx={{ position: "fixed", bottom: 24, right: 24 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ borderRadius: "50px", p: "10px 20px" }}
        >
          Support
        </Button>
      </Box>
    </Box>
  );
};

export default Teams;
