import { Grid, Paper, Typography, Box, Avatar, Button } from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";
import CustomDropdown from "../../../../components/CustomDropDown";
import CustomPhoneInput from "../../../../components/CustomPhoneInput";

const EmployeeProfileDetails = ({
  formData,
  handleChange,
  handleSelect,
  genderOptions,
  roleOptions,
  timeZoneOptions,
  teamOptions,
  handlePhoneChange,
  profileDetails
}) => {
  return (
    <Grid
    size={{xs:12,md:6}}
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
        </Box>
      </Paper>
    </Grid>
  );
};

export default EmployeeProfileDetails;
