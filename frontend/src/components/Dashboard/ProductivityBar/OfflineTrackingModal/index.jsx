import { useState, useEffect } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./index.module.css";
import CustomTextField from "../../../CustomTextField"; // Assuming this path is correct
import { useCreateOfflineRequestMutation } from "../../../../redux/services/dashboard";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import moment from "moment-timezone"
import dayjs from "dayjs";

// Helper to format minutes back to HH:MM
const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

// Helper to convert HH:MM to minutes
const timeToMinutes = (timeString) => {
  if (!timeString || typeof timeString !== "string") return 0;
  const parts = timeString.split(":");
  if (parts.length !== 2) return 0; // Invalid format
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return 0; // Invalid time
  }
  return hours * 60 + minutes;
};

const OfflineTrackingModal = ({
  open,
  handleClose,
  timeSlotStart,
  timeSlotEnd,
  openToaster
}) => {
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date") || dayjs().format("YYYY-MM-DD");
  const [productivity, setProductivity] = useState("productive");
  const [timeRange, setTimeRange] = useState([0, 0]);
  const [startTimeText, setStartTimeText] = useState("00:00");
  const [endTimeText, setEndTimeText] = useState("00:00");
  const [errors, setErrors] = useState({});
  const [createOfflineRequest, { isLoading, isSuccess, isError, error }] = useCreateOfflineRequestMutation();
  console.log(date)
  const [formData, setFormData] = useState({
    description: "",
    projectName: "",
    taskName: "",
    startTime: "",
    endTime: ""
  })
  const handleChange = (event, name) => {
    const { value } = event.target
    setFormData((prev) => ({
      ...prev, [name]: value
    }))
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  }

  const handleBlur = (event, name) => {
    if (formData[name].trim() === "") {
      setErrors({
        ...errors,
        [name]: `${[name]} is required.`,
      });
    }
  };
  // useEffect(() => {
  //   if (open) { // Only run when the modal is opened
  //     const now = new Date();
  //     const currentMinutes = now.getHours() * 60 + now.getMinutes();

  //     let startMinutes = 0;
  //     let endMinutes = 0;

  //     if (timeSlotStart && timeSlotEnd) {
  //       startMinutes = timeToMinutes(timeSlotStart);
  //       endMinutes = timeToMinutes(timeSlotEnd);
  //     } else {
  //       // Default to a reasonable range around current time if no slot provided
  //       startMinutes = Math.max(0, currentMinutes - 30);
  //       endMinutes = Math.min(23 * 60 + 59, currentMinutes + 30);
  //     }

  //     setTimeRange([startMinutes, endMinutes]);
  //     setStartTimeText(minutesToTime(startMinutes));
  //     setEndTimeText(minutesToTime(endMinutes));

  //     // Reset specific formData fields and productivity when modal opens for a new entry
  //     // This ensures previous input values aren't carried over unless intended by timeSlotStart/End
  //     setFormData(prev => ({
  //       ...prev,
  //       description: "", // Clear description for new entry
  //       projectName: "", // Clear project name for new entry
  //       taskName: "",    // Clear task name for new entry
  //       // Initialize startTime and endTime in formData with the calculated defaults
  //       startTime: minutesToTime(startMinutes),
  //       endTime: minutesToTime(endMinutes),
  //       errors: { // Also clear previous errors
  //         description: "",
  //         projectName: "",
  //         taskName: "",
  //       }
  //     }));
  //     setProductivity("productive"); // Reset productivity
  //   }
  // }, [open, timeSlotStart, timeSlotEnd, setFormData]);
useEffect(() => {
  if (open) {
    let startMinutes, endMinutes;

    // This is the key part. It checks if timeSlotStart and timeSlotEnd
    // were passed as props.
    if (timeSlotStart && timeSlotEnd) {
      startMinutes = timeToMinutes(timeSlotStart);
      endMinutes = timeToMinutes(timeSlotEnd);
    } else {
      // This is the fallback if no time slot was passed.
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      startMinutes = Math.max(0, currentMinutes - 30);
      endMinutes = Math.min(23 * 60 + 59, currentMinutes + 30);
    }

    // Set the state of the slider and text fields using the
    // startMinutes and endMinutes.
    setTimeRange([startMinutes, endMinutes]);
    const newStartTimeText = minutesToTime(startMinutes);
    const newEndTimeText = minutesToTime(endMinutes);
    setStartTimeText(newStartTimeText);
    setEndTimeText(newEndTimeText);

    // Also update the form data state.
    setFormData(prev => ({
      ...prev,
      description: "",
      projectName: "",
      taskName: "",
      startTime: newStartTimeText,
      endTime: newEndTimeText,
      errors: {
        description: "",
        projectName: "",
        taskName: "",
      }
    }));
    setProductivity("productive");
  }
}, [open, timeSlotStart, timeSlotEnd]);
  const handleSliderChange = (event, newValue) => {
    setTimeRange(newValue);
    const newStartTime = minutesToTime(newValue[0]);
    const newEndTime = minutesToTime(newValue[1]);
    setStartTimeText(newStartTime);
    setEndTimeText(newEndTime);
    setFormData(prev => ({
      ...prev,
      startTime: newStartTime,
      endTime: newEndTime
    }));
  };

  const handleStartTimeChange = (e) => {
    const newTime = e.target.value;
    setStartTimeText(newTime);
    const newStartMinutes = timeToMinutes(newTime);
    if (newStartMinutes <= timeRange[1]) {
      setTimeRange([newStartMinutes, timeRange[1]]);
      setFormData(prev => ({
        ...prev,
        startTime: newTime
      }));
    }
  };

  const handleEndTimeChange = (e) => {
    const newTime = e.target.value;
    setEndTimeText(newTime);
    const newEndMinutes = timeToMinutes(newTime);
    if (newEndMinutes >= timeRange[0]) {
      setTimeRange([timeRange[0], newEndMinutes]);
      setFormData(prev => ({
        ...prev,
        endTime: newTime
      }));
    }
  };

  const handleSave = async () => {
    try{
const finalStartMinutes = timeToMinutes(startTimeText);
    const finalEndMinutes = timeToMinutes(endTimeText);

    if (finalStartMinutes >= finalEndMinutes) {
      alert("Start time must be before end time.");
      return;
    }

    let formHasErrors = false;
    const currentErrors = { ...errors }; // Get current errors from parent's state

    // Validate description
    if (!formData.description.trim()) {
      currentErrors.description = "Description is required";
      formHasErrors = true;
    } else if (!/^[A-Za-z\s]+$/.test(formData.description.trim())) {
      currentErrors.description = "Only letters and spaces are allowed.";
      formHasErrors = true;
    } else {
      currentErrors.description = ""; // Clear error if valid
    }

    // Validate project name

    // Validate task name

    // Update parent's errors state
    setFormData((prev) => ({ ...prev, errors: currentErrors }));

    if (formHasErrors) {
      return; // Stop save if there are validation errors
    }
    console.log(formData)
    // If all validations pass
    const offlineData = {
      description: formData.description,
      projectName: formData.projectName,
      taskName: formData.taskName,
      productivity,
      startTime: minutesToTime(finalStartMinutes),
      endTime: minutesToTime(finalEndMinutes),
    };
      const timeZone = 'Asia/Kolkata'; // or any timezone you work in
const fullStart = moment.tz(`${date} ${formData.startTime}`, 'YYYY-MM-DD HH:mm', timeZone).utc().toDate();
const fullEnd = moment.tz(`${date} ${formData.endTime}`, 'YYYY-MM-DD HH:mm', timeZone).utc().toDate();



    const payload = {
      userId: formData.userId,
      startTime: formData.startTime,
      endTime: formData.endTime,
      description: formData.description,
      projectName: formData.projectName,
      date:date,
      taskName: formData.taskName,
      productivity: productivity
    };
  
    await createOfflineRequest(payload).unwrap();
    openToaster("Offline Request Created")
    console.log("Saving offline data:", offlineData);
    // In a real application, you would send this 'offlineData' to an API or update global state.
    handleClose(); // Close the modal after successful save
    }catch (error) {
    const errorMsg = error?.data?.message || "Something went wrong.";
    openToaster(errorMsg, "error");
  }
    
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ minWidth: "600px" }} className={styles.modalPaper}>
        {/* MODAL HEADER */}
        <Box
          className={styles.modalHeader}
          sx={{
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#143351", // Keep the specific header color
            color: "white",
            borderRadius: "15px 15px 0px 0px"
          }}
        >
          <Typography color="white" p={2} mt={1} className={styles.modalTitle} fontWeight={600} variant="h6">
            Offline time
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box p={3}> {/* Apply padding to the main content area */}

          <Typography
            className={styles.descriptionText}
            variant="body2"
            sx={{ mb: 2, textAlign: "center" }}
          >
            Adjust, specify or delete the whole tracked time period or parts of
            it.
          </Typography>

          {/* TIME PERIOD SECTION */}
          <Box className={styles.timePeriodBox} sx={{ mb: 3 }}>
            <Box className={styles.timeInputGroup}>
              <TextField
                variant="outlined"
                size="small"
                value={startTimeText}
                onChange={handleStartTimeChange}
                sx={{ width: "70px", mr: 1 }}
                inputProps={{ pattern: "[0-2][0-9]:[0-5][0-9]" }}
              />
              <Typography variant="body1" sx={{ mx: 1 }}>
                {" "}
                -{" "}
              </Typography>
              <TextField
                variant="outlined"
                size="small"
                value={endTimeText}
                onChange={handleEndTimeChange}
                sx={{ width: "70px" }}
                inputProps={{ pattern: "[0-2][0-9]:[0-5][0-9]" }}
              />
            </Box>
            <Slider
              value={timeRange}
              onChange={handleSliderChange}
              valueLabelDisplay="off"
              min={0}
              max={1439}
              step={5}
              sx={{
                mt: 1,
                color: "#143351", // Thumb color
                "& .MuiSlider-track": {
                  backgroundColor: "#143351", // Active track color
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "grey", // Inactive track color
                  height: "8px"
                },
              }}
            />
          </Box>
          <Box mt={-2}>
            <CustomTextField
              label="Description"
              name="description"
              value={formData.description}
              handleChange={(e) => {
                handleChange(e, "description");
              }}
              handleBlur={(e) => handleBlur(e, "description")}
              placeholder="Enter Description"
              isRequired
              error={!!errors.description}
              helperText={errors.description}
            />
          </Box>

          <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
            <Box mt={3} width="100%">
              <CustomTextField
                label="Project Name"
                name="projectName"
                value={formData.projectName}
                handleChange={(e) => {
                  handleChange(e, "projectName");
                }}
                // handleBlur={(e) => handleBlur(e, "projectName")}
                placeholder="Enter project name"
                isRequired
                error={!!errors.projectName}
                helperText={errors.projectName}
              />
            </Box>
            <Box mt={3} width="100%">
              <CustomTextField
                label="Task Name"
                name="taskName"
                value={formData.taskName}
                handleChange={(e) => {
                  handleChange(e, "taskName");
                }}
                // handleBlur={(e) => handleBlur(e, "taskName")}
                placeholder="Enter Task Name"
                isRequired
                error={!!errors.taskName}
                helperText={errors.taskName}
              />
            </Box>
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Productivity
          </Typography>
          <RadioGroup
            row
            value={productivity}
            onChange={(e) => setProductivity(e.target.value)}
            className={styles.radioGroup}
            sx={{ mb: 3 }}
          >
            <FormControlLabel
              value="Productive"
              control={
                <Radio
                  sx={{ "&.Mui-checked": { color: "#4caf50 !important" } }}
                />
              }
              label="Productive"
            />
            <FormControlLabel
              value="Unproductive"
              control={
                <Radio
                  sx={{ "&.Mui-checked": { color: "#ff7a00 !important" } }}
                />
              }
              label="Unproductive"
            />
            <FormControlLabel
              value="Neutral"
              control={
                <Radio
                  sx={{ "&.Mui-checked": { color: "#9e9e9e !important" } }}
                />
              }
              label="Neutral"
            />
          </RadioGroup>

          <Box className={styles.actions}>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                borderColor: "#ccc",
                color: "#666",
                "&:hover": {
                  borderColor: "#999",
                  backgroundColor: "#f0f0f0",
                },
              }}
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                borderColor: "#143351",
                color: "#143351",
                "&:hover": {
                  backgroundColor: "#143351",
                  color: "white",
                },
              }}
              onClick={handleSave}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default OfflineTrackingModal;