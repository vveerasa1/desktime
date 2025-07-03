import React from "react";
import { Grid, Paper, Typography, Box, Avatar, Button } from "@mui/material";
import CustomTextField from "../../../components/CustomTextField";
import CustomDropdown from "../../../components/CustomDropDown";
import CustomPhoneInput from "../../../components/CustomPhoneInput";
import styles from "./index.module.css";

const ProfileDeatils = ({
  formData,
  handleChange,
  handleSelect,
  genderOptions,
  roleOptions,
  timeZoneOptions,
  teamOptions,
  handlePhoneChange,
  profileDetails,
}) => {
  return (
    <Grid item xs={12} sm={12} md={12} lg={6} size={6}>
      {/* Profile Details */}
      <Paper elevation={12} className={styles.profileDetailsCard}>
        <Typography variant="subtitle1" className={styles.profileDetailsTitle}>
          Profile Details
        </Typography>

        <Box className={styles.profileBox}>
          <Box className={styles.avatarRow}>
            <Box>
              <Avatar
                alt="User Profile"
                src={profileDetails?.data?.photo}
                className={styles.avatarImage}
              />
            </Box>
            <Box className={styles.avatarInputWrapper}>
              <CustomTextField
                label="User Name"
                name="username"
                value={formData.username}
                handleChange={(e) => handleChange(e, "username")}
                placeholder="Enter your User Name"
                isRequired
              />
            </Box>
          </Box>

          <CustomTextField
            label="Employee Id"
            name="employeeId"
            value={formData.employeeId}
            handleChange={(e) => handleChange(e, "employeeId")}
            placeholder="Enter your Employee Id"
            isRequired
          />

          <CustomTextField
            label="Email"
            name="email"
            value={formData.email}
            handleChange={(e) => handleChange(e, "email")}
            placeholder="Enter your Email"
            isRequired
          />

          <CustomDropdown
            label="Gender"
            name="gender"
            selectedValue={formData.gender}
            options={genderOptions}
            handleSelect={(e) => handleSelect(e, "gender")}
            placeholder="Select Gender"
            isRequired
          />

          <CustomDropdown
            label="Role"
            name="role"
            selectedValue={formData.role}
            options={roleOptions}
            handleSelect={(e) => handleSelect(e, "role")}
            placeholder="Select Role"
            isRequired
          />

          <CustomDropdown
            label="Team"
            name="team"
            selectedValue={formData.team}
            options={teamOptions}
            handleSelect={(e) => handleSelect(e, "team")}
            placeholder="Select Team"
            isRequired
          />

          <CustomPhoneInput
            label="Phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            isRequired
          />
        </Box>
      </Paper>

      {/* Geo Settings */}
      <Paper elevation={12} className={styles.geoSettingsCard}>
        <Typography variant="subtitle1">Geo Settings</Typography>
        <Box className={styles.profileBox}>
          <CustomDropdown
            label="Time Zone"
            name="timeZone"
            selectedValue={formData.timeZone}
            options={timeZoneOptions}
            handleSelect={(e) => handleSelect(e, "timeZone")}
            placeholder="Select Time Zone"
            isRequired
          />
        </Box>
      </Paper>

      {/* Two Factor Auth */}
      <Paper elevation={12} className={styles.twoFactorCard}>
        <Typography variant="subtitle1">Two Factor Authentication</Typography>
        <Box py={1}>
          <Typography className={styles.twoFactorText}>
            Want to add an extra layer of security to your email and password?
            When you enable two-factor authentication, a security code will be
            generated on your phone whenever you sign in
          </Typography>
        </Box>
        <Box>
          <Typography className={styles.twoFactorText}>
            Note: You can't configure two-factor authentication in DeskTime if
            you log in with single sign-on. You will need a DeskTime account
            password.
          </Typography>
        </Box>
        <Box>
          <Button variant="contained" color="success" className={styles.enableButton}>
            Enable
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
};

export default ProfileDeatils;
