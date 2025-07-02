import { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import dayjs from 'dayjs';

import CustomCalendar from '../../CustomCalender';
import styles from './index.module.css';

const DeskTimeHeader = ({ setFilters }) => {
  const currentDate = useMemo(() => new Date(), []);
  const formattedTrackDate = useMemo(() => dayjs(currentDate).format("YYYY-MM-DD"), [currentDate]);
  const formattedCurrentDate = useMemo(() => dayjs(currentDate).format('ddd MMM DD YYYY'), [currentDate]);

  const [view, setView] = useState('day');
  const [date, setDate] = useState({ date: formattedTrackDate });
  const [dateTracking, setDateTracking] = useState(formattedTrackDate);
  const [activeDate, setActiveDate] = useState(formattedCurrentDate);

  const handleViewChange = useCallback((_, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  }, []);

  const handleChange = useCallback((newDate, name) => {
    const formattedDate = dayjs(newDate).format("YYYY-MM-DD");
    setActiveDate(dayjs(newDate).format('ddd MMM DD YYYY'));
    setDateTracking(formattedDate);
    setDate(prev => ({ ...prev, [name]: formattedDate }));

    setFilters(prev => ({
      ...prev,
      type: view,
      date: formattedDate,
    }));
  }, [setFilters, view]);

  const viewModes = useMemo(() => ['day', 'week', 'month'], []);

  return (
    <Box className={styles.headerContainer}>
      <Typography variant="h6" className={styles.title}>
        My DeskTime
      </Typography>

      <Box className={styles.controls}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          size="small"
        >
          {viewModes.map((val) => (
            <ToggleButton
              key={val}
              value={val}
              onClick={() => {
                setFilters({ viewMode: val, date: dateTracking });
              }}
              className={`${styles.toggleButton} ${view === val ? styles.active : ''}`}
            >
              {val}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Box className={styles.datePicker}>
          <CustomCalendar
            selectedDate={date?.date}
            name="date"
            onChange={(newDate) => handleChange(newDate, "date")}
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
