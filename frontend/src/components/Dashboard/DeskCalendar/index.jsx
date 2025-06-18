import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Box, Typography } from '@mui/material';
import styles from './index.module.css';

const employeeData = {
  '2025-06-02': {
    arrival: '10:08',
    left: '19:17',
    worked: '9h 9m',
    productive: '5h 21m',
    deskTime: '7h 35m',
    status: 'normal'
  },
  '2025-06-08': { status: 'absent' },
  '2025-06-10': { status: 'working' },
  '2025-06-14': {
    arrival: '10:08',
    left: '18:44',
    worked: '6h 35m',
    productive: '4h 17m',
    deskTime: '6h 49m',
    status: 'low'
  }
};


function renderDayCell(arg) {
  const dateStr = arg.date.toISOString().split('T')[0];
  const data = employeeData[dateStr];

  let statusClass = '';
  if (data?.status === 'normal') statusClass = styles.normal;
  else if (data?.status === 'low') statusClass = styles.low;
  else if (data?.status === 'absent') statusClass = styles.absent;
  else if (data?.status === 'working') statusClass = styles.working;
 
  return (
    <Box className={`${styles.dayCell} ${statusClass}`}>
      <Box className={styles.statusBar}></Box>

      <Box
        // className={styles.dayCell}
        sx={{ marginTop: '10px' }}
      >
        <Typography className={styles.dayNumber}>{arg.dayNumberText}</Typography>

        {data?.status === 'absent' ? (
          <Typography className={styles.absentText}>Absent</Typography>
        ) : data?.status === 'working' ? (
          <Typography className={styles.workingText}>Working</Typography>
        ) : data ? (
          <Box className={styles.textAlign}>
            <Box className={styles.progressBarContainer}>
              <Box className={styles.greenBar}></Box>
              <Box className={styles.grayBar}></Box>
            </Box>
            <Typography className={styles.arrived}>Arrived at: {data.arrival}</Typography>
            <Typography className={styles.left}>Left at: {data.left}</Typography>
            <Typography className={styles.worked}>Worked for: {data.worked}</Typography>
            <Typography className={styles.text}>Productive time: {data.productive}</Typography>
            <Typography className={styles.text}>DeskTime time: {data.deskTime}</Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}


export default function EmployeeCalendar() {
  return (
    <div style={{ padding: 16 }}>
      <FullCalendar

        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        height="auto"
        dayCellContent={renderDayCell}
        contentHeight="auto"
        fixedWeekCount={false}
        dayMaxEventRows={1}
        headerToolbar={{
          start: 'title',
          end: 'prev,next',
          center: ''
        }}
        // dayCellClassNames={() => fixedStatusClass} 
        dayCellClassNames={(arg) => {
          const dateStr = arg.date.toISOString().split('T')[0];
          const data = employeeData[dateStr];

          if (data?.status === 'absent') return styles.absentClass;
          if (data?.status === 'working') return styles.workingClass;
          if (data?.status === 'normal') return styles.fixedCell;
          if (data?.status === 'low') return styles.fixedCell;
          return styles.fixedCell; // default
        }}

               />
    </div>
  );
}
