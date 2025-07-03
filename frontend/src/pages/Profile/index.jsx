import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Box,
} from "@mui/material";
import moment from "moment-timezone";
import ProfileDeatils from "./ProfileDetails";
import TrackingDetails from "./TrackingDetails";
import ChangePasswordModal from "./ChangePasswordModal";
import {
  useCreateProfileMutation,
  useGetSingleProfileQuery,
  useUpdateProfileMutation,
} from "../../redux/services/user";
import { useParams } from "react-router-dom";
import MuiToaster from "../../components/MuiToaster";
import { jwtDecode } from "jwt-decode";
import styles from "./index.module.css";

const Profile = () => {
  const { _id: paramId } = useParams();
  const [workingDays, setWorkingDays] = useState([]);
  const [trackingDays, setTrackingDays] = useState([]);
  const [flexibleHours] = useState(false);
  const [open, setOpen] = useState(false);
  const [openToaster, setOpenToaster] = useState(false);

  const [updateProfile, { isLoading: updateProfileIsLoading }] = useUpdateProfileMutation();
  const [createProfileApi, { isLoading: createProfileApiIsLoading }] = useCreateProfileMutation();

  const token = localStorage.getItem('token');
  let userId = null;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded?.userId;
  }
  const userIdToFetch = paramId || userId;

  const { data: profileDetails, isLoading: getSingleProfileApiIsLoading, isError, error } =
    useGetSingleProfileQuery(userIdToFetch, { skip: !userIdToFetch });

  const timeZoneOptions = moment.tz.names().map((tz) => ({ id: tz, name: tz }));

  const [formData, setFormData] = useState({
    employeeId: "", username: "", email: "", password: "", role: "", gender: "",
    phone: "", countryCode: "", team: "", timeZone: "", workStartTime: "", workEndTime: "",
    trackingStartTime: "", trackingEndTime: "", minimumHours: "", workingDays: workingDays,
    trackingDays: trackingDays, flexibleHours: flexibleHours,
  });

  const reverseDayNameMap = {
    Monday: "MO", Tuesday: "TU", Wednesday: "WE", Thursday: "TH",
    Friday: "FR", Saturday: "SA", Sunday: "SU",
  };

  useEffect(() => {
    if (profileDetails?.data && !getSingleProfileApiIsLoading) {
      const data = profileDetails.data;
      const workingDayCodes = data.workingDays?.map((day) => reverseDayNameMap[day]) || [];
      const trackingDayCodes = data.trackingDays?.map((day) => reverseDayNameMap[day]) || [];

      setWorkingDays(workingDayCodes);
      setTrackingDays(trackingDayCodes);
      setFormData({
        employeeId: data.employeeId || "",
        username: data.username || "",
        email: data.email || "",
        password: "",
        gender: data.gender || "",
        role: data.role || "",
        team: data.team || "",
        phone: data.phone || "",
        countryCode: data.countryCode || "",
        timeZone: data.timeZone || "",
        workStartTime: data.workStartTime || "",
        workEndTime: data.workEndTime || "",
        trackingStartTime: data.trackingStartTime || "",
        trackingEndTime: data.trackingEndTime || "",
        minimumHours: data.minimumHours || "",
        workingDays: data?.workingDays || [],
        trackingDays: data?.trackingDays || [],
        flexibleHours: data.flexibleHours || false,
      });
    } else if (isError) {
      console.error("Error fetching profile details:", error);
    }
  }, [profileDetails, getSingleProfileApiIsLoading, isError, error]);

  const handleChange = (event, name) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (event, name) => {
    const { value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (phone, data) => {
    setFormData((prev) => ({ ...prev, phone: phone, countryCode: data.dialCode }));
  };

  const genderOptions = [
    { id: "Male", name: "Male" },
    { id: "Female", name: "Female" },
    { id: "Other", name: "Other" },
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
    setFormData((prev) => ({ ...prev, [type]: days }));
    if (type === "workingDays") setWorkingDays(days);
    else if (type === "trackingDays") setTrackingDays(days);
  };

  const dayNameMap = {
    MO: "Monday", TU: "Tuesday", WE: "Wednesday", TH: "Thursday",
    FR: "Friday", SA: "Saturday", SU: "Sunday",
  };
  const workingDaysFull = workingDays.map((d) => dayNameMap[d]);
  const trackingDaysFull = trackingDays.map((d) => dayNameMap[d]);

  const handleSubmit = async () => {
    try {
      const payload = {
        employeeId: formData.employeeId, username: formData.username, email: formData.email,
        role: formData.role, gender: formData.gender, phone: formData.phone,
        countryCode: formData.countryCode, team: formData.team, workStartTime: formData.workStartTime,
        workEndTime: formData.workEndTime, trackingStartTime: formData.trackingStartTime,
        trackingEndTime: formData.trackingEndTime, minimumHours: formData.minimumHours,
        workingDays: workingDaysFull, trackingDays: trackingDaysFull,
        flexibleHours: formData.flexibleHours, timeZone: formData.timeZone,
      };

      if (userIdToFetch) {
        await updateProfile({ id: userIdToFetch, profileData: payload }).unwrap();
        setOpenToaster(true);
      } else {
        await createProfileApi(payload).unwrap();
        setFormData({
          employeeId: "", username: "", email: "", password: "", role: "", gender: "",
          phone: "", countryCode: "", team: "", timeZone: "", workStartTime: "", workEndTime: "",
          trackingStartTime: "", trackingEndTime: "", minimumHours: "",
          workingDays: [], trackingDays: [], flexibleHours: false,
        });
        setWorkingDays([]);
        setTrackingDays([]);
        setOpenToaster(true);
      }

      setTimeout(() => setOpenToaster(false), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') setOpenToaster(false);
  };

  if (getSingleProfileApiIsLoading) {
    return (
      <Box className={styles.loadingBox}>
        <Typography variant="h6">Loading profile...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className={styles.errorBox}>
        <Typography className={styles.errorText} variant="h6">
          Error loading profile: {error?.data?.message || error?.message || "Unknown error"}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <MuiToaster
        handleClose={() => handleClose(null, "clickaway")}
        open={openToaster}
        message={"User Profile Updated"}
        severity="success"
      />
      <Box className={styles.container}>
        <Button
          variant="contained"
          color="white"
          className={styles.buttonWhite}
          onClick={() => setOpen(true)}
        >
          <Typography fontSize={14}>Change Password</Typography>
        </Button>
        <Button
          variant="contained"
          color="success"
          className={styles.buttonSuccess}
          onClick={handleSubmit}
          disabled={createProfileApiIsLoading || updateProfileIsLoading}
        >
          <Typography fontSize={14}>Save Changes</Typography>
        </Button>
      </Box>

      <Grid container className={styles.gridContainer}>
        <ProfileDeatils
          formData={formData}
          handleChange={handleChange}
          handleSelect={handleSelect}
          genderOptions={genderOptions}
          roleOptions={roleOptions}
          timeZoneOptions={timeZoneOptions}
          minimumHoursOptions={minimumHoursOptions}
          teamOptions={teamOptions}
          handlePhoneChange={handlePhoneChange}
          profileDetails={profileDetails}
          getSingleProfileApiIsLoading={getSingleProfileApiIsLoading}
        />

        <TrackingDetails
          formData={formData}
          handleChange={handleChange}
          handleSelect={handleSelect}
          minimumHoursOptions={minimumHoursOptions}
          timeZoneOptions={timeZoneOptions}
          workingDays={workingDays}
          trackingDays={trackingDays}
          handleDaysChange={handleDaysChange}
        />

        <Grid item xs={12} sm={12} md={12} lg={2}>
          <Paper elevation={12} className={styles.emailPaper}>
            <Typography variant="p" gutterBottom>
              Email Subscription
            </Typography>
            <Typography variant="body1" fontSize={12}>
              Stay informed with our latest updates, tips, and feature releases.
              You can unsubscribe at any time.
            </Typography>
          </Paper>
        </Grid>

        <ChangePasswordModal open={open} setOpen={setOpen} handleChange={handleChange} />
      </Grid>
    </Box>
  );
};

export default Profile;
