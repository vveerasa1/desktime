import { Grid, Box } from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";
import styles from './index.module.css';
import CustomDropdown from "../../../CustomDropDown";
const EmployeeProfileDetails = ({ formData, handleChange,handleSelect,getTeamsData }) => {
  return (
    <Grid>
      <Box className={styles.container}>
        <Box >
          <CustomTextField
            label="User Name"
            name="username"
            value={formData.username}
            handleChange={(event) => handleChange(event, "username")}
            placeholder="Enter User Name"
            isRequired
            error={Boolean(formData.errors?.username)}
            helperText={formData.errors?.username}
          />
        </Box>
        <Box mt={2}>
          <CustomTextField
            label="Email"
            name="email"
            value={formData.email}
            handleChange={(event) => handleChange(event, "email")}
            placeholder="Enter Email"
            isRequired
            error={Boolean(formData.errors?.email)}
            helperText={formData.errors?.email}
          />
        </Box>
        <Box mt={2}>
          <CustomDropdown
            label="Team"
            name="team"
            selectedValue={formData?.team}
            options={getTeamsData}
            handleSelect={(event) => handleSelect(event, "team")}
            isRequired
            error={Boolean(formData.errors?.team)}
            helperText={formData.errors?.team}
          />
        </Box>
      </Box>
    </Grid>
  );
};

export default EmployeeProfileDetails;
