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
  getTeamsOptions,
  handlePhoneChange,
  profileDetails,
  handleBlur,
  role

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
                disabled={role !== "Admin"} 
                onBlur={(e) => handleBlur(e, "username")}
                error={Boolean(formData.errors?.username)}
                helperText={formData.errors?.username}
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
                disabled={role !== "Admin"} 

            onBlur={(e) => handleBlur(e, "employeeId")}
            error={Boolean(formData.errors?.employeeId)}
            helperText={formData.errors?.employeeId}
          />

          <CustomTextField
            label="Email"
            name="email"
            value={formData.email}
            handleChange={(e) => handleChange(e, "email")}
            placeholder="Enter your Email"
            isRequired
                disabled={role !== "Admin"} 

            onBlur={(e) => handleBlur(e, "email")}
            error={Boolean(formData.errors?.email)}
            helperText={formData.errors?.email}
          />

          <CustomDropdown
            label="Gender"
            name="gender"
            selectedValue={formData.gender}
            options={genderOptions}
            handleSelect={(e) => handleSelect(e, "gender")}
            placeholder="Select Gender"
            isRequired
            onBlur={(e) => handleBlur(e, "gender")}
            error={Boolean(formData.errors?.gender)}
            helperText={formData.errors?.gender}
          />

          <CustomDropdown
            label="Role"
            name="role"
            selectedValue={formData.role}
            options={roleOptions}
            handleSelect={(e) => handleSelect(e, "role")}
            placeholder="Select Role"
            isRequired
                disabled={role !== "Admin"} 

            onBlur={(e) => handleBlur(e, "role")}
            error={Boolean(formData.errors?.role)}
            helperText={formData.errors?.role}
          />

          <CustomDropdown
            label="Team"
            name="team"
            selectedValue={formData?.team}
            options={getTeamsOptions}
            handleSelect={(e) => handleSelect(e, "team")}
            placeholder="Select Team"
             disabled={role !== "Admin"} 
            isRequired
            onBlur={(e) => handleBlur(e, "team")}
            error={Boolean(formData.errors?.team)}
            helperText={formData.errors?.team}
          />

          <CustomPhoneInput
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            isRequired
            onBlur={(e) => handleBlur(e, "phone")}
            error={Boolean(formData.errors?.phone)}
            helperText={formData.errors?.phone}
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
              onBlur={(e) => handleBlur(e, "timeZone")}
            error={Boolean(formData.errors?.timeZone)}
            helperText={formData.errors?.timeZone}
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
          <Button
            variant="contained"
            color="success"
            className={styles.enableButton}
          >
            Enable
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
};

export default ProfileDeatils;
