// File: DateTimePickerComponent.jsx
import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import styles from './index.module.css'
export default function DateTimePickerComponent() {
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className={styles.container}>
        <DateTimePicker
          label="Select Date & Time"
          value={selectedDateTime}
          onChange={(newValue) => setSelectedDateTime(newValue)}
          renderInput={(params) => <TextField fullWidth {...params} />}
        />
      </Box>
    </LocalizationProvider>
  );
}
