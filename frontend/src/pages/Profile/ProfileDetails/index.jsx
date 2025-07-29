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
  role,
}) => {
  return (
    <Grid item size={{ xs: 12, md: 4 }}>
      {/* Profile Details */}
      <Paper elevation={12} className={styles.profileDetailsCard}>
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
              disabled={!(role === 'Admin' || role === 'Owner')}
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
              disabled={!(role === 'Admin' || role === 'Owner')}
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
              disabled={!(role === 'Admin' || role === 'Owner')}
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
              disabled={!(role === 'Admin' || role === 'Owner')}
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
              disabled={!(role === 'Admin' || role === 'Owner')}
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
      <Box mt={2}>

      <Paper elevation={12} className={styles.geoSettingsCard}>
        <Typography variant="subtitle1">Geo Settings</Typography>
        <Box  className={styles.profileBox}>
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
      </Box>

    </Grid>
  );
};

export default ProfileDeatils;
