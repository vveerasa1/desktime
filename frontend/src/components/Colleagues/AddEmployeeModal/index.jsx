import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Dialog,         // Import Dialog
  DialogTitle,    // Import DialogTitle
  DialogContent,  // Import DialogContent
  DialogActions,  // Import DialogActions
} from "@mui/material";
import moment from "moment-timezone";
import { useCreateProfileMutation } from "../../../redux/services/user";
import MuiToaster from "../../../components/MuiToaster";
import EmployeeProfileDetails from "./EmployeeProfileDetails";
import EmployeeTrackingDetails from "./EmployeeTrackingDetails";

// Add open and onClose props to the component signature
const AddEmployeeModal = ({ open, handleClose }) => {
    console.log(open,"OPEN")
  const [workingDays, setWorkingDays] = useState([]);
  const [trackingDays, setTrackingDays] = useState([]);
  const [flexibleHours] = useState(false);
  // const [open, setOpen] = useState(false); // This state is no longer needed as 'open' comes from props
  const [openToaster, setOpenToaster] = useState(false);

  const [createProfileApi, { isLoading: createProfileApiIsLoading }] =
    useCreateProfileMutation();

  const timeZoneOptions = moment.tz.names().map((tz) => ({
    id: tz,
    name: tz,
  }));

  const [formData, setFormData] = useState({
    employeeId: "",
    username: "",
    email: "",
    password: "", // Password is required for creating a new user
    role: "",
    gender: "",
    phone: "",
    countryCode: "",
    team: "",
    timeZone: "",
    workStartTime: "",
    workEndTime: "",
    trackingStartTime: "",
    trackingEndTime: "",
    minimumHours: "",
    workingDays: workingDays,
    trackingDays: trackingDays,
    flexibleHours: flexibleHours,
  });

  const handleChange = (event, name) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelect = (event, name) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (phone, data) => {
    setFormData((prev) => ({
      ...prev,
      phone: phone,
      countryCode: data.dialCode,
    }));
  };

  const genderOptions = [
    {
      id: "Male",
      name: "Male",
    },
    {
      id: "Female",
      name: "Female",
    },
    {
      id: "Other",
      name: "Other",
    },
  ];

  const roleOptions = [
    { id: "Admin", name: "Admin" },
    { id: "Employee", name: "Employee" },
  ];

  const minimumHoursOptions = [
    { id: "4 Hours", name: "4 Hours" },
    { id: "6 Hours", name: "6 Hours" },
    { id: "8 Hours", name: "8 Hours" },
    { id: "10 Hours", name: "10 Hours" },
  ];

  const teamOptions = [{ id: "IT Pentabay", name: "IT Pentabay" }];

  const handleDaysChange = (days, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: days,
    }));

    if (type === "workingDays") {
      setWorkingDays(days);
    } else if (type === "trackingDays") {
      setTrackingDays(days);
    }
  };

  const dayNameMap = {
    MO: "Monday",
    TU: "Tuesday",
    WE: "Wednesday",
    TH: "Thursday",
    FR: "Friday",
    SA: "Saturday",
    SU: "Sunday",
  };
  const workingDaysFull = workingDays.map((d) => dayNameMap[d]);
  const trackingDaysFull = trackingDays.map((d) => dayNameMap[d]);

  const handleSubmit = async () => {
    try {
      const payload = {
        employeeId: formData.employeeId,
        username: formData.username,
        email: formData.email,
        password: formData.password, 
        role: formData.role,
        gender: formData.gender,
        phone: formData.phone,
        countryCode: formData.countryCode,
        team: formData.team,
        workStartTime: formData.workStartTime,
        workEndTime: formData.workEndTime,
        trackingStartTime: formData.trackingStartTime,
        trackingEndTime: formData.trackingEndTime,
        minimumHours: formData.minimumHours,
        workingDays: workingDaysFull,
        trackingDays: trackingDaysFull,
        flexibleHours: formData.flexibleHours,
        timeZone: formData.timeZone,
      };

      const response = await createProfileApi(payload).unwrap();
      setFormData({
        employeeId: "",
        username: "",
        email: "",
        password: "",
        role: "",
        gender: "",
        phone: "",
        countryCode: "",
        team: "",
        timeZone: "",
        workStartTime: "",
        workEndTime: "",
        trackingStartTime: "",
        trackingEndTime: "",
        minimumHours: "",
        workingDays: [],
        trackingDays: [],
        flexibleHours: false,
      });
      setWorkingDays([]); // Reset selected days
      setTrackingDays([]); // Reset selected days
      setOpenToaster(true); // Show toaster
      setTimeout(() => {
        setOpenToaster(false);
        handleChange(); // Close the modal after successful submission
      }, 2000); // Shorter timeout to close modal faster after toaster
    } catch (error) {
      console.error("Error submitting form:", error);
      // You might want to show an error toaster here
    }
  };

  const handleCloseToaster = (event, reason) => {
    if (reason === 'clickaway') {
      setOpenToaster(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <MuiToaster
        handleClose={() => handleCloseToaster(null, "clickaway")}
        open={openToaster}
        message={"Employee Added Successfully!"} // Updated message
        severity="success"
      />
      <DialogTitle>Add New Employee</DialogTitle>
      <DialogContent dividers> {/* `dividers` adds a border below the title */}
        <Grid  container sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Column 1: Employee Profile Details */}
          <EmployeeProfileDetails
            formData={formData}
            handleChange={handleChange}
            handleSelect={handleSelect}
            genderOptions={genderOptions}
            roleOptions={roleOptions}
            timeZoneOptions={timeZoneOptions}
            minimumHoursOptions={minimumHoursOptions}
            teamOptions={teamOptions}
            handlePhoneChange={handlePhoneChange}
          />

          {/* Column 2: Employee Tracking Details */}
          <EmployeeTrackingDetails
            formData={formData}
            handleChange={handleChange}
            handleSelect={handleSelect}
            minimumHoursOptions={minimumHoursOptions}
            timeZoneOptions={timeZoneOptions}
            workingDays={workingDays}
            trackingDays={trackingDays}
            handleDaysChange={handleDaysChange}
          />

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={createProfileApiIsLoading}
        >
          <Typography fontSize={14}>Add Employee</Typography> {/* Changed button text */}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeModal;