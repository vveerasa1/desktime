import {
  Grid,
  Paper,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import CustomDays from "../../../components/CustomDays";
import CustomTimeSelector from "../../../components/CustomTimeSelector";
import CustomDropdown from "../../../components/CustomDropDown";
const TrackingDetails = ({
  formData,
  handleChange,
  handleDaysChange,
  handleSelect,
  workingDays,
  trackingDays,
  minimumHoursOptions,
}) => {
  const [flexibleHours, setFlexibleHours] = useState(false);

  return (
    <Grid
      item
      xs={12}
      sm={12}
      md={12}
      lg={4}
      sx={{ width: { xs: "100%", lg: "40%" } }}
    >
      {/* Working Days */}
      <Paper
        elevation={12}
        sx={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
        }}
      >
        <Typography variant="p">Working Days</Typography>
        <Typography fontSize={12}>
          Please note that only admins can change this information
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <CustomDays
              label="Select Days"
              selectedDays={workingDays}
              onChange={(days) => handleDaysChange(days, "workingDays")}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Box sx={{ width: "100%" }}>
              <CustomTimeSelector
                label="Work Starts"
                name="workStartTime"
                value={formData.workStartTime}
                handleChange={(event)=> handleChange(event,"workStartTime")}
                isRequired
                disabled={flexibleHours}
                placeholder={"Work Start Time"}
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <CustomTimeSelector
                label="Work Ends"
                name="workEndTime"
                value={formData.workEndTime}
                handleChange={handleChange}
                disabled={flexibleHours}
                placeholder={"Work End Time"}
              />
            </Box>
          </Box>

          <Box>
            <Box sx={{ width: "50%" }}>
              <CustomDropdown
                label="Minimum Hours"
                name="hours"
                selectedValue={formData.minimumHours}
                options={minimumHoursOptions}
                handleSelect={(event) => handleSelect(event, "minimumHours")}
                isRequired
                placeholder="Hours"
              />
            </Box>
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={flexibleHours}
                  onChange={(e) => setFlexibleHours(e.target.checked)}
                />
              }
              label="Flexible Hours"
            />
          </Box>
        </Box>
      </Paper>

      {/* Tracking Days */}
      <Paper elevation={12} sx={{ padding: "16px", mt: 2 }}>
        <Typography variant="">Tracking Days</Typography>
        <Typography py={2} fontSize={13}>
          Please note that only admins can change this information
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <CustomDays
              label="Select Days"
              selectedDays={trackingDays}
              onChange={(days) => handleDaysChange(days, "trackingDays")}
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Box sx={{ width: "100%" }}>
              <CustomTimeSelector
                label="Tracking Starts"
                name="trackingStartTime"
                value={formData.trackingStartTime}
                handleChange={handleChange}
                isRequired
                disabled={flexibleHours}
                placeholder={"Tracking Start Time"}
              />
            </Box>
            <Box sx={{ width: "100%" }}>
              <CustomTimeSelector
                label="Tracking Ends"
                name="trackingEndTime"
                value={formData.trackingEndTime}
                handleChange={handleChange}
                disabled={flexibleHours}
                placeholder={"Tracking End Time"}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default TrackingDetails;
