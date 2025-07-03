import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  Box,
} from "@mui/material";
import { teamMembers, weekDays } from "../../../constants/absenceCalenderData";
import CustomTextField from "../../CustomTextField";
import CustomDropDown from "../../CustomDropDown";
const AbsenceCalenderModal = ({
  dialogOpen,
  handleClose,
  handleSave,
  selectedDay,
  isFullMode = false,
}) => {
  const [formData, setFormData] = useState({
    reason: "",
    startDay: "",
    endDay: "",
  });

  const weekDaysOptions = [
    { id: "Mon", name: "Mon" },
    { id: "Tue", name: "Tue" },
    { id: "Wed", name: "Wed" },
    { id: "Thu", name: "Thu" },
    { id: "Fri", name: "Fri" },
    { id: "Sat", name: "Sat" },
    { id: "Sun", name: "Sun" },
  ];
  useEffect(() => {
    if (dialogOpen) {
      setFormData({
        reason: "",
        startDay: isFullMode ? "" : selectedDay, // if fullMode false, default to selected
        endDay: isFullMode ? "" : selectedDay,
      });
    }
  }, [dialogOpen, selectedDay, isFullMode]);

  const handleChange = (e, name) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = () => {
    const { reason, startDay, endDay } = formData;
    const start = weekDays.indexOf(startDay);
    const end = weekDays.indexOf(endDay);
    handleSave(reason, start, end);
  };

  const handleSelect = (e, name) => {
    const { value } = e.target;
    console.log(value,"VALUE")
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log(teamMembers,"TEAM MEMBERS")
  return (
    <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Away Time for {selectedDay}</DialogTitle>
      <DialogContent>
        <Box>
          <CustomDropDown
            fullWidth
            label="Member"
            name="reason"
            options={teamMembers?.name}
            selectedValue={teamMembers?.name}
            handleChange={(e) => handleChange(e, "reason")}
            margin="dense"
          />
        </Box>
        <Box>
          <CustomTextField
            fullWidth
            label="Reason"
            name="reason"
            value={formData.reason}
            handleChange={(e) => handleChange(e, "reason")}
            margin="dense"
          />
        </Box>

        {isFullMode && (
          <>
            <Box>
              <CustomDropDown
                select
                fullWidth
                label="Start Day"
                name="startDay"
                options={weekDaysOptions}
                selectedValue={formData.startDay}
                handleSelect={(e) => {
                  handleSelect(e, "startDay");
                }}
                margin="dense"
              ></CustomDropDown>
            </Box>
            <Box>
              <CustomDropDown
                select
                fullWidth
                label="End Day"
                name="endDay"
                options={weekDaysOptions}
                selectedValue={formData.endDay}
                handleSelect={(e) => {
                  handleSelect(e, "endDay");
                }}
                margin="dense"
              ></CustomDropDown>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={!formData.reason}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AbsenceCalenderModal;
