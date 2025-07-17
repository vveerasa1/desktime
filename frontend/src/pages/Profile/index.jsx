import React, { useEffect, useState ,useMemo} from "react";
import { Grid, Paper, Typography, Button, Box } from "@mui/material";
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
import { useGetAllTeamQuery } from "../../redux/services/team";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const navigate = useNavigate();
  const { _id: paramId } = useParams();
  const [workingDays, setWorkingDays] = useState([]);
  const [trackingDays, setTrackingDays] = useState([]);
  const [flexibleHours] = useState(false);
  const [open, setOpen] = useState(false);
  const [openToaster, setOpenToaster] = useState(false);
  const [getTeamsOptions,setGetTeamsOptions] = useState([])
  const [updateProfile, { isLoading: updateProfileIsLoading }] =
    useUpdateProfileMutation();
  const [createProfileApi, { isLoading: createProfileApiIsLoading }] =
    useCreateProfileMutation();

  const token = localStorage.getItem("token");
  let userId = null;
  let role = null;
  let ownerId = null;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded?.userId;
    role = decoded?.role;
    ownerId = decoded?.ownerId;
  }
  const userIdToFetch = paramId || userId;
  const {
    data: profileDetails,
    isLoading: getSingleProfileApiIsLoading,
    isError,
    error,
  } = useGetSingleProfileQuery(userIdToFetch, { skip: !userIdToFetch });

const {
  data: teamsData,
  isLoading: isTeamsLoading,
  isError: isTeamsError,
  isSuccess,
} = useGetAllTeamQuery(ownerId, {
  skip: !ownerId,
});

// Memoize formatted team data only when it's available
const formattedTeams = useMemo(() => {
  if (isSuccess && Array.isArray(teamsData?.data)) {
    return teamsData.data.map((team) => ({
      id: team._id,
      name: team.name,

    }));
  }
  return [];
}, [isSuccess, teamsData]);
useEffect(() => {
  if (formattedTeams.length > 0) {
    setGetTeamsOptions(formattedTeams); // this assumes you have a state setter
  }
}, [formattedTeams]);

  const timeZoneOptions = moment.tz.names().map((tz) => ({ id: tz, name: tz }));

  const [formData, setFormData] = useState({
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
    workingDays: workingDays,
    trackingDays: trackingDays,
    flexibleHours: flexibleHours,
    errors: {},
  });

  const reverseDayNameMap = {
    Monday: "MO",
    Tuesday: "TU",
    Wednesday: "WE",
    Thursday: "TH",
    Friday: "FR",
    Saturday: "SA",
    Sunday: "SU",
  };

  useEffect(() => {
    if (profileDetails?.data && !getSingleProfileApiIsLoading) {
      const data = profileDetails.data;
      const workingDayCodes =
        data.workingDays?.map((day) => reverseDayNameMap[day]) || [];
      const trackingDayCodes =
        data.trackingDays?.map((day) => reverseDayNameMap[day]) || [];

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      errors: {
        ...prev.errors,
        [name]: "",
      },
    }));
  };

  const handleSelect = (event, name) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      errors: {
        ...prev.errors,
        [name]: "",
      },
    }));
  };

  const handlePhoneChange = (phone, data) => {
    setFormData((prev) => ({
      ...prev,
      phone: phone,
      countryCode: data.dialCode,
      errors: {
        ...prev.errors,
        [data]: "",
      },
    }));
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
    { id: "9 Hours", name: "9 Hours" },
    { id: "10 Hours", name: "10 Hours" },
  ];


  const handleDaysChange = (days, type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: days,
      errors: {
        ...prev.errors,
        [type]: "",
      },
    }));

    if (type === "workingDays") setWorkingDays(days);
    else if (type === "trackingDays") setTrackingDays(days);
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
    const errors = {};

    // === Validation Rules ===
    if (!formData.username.trim()) {
      errors.username = "User Name is required";
    } else if (!/^[A-Za-z\s]*$/.test(formData.username)) {
      errors.username = "User Name must contain only letters and spaces";
    }

    if (!formData.employeeId.trim()) {
      errors.employeeId = "Employee Id Is Required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.role) {
      errors.role = "Role is required";
    }

    if (!formData.gender) {
      errors.gender = "Gender is required";
    }

    // if (!formData.phone) {
    //   errors.phone = "Phone number is required";
    // }

      if (!formData.phone || formData.phone.length < 10) {
        errors.phone = "Valid phone number is required";
      }

    if (!formData.timeZone) {
      errors.timeZone = "Time zone is required";
    }

    if (!formData.workStartTime || !formData.workEndTime) {
      errors.workStartTime = "Work start time is required";
      errors.workEndTime = "Work end time is required";
    }

    if (!formData.trackingStartTime || !formData.trackingEndTime) {
      errors.trackingStartTime = "Tracking start time is required";
      errors.trackingEndTime = "Tracking end time is required";
    }

    if (!formData.minimumHours) {
      errors.minimumHours = "Minimum hours is required";
    }

    if (!formData.workingDays.length) {
      errors.workingDays = "Select at least one working day";
    }

    if (!formData.trackingDays.length) {
      errors.trackingDays = "Select at least one tracking day";
    }
    if (Object.keys(errors).length > 0) {
      setFormData((prev) => ({ ...prev, errors }));
      return;
    }

    setFormData((prev) => ({ ...prev, errors: {} }));

    try {
      const payload = {
        employeeId: formData.employeeId,
        username: formData.username,
        email: formData.email,
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

      if (userIdToFetch) {
        await updateProfile({
          id: userIdToFetch,
          profileData: payload,
        }).unwrap();
      } else {
        await createProfileApi(payload).unwrap();
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
          errors: {},
        });
        setWorkingDays([]);
        setTrackingDays([]);
      }

      setOpenToaster(true);
        navigate(`/colleagues`);

      setTimeout(() => setOpenToaster(false), 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setOpenToaster(true);
    }
  };

  const handleBlur = (e, name) => {
    const { value } = e?.target || {};
    let error = "";

    switch (name) {
      case "username":
        if (!value?.trim()) error = "User Name is required";
        else if (!/^[A-Za-z\s]*$/.test(value))
          error = "Only letters and spaces allowed";
        break;

      case "employeeId":
        if (!value?.trim()) error = "Employee ID is required";
        break;

      case "email":
        if (!value?.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email";
        break;

       case "phone":
      if (!formData.phone || formData.phone.length < 10) {
        error = "Valid phone number is required";
      }
      break;

      case "role":
      case "gender":
      case "team":
      case "timeZone":
      case "minimumHours":
        if (!value) {
          error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        }
        break;

      case "workStartTime":
      case "workEndTime":
      case "trackingStartTime":
      case "trackingEndTime":
        if (!value?.trim()) {
          error =
            name
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (c) => c.toUpperCase()) + " is required";
        }
        break;
      case "workingDays":
      case "trackingDays":
        if (!value || value.length === 0)
          error = "At least one day must be selected";
        break;
      default:
        break;
    }

    setFormData((prev) => ({
      ...prev,
      errors: {
        ...prev.errors,
        [name]: error,
      },
    }));
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") setOpenToaster(false);
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
          Error loading profile:{" "}
          {error?.data?.message || error?.message || "Unknown error"}
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
          getTeamsOptions={getTeamsOptions}
          handlePhoneChange={handlePhoneChange}
          profileDetails={profileDetails}
          getSingleProfileApiIsLoading={getSingleProfileApiIsLoading}
          handleBlur={handleBlur}
          role={role}
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
          handleBlur={handleBlur}
          role={role}
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

        <ChangePasswordModal
          open={open}
          setOpen={setOpen}
          handleChange={handleChange}
        />
      </Grid>
    </Box>
  );
};

export default Profile;
