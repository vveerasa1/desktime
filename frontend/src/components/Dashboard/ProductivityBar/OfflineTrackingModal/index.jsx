import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Slider,
  IconButton,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './index.module.css'
// Helper to format minutes back to HH:MM
const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const OfflineTrackingModal = ({ open, handleClose, timeSlotStart, timeSlotEnd,timeToMinutes }) => {
  // State for form fields
  const [description, setDescription] = useState('');
  const [projectName, setProjectName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [productivity, setProductivity] = useState('productive'); // Default to productive


  return (
   <Modal open={open} onClose={handleClose}>
  <Paper className={styles.modalPaper}>
    <Box className={styles.modalHeader}>
      <Typography className={styles.modalTitle} variant="h6">
        Offline time
      </Typography>
      <IconButton onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </Box>

    <Typography className={styles.descriptionText} variant="body2">
      Adjust, specify or delete the whole tracked time period or parts of it.
    </Typography>

    <Box className={styles.timePeriodBox}>
      <Typography className={styles.timePeriodLabel} variant="subtitle2">Time Period</Typography>
      <Box className={styles.timeRange}>
        <Typography variant="body1">
          {minutesToTime(timeRange[0])} - {minutesToTime(timeRange[1])}
        </Typography>
      </Box>
      <Slider
        value={timeRange}
        onChange={handleSliderChange}
        valueLabelDisplay="off"
        min={timeToMinutes("00:00")}
        max={timeToMinutes("23:59")}
        step={5}
        className={`${styles.greenThumb} ${styles.greenTrack} ${styles.greenRail}`}
      />
    </Box>

    <TextField
      label="Description"
      variant="outlined"
      fullWidth
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />
    
    <Box className={styles.inputGroup}>
      <TextField
        label="Project name"
        variant="outlined"
        fullWidth
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <TextField
        label="Task name"
        variant="outlined"
        fullWidth
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
    </Box>

    <Typography variant="subtitle2">Productivity</Typography>
    <RadioGroup
      row
      value={productivity}
      onChange={(e) => setProductivity(e.target.value)}
      className={styles.radioGroup}
    >
      <FormControlLabel
        value="productive"
        control={<Radio sx={{ '&.Mui-checked': { color: '#4caf50 !important' } }} />}
        label="Productive"
      />
      <FormControlLabel
        value="unproductive"
        control={<Radio sx={{ '&.Mui-checked': { color: '#ff7a00 !important' } }} />}
        label="Unproductive"
      />
      <FormControlLabel
        value="neutral"
        control={<Radio sx={{ '&.Mui-checked': { color: '#9e9e9e !important' } }} />}
        label="Neutral"
      />
    </RadioGroup>

    <Box className={styles.actions}>
      <Button variant="outlined" onClick={handleClose}>Close</Button>
      <Button
        variant="contained"
        onClick={handleSave}
        sx={{
          bgcolor: '#4caf50 !important',
          '&:hover': { bgcolor: '#45a049 !important' },
          borderRadius: '8px !important',
        }}
      >
        Save
      </Button>
    </Box>
  </Paper>
</Modal>

  );
};

export default OfflineTrackingModal;