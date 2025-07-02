import { Grid, Paper, Typography, Box, Avatar, Button } from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";

const EmployeeProfileDetails = ({ formData, handleChange }) => {
  return (
    <Grid>
      <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
        <Box>
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
          <CustomTextField
            label="Password"
            name="password"
            type='password'
            value={formData.password}
            handleChange={(event) => {
              handleChange(event, "password");
            }}
            placeholder="Enter your Password"
            isRequired
          />
        </Box>
      </Box>
    </Grid>
  );
};

export default EmployeeProfileDetails;
