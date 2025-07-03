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

const Colleagues = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const { data: getProfile, isLoading } = useGetAllProfileQuery();
  const [colleaguesData, setColleaguesData] = useState([]);

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded?.userId || decoded?.sub;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const { data: currentUserProfile, isError } = useGetSingleProfileQuery(
    userId,
    {
      skip: !userId,
    }
  );

  useEffect(() => {
    if (getProfile) {
      setColleaguesData(getProfile.data);
    }
  }, [getProfile]);

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
  return (
    <>
      <Box className={styles.pageContainer}>
        <Typography variant="h6" fontWeight={600} color="#333333">
          Colleagues
        </Typography>
        <Box className={styles.searchActions}>
          <CustomTextField
            name="password"
            fullWidth
            startIcon={<SearchIcon />}
            placeholder={"search"}
          />
          <IconButton size="small" className={styles.iconBtn}>
            <FilterListIcon fontSize="medium" />
          </IconButton>
        </Box>
      </Box>

      <Box className={styles.colleaguesWrapper}>
        <Paper className={styles.paperWrapper}>
          <Box className={styles.actionButtons}>
            <Box className={styles.statusButtons}>
              <Button variant="contained" className={styles.activeBtn}>
                ACTIVE&nbsp;
                <Box component="span" className={styles.activeCount}>
                  10
                </Box>
              </Button>
              <Button variant="contained" className={styles.inactiveBtn}>
                IN-ACTIVE&nbsp;
                <Box component="span" className={styles.inactiveCount}>
                  10
                </Box>
              </Button>
            </Box>
            <Button variant="contained" onClick={handleOpen}>
              Add Employee
            </Button>
          </Box>

          <ColleaguesList
            navigate={navigate}
            colleaguesData={colleaguesData}
            isLoading={isLoading}
            handleOpen={handleOpen}
            handleClose={handleClose}
            setOpen={setOpen}
          />
        </Paper>
        <AddEmployeeModal open={open} handleClose={handleClose} />
      </Box>
    </>
  );
};

export default Colleagues;
