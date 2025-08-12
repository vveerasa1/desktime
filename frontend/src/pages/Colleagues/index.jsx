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
  const autUser = JSON.parse(localStorage.getItem("autUser"));

  const userId = localStorage.getItem("userId");
  // let userId = null;
  let role = autUser?.role || null;
  let ownerId = autUser?.ownerId || null;
  // if (token) {
  //   try {
  //     const decoded = jwtDecode(token);
  //     userId = decoded?.userId || decoded?.sub;
  //     role = decoded?.role;
  //     ownerId = decoded?.ownerId;
  //   } catch (err) {
  //     console.error("Invalid token", err);
  //   }
  // }

  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const { data: getProfile, isLoading } = useGetAllProfileQuery({
    id: ownerId,
  });
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
    if (getProfile?.data) {
      setColleaguesData({
        users: getProfile.data.users,
        activeCount: getProfile.data.activeCount,
        inactiveCount: getProfile.data.inactiveCount,
      });
    }
  }, [getProfile]);

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
  // const handleSearch = (e) => {
  //   const value = e.target.value;
  //   setSearchText(value);
  //   const result = getProfile.data.filter((item) =>
  //     item.username.toLowerCase().includes(value.toLowerCase())
  //   );
  //   setFilteredData(result);
  // };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  console.log(role, "COLLEAGURE");
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
                name="password"
                fullWidth
                startIcon={<SearchIcon />}
                placeholder={"search"}
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
