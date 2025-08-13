import { Box, IconButton, Button, Paper, Typography } from "@mui/material";
import CustomTextField from "../../components/CustomTextField";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useEffect, useState } from "react";
import {
  useGetAllProfileQuery,
  useGetSingleProfileQuery,
} from "../../redux/services/user";
import { useNavigate } from "react-router-dom";
import ColleaguesList from "../../components/Colleagues/ColleaguesList";
import SearchIcon from "@mui/icons-material/Search";
import { jwtDecode } from "jwt-decode";
import AddEmployeeModal from "../../components/Colleagues/AddEmployeeModal";
import styles from "./index.module.css";
import MuiToaster from "../../components/MuiToaster";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

const Colleagues = () => {
  // Get user info from token
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
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [open, setOpen] = useState(false);

  // Main query with search functionality
  const { 
    data: profileData, 
    isLoading, 
    refetch: refetchProfiles 
  } = useGetAllProfileQuery(
    { 
      id: ownerId,
      search: searchText 
    }, 
    { skip: !ownerId }
  );

  // Current user profile
  const { data: currentUserProfile } = useGetSingleProfileQuery(
    userId,
    { skip: !userId }
  );

  // Colleagues data state
  const [colleaguesData, setColleaguesData] = useState({
    users: [],
    activeCount: 0,
    inactiveCount: 0,
  });

  // Update colleagues data when profile data changes
  useEffect(() => {
    if (profileData?.data) {
      setColleaguesData({
        users: profileData.data.users,
        activeCount: profileData.data.activeCount,
        inactiveCount: profileData.data.inactiveCount,
      });
    }
  }, [profileData]);

  // Toaster state and handlers
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

  // Search handler with debounce
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchText(value);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debounce
    setSearchTimeout(
      setTimeout(() => {
        refetchProfiles();
      }, 500) // 500ms debounce delay
    );
  };

  // Modal handlers
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box className={styles.pageContainer}>
        {/* Page Header */}
        <Typography sx={{ fontSize: "23px" }} fontWeight={600} color="#333333">
          Colleagues
        </Typography>

        {/* Search and Action Bar */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box className={styles.searchActions}>
            {/* Search Input */}
            <Box>
              <CustomTextField
                name="search"
                fullWidth
                startIcon={<SearchIcon />}
                placeholder="Search colleagues..."
                value={searchText}
                handleChange={handleSearch}
              />
            </Box>
            
            {/* Filter Button */}
            <Box>
              <IconButton size="small" className={styles.iconBtn}>
                <FilterListIcon
                  sx={{ borderRadius: "none !important" }}
                  fontSize="medium"
                />
              </IconButton>
            </Box>
          </Box>

          {/* Add Employee Button (Admin only) */}
          <Box className={styles.actionButtons}>
            {role === "Admin" && (
              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  backgroundColor: "#143351",
                }}
                onClick={handleOpen}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <GroupAddIcon />
                  Add Employee
                </Box>
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
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

        {/* Add Employee Modal */}
        <AddEmployeeModal
          openToaster={handleOpenToaster}
          open={open}
          handleClose={handleClose}
          refetchProfiles={refetchProfiles}
        />

        {/* Toaster Notification */}
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