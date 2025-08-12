import { useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab, IconButton, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import OfflineTimesTable from "../../components/OfflineTimes/OfflineTimesTable";
import TimeCards from "../../components/OfflineTimes/TimeCards";
import styles from "./index.module.css";
import CustomTextField from "../../components/CustomTextField";
import { useGetAllOfflineRequestQuery } from "../../redux/services/dashboard";
import { jwtDecode } from "jwt-decode";
import LoadingComponent from "../../components/ComponentLoader";
import MuiToaster from "../../components/MuiToaster";

const offlineTimesData = [
  {
    id: 1,
    name: "Harish R",
    team: "Team Digital",
    timeRegistered: "18:17 - 18:51\nJuly 1, 2025",
    splits: 1,
    duration: "34m 50s",
    type: "Productive",
    description: "Discussion with Vipin sir",
  },
  {
    id: 2,
    name: "Harish R",
    team: "Team Digital",
    timeRegistered: "16:48 - 17:47\nJuly 1, 2025",
    splits: 4,
    duration: "28m 35s",
    type: "Productive",
    description: "discussion with subiksha",
  },
  {
    id: 3,
    name: "Harish R",
    team: "Team Digital",
    timeRegistered: "16:20 - 16:40\nJuly 1, 2025",
    splits: 1,
    duration: "19m 56s",
    type: "Productive",
    description: "Discussion with hr and rohit",
  },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`offline-tabpanel-${index}`}
      aria-labelledby={`offline-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const OfflineTimes = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState("Pending");
  const [toaster, setToaster] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [offlineData, setOfflineData] = useState([]);
  const autUser =JSON.parse(localStorage.getItem("autUser"));
  let ownerId =autUser?.ownerId|| null;
  console.log(autUser,ownerId,"ownerIdownerId")
  // if (token) {
  //   const decoded = jwtDecode(token);
  //   ownerId = decoded?.ownerId;
  // }
  const { data: getOfflineTrackingData, isLoading } =
    useGetAllOfflineRequestQuery({
      id: ownerId,
      status: status, // assuming API expects 'pending', 'approved', etc.
    });
  console.log(getOfflineTrackingData, "DATA");

  useEffect(() => {
    if (getOfflineTrackingData) {
      setOfflineData(getOfflineTrackingData.formattedRequests || []);
    }
  }, [getOfflineTrackingData]);


  const handleTabChange = (event, newValue) => {
    const tabLabels = ["Pending", "Approved", "Declined"];
    setStatus(tabLabels[newValue]);
    setSelected([]);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = offlineTimesData.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
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

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const handleOpenToaster = (message, severity = "success") => {
    setToaster({ open: true, message, severity });
  };

  const handleCloseToaster = () => {
    setToaster({ ...toaster, open: false });
  };
  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      <Box className={styles.pageContainer}>
        <Typography sx={{ fontSize: "23px" }} fontWeight={600} color="#333333">
          Offline Times
        </Typography>
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
      </Box>

      {/* <Tabs value={tabValue} onChange={handleTabChange} aria-label="offline times tabs"> */}
      <Box
        sx={{
          mt: 0,
          mb: 0,
          pl: 0,
          ml: 0,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tabs
          value={["Pending", "Approved", "Declined"].indexOf(status)}
          onChange={handleTabChange}
          aria-label="offline times tabs"
          TabIndicatorProps={{
            style: { backgroundColor: "#001F5B" }, // Navy blue indicator
          }}
          sx={{
            borderRadius: 1,
            // mb: 2,
            minHeight: 30,
            ".MuiTab-root": {
              color: "#001F5B", // navy blue text for unselected
              fontWeight: 600,
              textTransform: "none",
              minHeight: 30,
              paddingTop: 0,
              paddingBottom: 0,
            },
            ".Mui-selected": {
              color: "#f7f7f8ff !important", // navy blue text for selected
              backgroundColor: "#001F5B !important", // navy blue text for selected
              borderRadius: "6px 6px 0px 0px",
              minHeight: 40,
            },
          }}
        >
          <Tab label="Pending" />
          <Tab label="Approved" />
          <Tab label="Declined" />
        </Tabs>
        {/* <SmallTimeCards /> */}
      </Box>
      {isLoading === true ? (
        <LoadingComponent />
      ) : (
        <Box sx={{ mt: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <TimeCards
              totalOfflineTime={getOfflineTrackingData?.totalOfflineTimes}
              totalProductiveTime={getOfflineTrackingData?.productiveTime}
              totalUnProductiveTime={getOfflineTrackingData?.unproductiveTime}
              totalNeutralTime={getOfflineTrackingData?.neutralTime}
            />
          </Grid>
        </Box>
      )}

      <OfflineTimesTable
        status={status}
        openToaster={handleOpenToaster}
        offlineData={offlineData}
      />
      <MuiToaster
        open={toaster.open}
        message={toaster.message}
        severity={toaster.severity}
        handleClose={handleCloseToaster}
      />
    </Box>
  );
};

export default OfflineTimes;
