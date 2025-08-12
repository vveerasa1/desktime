import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom"; // ✅ React Router
import { jwtDecode } from "jwt-decode";
import CustomCalendar from "../../CustomCalender";
import styles from "./index.module.css";
import LoadingComponent from "../../ComponentLoader";
// import TrackingCard from "../AnalyticCards/Tracking";

const DeskTimeHeader = ({ setFilters, getSingleData, TrackingCard, isDashboad }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");
 

  // Get displayed user ID from the getSingleData response
  const displayedUserId = getSingleData?.data?._id;

  // Determine if we're viewing own profile or colleague's
  const isOwnProfile = loggedInUserId === displayedUserId;
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultDate = dayjs().format("YYYY-MM-DD");
  const defaultView = "day";

  // ✅ Load from URL params or fallback to defaults
  const initialFilters = {
    viewMode: searchParams.get("view") || defaultView,
    date: searchParams.get("date") || defaultDate,
  };

  const [filtersState, setFiltersState] = useState(initialFilters);

  // ✅ Sync with parent and URL
  useEffect(() => {
    setFilters(filtersState);
    setSearchParams({
      view: filtersState.viewMode,
      date: filtersState.date,
    });
  }, [filtersState, setFilters, setSearchParams]);

  const handleViewChange = useCallback((_, nextView) => {
    if (nextView) {
      setFiltersState((prev) => ({ ...prev, viewMode: nextView }));
    }
  }, []);

  const handleDateChange = useCallback((newDate) => {
    const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
    setFiltersState((prev) => ({ ...prev, date: formattedDate }));
  }, []);

  const viewModes = useMemo(() => ["day", "week", "month"], []);

  const handleNextClick = () => {
    const nextDate = dayjs(filtersState.date).add(1, filtersState.viewMode);
    if (!nextDate.isAfter(dayjs(), 'day')) {
      setFiltersState((prev) => ({ ...prev, date: nextDate.format("YYYY-MM-DD") }));
    }
  };

  const handlePrevClick = () => {
    const prevDate = dayjs(filtersState.date).subtract(1, filtersState.viewMode);
    setFiltersState((prev) => ({ ...prev, date: prevDate.format("YYYY-MM-DD") }));
  };

  const isNextDisabled = dayjs(filtersState.date).isSame(dayjs(), 'day') || dayjs(filtersState.date).isAfter(dayjs(), 'day');
  
  return (
    <Box className={styles.headerContainer}>
      {loading ? (
        <Box className={styles.title}>
          <LoadingComponent />
        </Box>
      ) : (
        <Typography sx={{ fontSize: "23px" }} fontWeight={600} color="#333333">
          {isOwnProfile
            ? "My Tracking"
            : `${getSingleData?.data?.username || "User"}`}
        </Typography>
      )}

      <Box className={styles.controls}>
        
        <ToggleButtonGroup
          className={styles.toggleGroup}
          value={filtersState.viewMode}
          exclusive
          onChange={handleViewChange}
          size="small"
        >
          {viewModes.map((val) => (
            <ToggleButton
              key={val}
              value={val}
              className={`${styles.toggleButton} ${
                filtersState.viewMode === val ? styles.active : ""
              }`}
            >
              {val}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Box className={styles.datePicker}>
          <CustomCalendar
            selectedDate={filtersState.date}
            name="date"
            onChange={(newDate) => handleDateChange(newDate)}
            fontSize="small"
            maxDate={new Date()}
          />
        </Box>
        <Box className={styles.nextPrevIcons}>
          <Box
            className={styles.npIcon}
            onClick={handlePrevClick}
          >
            <ChevronLeft sx={{ cursor: "pointer" }} className={styles.icon} />
          </Box>

          <Box
            className={styles.npIcon}
            onClick={handleNextClick}
            sx={{
              "& .MuiSvgIcon-root": {
                cursor: isNextDisabled ? "not-allowed" : "pointer",
                color: isNextDisabled ? "#ccc" : "inherit"
              }
            }}
          >
            <ChevronRight sx={{ cursor: "pointer" }} className={styles.icon} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DeskTimeHeader;