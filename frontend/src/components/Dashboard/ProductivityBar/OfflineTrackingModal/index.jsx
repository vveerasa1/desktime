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
//   const [timeRange, setTimeRange] = useState([
//     timeToMinutes(timeSlotStart),
//     timeToMinutes(timeSlotEnd)
//   ]);

  // Update time range state when props change (e.g., new untracked segment clicked)
//   useEffect(() => {
//     if (open) {
//       // Convert HH:MM strings from props to minutes for the slider
//       setTimeRange([
//         timeToMinutes(timeSlotStart),
//         timeToMinutes(timeSlotEnd)
//       ]);
//       // Reset other form fields when modal opens for a new slot
//       setDescription('');
//       setProjectName('');
//       setTaskName('');
//       setProductivity('productive');
//     }
//   }, [open, timeSlotStart, timeSlotEnd]);

//   // Handle slider changes
//   const handleSliderChange = (event, newValue) => {
//     setTimeRange(newValue);
//   };

//   const handleSave = () => {
//     const formattedStartTime = minutesToTime(timeRange[0]);
//     const formattedEndTime = minutesToToTime(timeRange[1]);

//     console.log("Saving offline tracking data:");
//     console.log("Time Range:", `${formattedStartTime} - ${formattedEndTime}`);
//     console.log("Description:", description);
//     console.log("Project Name:", projectName);
//     console.log("Task Name:", taskName);
//     console.log("Productivity:", productivity);

//     // TODO: Integrate with your actual data update logic here
//     // For static data, you would typically dispatch an action or call a function
//     // that updates the 'productivityData' or 'sessionList' and triggers a re-render
//     // of the chart with the new data.

//     handleClose(); // Close the modal after saving
//   };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="offline-time-modal-title"
      aria-describedby="offline-time-modal-description"
    >
      <Paper
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600 }, // Responsive width
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          outline: 'none', // Remove focus outline
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="offline-time-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
            Offline time
          </Typography>
          <IconButton onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, color: '#555' }}>
          Adjust, specify or delete the whole tracked time period or parts of it.
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Time Period</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {minutesToTime(timeRange[0])} - {minutesToTime(timeRange[1])}
            </Typography>
          </Box>
          <Slider
            value={timeRange}
            onChange={handleSliderChange}
            valueLabelDisplay="off" // Or "auto" for interactive display
            min={timeToMinutes("00:00")} // Min time for the slider (midnight)
            max={timeToMinutes("23:59")} // Max time for the slider (end of day)
            step={5} // Snap to 5-minute intervals
            sx={{
                '& .MuiSlider-thumb': {
                    backgroundColor: '#4caf50', // Green thumb
                },
                '& .MuiSlider-track': {
                    backgroundColor: '#4caf50', // Green track
                },
                '& .MuiSlider-rail': {
                    backgroundColor: '#e0e0e0', // Grey rail
                },
            }}
          />
        </Box>

        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2, borderRadius: '8px' }}
        />
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Project name"
            variant="outlined"
            fullWidth
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            sx={{ flex: 1, borderRadius: '8px' }}
          />
          <TextField
            label="Task name"
            variant="outlined"
            fullWidth
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            sx={{ flex: 1, borderRadius: '8px' }}
          />
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>Productivity</Typography>
        <RadioGroup
          row
          value={productivity}
          onChange={(e) => setProductivity(e.target.value)}
          sx={{ mb: 3 }}
        >
          <FormControlLabel
            value="productive"
            control={<Radio sx={{ '&.Mui-checked': { color: '#4caf50' } }} />}
            label="Productive"
          />
          <FormControlLabel
            value="unproductive"
            control={<Radio sx={{ '&.Mui-checked': { color: '#ff7a00' } }} />}
            label="Unproductive"
          />
          <FormControlLabel
            value="neutral"
            control={<Radio sx={{ '&.Mui-checked': { color: '#9e9e9e' } }} />}
            label="Neutral"
          />
        </RadioGroup>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={handleClose} sx={{ borderRadius: '8px' }}>
            Close
          </Button>
          <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' }, borderRadius: '8px' }}>
            Save
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default OfflineTrackingModal;