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
  HelpOutline
} from '@mui/icons-material';
import CustomCalendar from '../../CustomCalender';
import dayjs from 'dayjs';

export default function DeskTimeHeader({setFilters}) {
  const currentDate = new Date()
  const trackDate = new Date()
  const formattedTrackDate = dayjs(trackDate).format("YYYY-MM-DD")
  const formattedCurrentDate = dayjs(currentDate).format('ddd MMM DD YYYY')
  const [view, setView] = useState('day');
  const [date, setDate] = useState();
  const [dateTracking,setDateTracking] = useState(formattedTrackDate)
  const[activeDate,setActiveDate] = useState("")
  const handleViewChange = (_, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  const handleChange = (newDate,name) =>{
    const formattedDate = dayjs(newDate).format("YYYY-MM-DD")
    setActiveDate(dayjs(newDate).format('ddd MMM DD YYYY'));
    setDateTracking(dayjs(newDate).format("YYYY-MM-DD"))
    setDate((prev)=>{
      return {...prev, [name]:formattedDate}
    })
    setFilters((prev)=>({
      ...prev,
      type:view,
      date:formattedDate
    }))
  }
console.log(dateTracking,"DATE TRACKING")
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
              value={val===""?currentDate:val}
              onClick={()=>{
                setFilters({
                  viewMode:val,
                  date:dateTracking
                })
              }}
              sx={{
                textTransform: 'capitalize',
                fontWeight: 500,
                color: view === val ? '#ffffff !important' : '#333333',
                backgroundColor: view === val ? '#143351 !important' : '#ffffff',
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

        {/* Date and Calendar */}
        <Box display="flex" alignItems="center" gap={1}>
          <CustomCalendar selectedDate={date?.date} name="date" onChange={(newDate)=>{
            handleChange(newDate,"date")
          }} fontSize="small" sx={{ color: '#666666' }} />
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
      </Box>
    </Box>
  );
}
