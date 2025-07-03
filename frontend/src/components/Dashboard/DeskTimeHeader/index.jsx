import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom'; // ✅ React Router

import CustomCalendar from '../../CustomCalender';
import styles from './index.module.css';

const DeskTimeHeader = ({ setFilters }) => {
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

  const viewModes = useMemo(() => ['day', 'week', 'month'], []);

  return (
    <Box className={styles.headerContainer}>
      <Typography variant="h6" className={styles.title}>
        My DeskTime
      </Typography>

      <Box className={styles.controls}>
        <ToggleButtonGroup
          value={filtersState.viewMode}
          exclusive
          onChange={handleViewChange}
          size="small"
        >
          {viewModes.map((val) => (
            <ToggleButton
              key={val}
              value={val}
              className={`${styles.toggleButton} ${filtersState.viewMode === val ? styles.active : ''}`}
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

        <Box className={styles.arrowButtons}>
          <IconButton>
            <ChevronLeft className={styles.icon} />
          </IconButton>
          <IconButton>
            <ChevronRight className={styles.icon} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default DeskTimeHeader;
