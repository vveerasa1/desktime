import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  MenuItem,
} from '@mui/material';
import { weekDays } from '../../../constants/absenceCalenderData';
const AbsenceCalenderModal = ({
  dialogOpen,
  handleClose,
  handleSave,
  selectedDay,
  isFullMode = false,
}) => {
  const [formData, setFormData] = useState({
    reason: '',
    startDay: '',
    endDay: '',
  });

  useEffect(() => {
    if (dialogOpen) {
      setFormData({
        reason: '',
        startDay: isFullMode ? '' : selectedDay, // if fullMode false, default to selected
        endDay: isFullMode ? '' : selectedDay,
      });
    }
  }, [dialogOpen, selectedDay, isFullMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = () => {
    const { reason, startDay, endDay } = formData;
    const start = weekDays.indexOf(startDay);
    const end = weekDays.indexOf(endDay);
    handleSave(reason, start, end);
  };

  return (
    <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Away Time for {selectedDay}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          margin="dense"
        />
        {isFullMode && (
          <>
            <TextField
              select
              fullWidth
              label="Start Day"
              name="startDay"
              value={formData.startDay}
              onChange={handleChange}
              margin="dense"
            >
              {weekDays.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="End Day"
              name="endDay"
              value={formData.endDay}
              onChange={handleChange}
              margin="dense"
            >
              {weekDays.map((day) => (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave} disabled={!formData.reason}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AbsenceCalenderModal;
