import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  CalendarToday,
  HelpOutline
} from '@mui/icons-material';

export default function DeskTimeHeader() {
  const [view, setView] = useState('day');

  const handleViewChange = (_, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    //   px={4}
      py={2}
      sx={{
        // backgroundColor: '#eeeeee', // light gray
        // borderBottom: '1px solid #dddddd'
        marginBottom: '10px', // adjust the 
      }}
    >
      <Typography variant="h6" fontWeight={600} color="#333333">
        My DeskTime
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        {/* Date and Calendar */}
        <Box display="flex" alignItems="center" gap={1}>
          <Typography color="#333333">{currentDate}</Typography>
          <CalendarToday fontSize="small" sx={{ color: '#666666' }} />
        </Box>

        {/* Arrows */}
        <Box>
          <IconButton>
            <ChevronLeft sx={{ color: '#666666' }} />
          </IconButton>
          <IconButton>
            <ChevronRight sx={{ color: '#666666' }} />
          </IconButton>
        </Box>

        {/* View Toggle */}
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          size="small"
        >
          {['day', 'week', 'month'].map((val) => (
            <ToggleButton
              key={val}
              value={val}
              sx={{
                textTransform: 'capitalize',
                fontWeight: 500,
                color: view === val ? '#ffffff !important' : '#333333',
                backgroundColor: view === val ? '#4ea819 !important' : '#ffffff',
                // border: '1px solid #cccccc',
                '&:hover': {
                  backgroundColor: view === val ? '#4ea819' : '#f5f5f5'
                }
              }}
            >
              {val}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* Help Icon */}
        <Tooltip title="Help">
          <IconButton>
            <HelpOutline sx={{ color: '#666666' }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
