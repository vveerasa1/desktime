import React from "react";
import { Grid, Paper, Typography, Box, Avatar, Button } from "@mui/material";
import CustomTextField from "../../../components/CustomTextField";
import CustomDropdown from "../../../components/CustomDropDown";
import CustomPhoneInput from "../../../components/CustomPhoneInput";

const ProfileDeatils = ({
  formData,
  handleChange,
  handleSelect,
  genderOptions,
  roleOptions,
  timeZoneOptions,
  // timeFormatOptions,
  teamOptions,
  handlePhoneChange,
  profileDetails
}) => {
  return (
    <Grid
    size={{xs:12,md:4}}
      item
      xs={12}
      sm={12}
      md={12}
      lg={6}
    >
      {/* Profile Details */}
      <Paper
        elevation={12}
        sx={{
          padding: "15px",
          width: "100%",
        }}
      >
        <Typography variant="">Profile Details</Typography>
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
            <Box>
              <Avatar
                alt="User Profile"
                src={profileDetails?.data?.photo}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 0.5, // or use 'borderRadius: 0' for a sharper box
                }}
              />
            </Box>
            <Box mt={5} sx={{ flexGrow: 1 }}>
              <CustomTextField
                label="User Name"
                name="username"
                value={formData.username}
                handleChange={(event) => {
                  handleChange(event, "username");
                }}
                placeholder="Enter your User Name"
                isRequired
              />
            </Box>
          </Box>
           <Box>
            <CustomTextField
              label="Employee Id"
              name="employeeId"
              value={formData.employeeId}
              handleChange={(event) => {
                handleChange(event, "employeeId");
              }}
              placeholder="Enter your EmployeeId"
              isRequired
            />
          </Box>
          <Box>
            <CustomTextField
              label="Email"
              name="email"
              value={formData.email}
              handleChange={(event) => {
                handleChange(event, "email");
              }}
              placeholder="Enter your Email"
              isRequired
            />
          </Box>
          {/* <Box>
            <CustomTextField
              label="Password"
              name="password"
              value={formData.password}
              handleChange={(event) => {
                handleChange(event, "password");
              }}
              placeholder="Enter your Password"
              isRequired
            />
          </Box> */}
          <Box>
            <CustomDropdown
              label="Gender"
              name="gender"
              selectedValue={formData.gender}
              options={genderOptions}
              handleSelect={(event) => handleSelect(event, "gender")}
              placeholder="Select Gender"
              isRequired
            />
          </Box>
          <Box>
            <CustomDropdown
              label="Role"
              name="role"
              selectedValue={formData.role}
              options={roleOptions}
              handleSelect={(event) => handleSelect(event, "role")}
              placeholder="Select Role"
              isRequired
            />
          </Box>
          <Box>
            <CustomDropdown
              label="Team"
              name="team"
              selectedValue={formData.team}
              options={teamOptions}
              handleSelect={(event) => handleSelect(event, "team")}
              placeholder="Select Team"
              isRequired
            />
          </Box>
          <Box>
            <CustomPhoneInput
              label="Phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              isRequired
            />
          </Box>
        </Box>
      </Paper>

      {/* Geo Settings */}
      <Paper elevation={12} sx={{ padding: "16px", mt: 2 }}>
        <Typography variant="subtitle1">Geo Settings</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <CustomDropdown
              label="Time Zone"
              name="timeZone"
              selectedValue={formData.timeZone}
              options={timeZoneOptions}
              handleSelect={(event) => handleSelect(event, "timeZone")}
              placeholder="Select Time Zone"
              isRequired
            />
          </Box>
          {/* <Box>
            <Box>
              <CustomDropdown
                label="Time Format"
                name="timeFormat"
                selectedValue={formData.timeFormat}
                options={timeFormatOptions}
                handleSelect={(event) => handleSelect(event, "timeFormat")}
                placeholder="Select Time Format"
                isRequired
              />
            </Box>
          </Box> */}
        </Box>
      </Paper>

      {/* Two Factor Auth */}
      <Paper elevation={12} sx={{ padding: "16px", mt: 2 }}>
        <Typography variant="subtitle1">Two Factor Authentication</Typography>
        <Box py={1}>
          <Typography fontSize={13}>
            Want to add an extra layer of security to your email and password?
            When you enable two-factor authentication, a security code will be
            generated on your phone whenever you sign in
          </Typography>
        </Box>
        <Box>
          <Typography fontSize={13}>
            Note: You can't configure two-factor authentication in DeskTime if
            you log in with single sign-on. You will need a DeskTime account
            password.
          </Typography>
        </Box>

        <Box>
          <Button variant="contained" color="success" sx={{ mt: 1 }}>
            Enable
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
};

export default ProfileDeatils;
