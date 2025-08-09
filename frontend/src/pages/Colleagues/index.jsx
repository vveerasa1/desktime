import { Box, IconButton, Button, Paper, Typography } from "@mui/material";

import CustomTextField from "../../components/CustomTextField";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useEffect, useState } from "react";
import {
  useGetAllProfileQuery,
  useGetSingleProfileQuery,
  useSearchProfileQuery,
} from "../../redux/services/user";
import { useNavigate } from "react-router-dom";
import ColleaguesList from "../../components/Colleagues/ColleaguesList";
import SearchIcon from "@mui/icons-material/Search";
import { jwtDecode } from "jwt-decode";
import AddEmployeeModal from "../../components/Colleagues/AddEmployeeModal";
import styles from "./index.module.css";
import MuiToaster from "../../components/MuiToaster";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useDebounce } from "../../hooks/useDebounce";
const Colleagues = () => {
  const token = localStorage.getItem("token");
  let userId = null;
  let role = null;
  let ownerId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded?.userId || decoded?.sub;
      role = decoded?.role;
      ownerId = decoded?.ownerId;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500); // Debounce the search input
  const [open, setOpen] = useState(false);
  const { data: getProfile, isLoading } = useGetAllProfileQuery({
    id: ownerId,
  });
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useSearchProfileQuery(
    {
      id: ownerId,
      searchParams: { username: debouncedSearchText }, // <-- pass as `searchParams`
    },
    { skip: !debouncedSearchText }
  );
  const [colleaguesData, setColleaguesData] = useState({
    users: [],
    activeCount: 0,
    inactiveCount: 0,
  });

  const { data: currentUserProfile, isError } = useGetSingleProfileQuery(
    userId,
    {
      skip: !userId,
    }
  );

  useEffect(() => {
    if (debouncedSearchText && searchResults?.data) {
      setColleaguesData({
        users: searchResults.data.users,
        activeCount: searchResults.data.activeCount,
        inactiveCount: searchResults.data.inactiveCount,
      });
    } else if (getProfile?.data) {
      setColleaguesData({
        users: getProfile.data.users,
        activeCount: getProfile.data.activeCount,
        inactiveCount: getProfile.data.inactiveCount,
      });
    }
  }, [getProfile, searchResults, debouncedSearchText]);

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
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box className={styles.pageContainer}>
        <Typography sx={{ fontSize: "23px" }} fontWeight={600} color="#333333">
          Colleagues
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box className={styles.searchActions}>
            <Box>
              <CustomTextField
                name="search"
                fullWidth
                startIcon={<SearchIcon />}
                placeholder="Search"
                value={searchText}
                handleChange={handleSearch}
              />
            </Box>
            <Box>
              <IconButton size="small" className={styles.iconBtn}>
                <FilterListIcon
                  sx={{
                    borderRadius: "none !important",
                  }}
                  fontSize="medium"
                />
              </IconButton>
            </Box>
          </Box>
          <Box className={styles.actionButtons}>
            {role === "Admin" ? (
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  backgroundColor: "#143351",
                }}
                onClick={() => handleOpen()}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <GroupAddIcon />
                  Add Employee
                </Box>
              </Button>
            ) : (
              ""
            )}
          </Box>
        </Box>
      </Box>

      <Box className={styles.colleaguesWrapper}>
        <Paper className={styles.paperWrapper}>
          <ColleaguesList
            navigate={navigate}
            colleaguesData={colleaguesData}
            isLoading={isLoading}
            handleOpen={handleOpen}
            handleClose={handleClose}
            setOpen={setOpen}
            openToaster={handleOpenToaster}
          />
        </Paper>
        <AddEmployeeModal
          openToaster={handleOpenToaster}
          open={open}
          handleClose={handleClose}
        />
        <MuiToaster
          open={toaster.open}
          message={toaster.message}
          severity={toaster.severity}
          handleClose={handleCloseToaster}
        />
      </Box>
    </>
  );
};

export default Colleagues;
