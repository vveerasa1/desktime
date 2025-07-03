import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CustomDays from "../../../components/CustomDays";
import CustomTimeSelector from "../../../components/CustomTimeSelector";
import CustomDropdown from "../../../components/CustomDropDown";
import styles from "./index.module.css";

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
    <Grid item xs={12} sm={12} md={12} lg={4}>
      {/* Working Days */}
      <Paper elevation={12} className={styles.paperCard}>
        <Typography variant="subtitle1">Working Days</Typography>
        <Typography className={styles.subText}>
          Please note that only admins can change this information
        </Typography>

        <Box className={styles.columnFlex}>
          <CustomDays
            label="Select Days"
            selectedDays={workingDays}
            onChange={(days) => handleDaysChange(days, "workingDays")}
          />

          <Box className={styles.rowFlex}>
            <Box className={styles.fullWidth}>
              <CustomTimeSelector
                label="Work Starts"
                name="workStartTime"
                value={formData.workStartTime}
                handleChange={(e) => handleChange(e, "workStartTime")}
                isRequired
                disabled={flexibleHours}
                placeholder="Work Start Time"
              />
            </Box>
            <Box className={styles.fullWidth}>
              <CustomTimeSelector
                label="Work Ends"
                name="workEndTime"
                value={formData.workEndTime}
                handleChange={handleChange}
                disabled={flexibleHours}
                placeholder="Work End Time"
              />
            </Box>
          </Box>

          <Box className={styles.halfWidth}>
            <CustomDropdown
              label="Minimum Hours"
              name="hours"
              selectedValue={formData.minimumHours}
              options={minimumHoursOptions}
              handleSelect={(e) => handleSelect(e, "minimumHours")}
              isRequired
              placeholder="Hours"
            />
          </Box>

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
      </Paper>

      {/* Tracking Days */}
      <Paper elevation={12} className={`${styles.paperCard} ${styles.mt2}`}>
        <Typography variant="subtitle1">Tracking Days</Typography>
        <Typography className={styles.label}>
          Please note that only admins can change this information
        </Typography>

        <Box className={styles.columnFlex}>
          <CustomDays
            label="Select Days"
            selectedDays={trackingDays}
            onChange={(days) => handleDaysChange(days, "trackingDays")}
          />

          <Box className={styles.rowFlex}>
            <Box className={styles.fullWidth}>
              <CustomTimeSelector
                label="Tracking Starts"
                name="trackingStartTime"
                value={formData.trackingStartTime}
                handleChange={handleChange}
                isRequired
                disabled={flexibleHours}
                placeholder="Tracking Start Time"
              />
            </Box>
            <Box className={styles.fullWidth}>
              <CustomTimeSelector
                label="Tracking Ends"
                name="trackingEndTime"
                value={formData.trackingEndTime}
                handleChange={handleChange}
                disabled={flexibleHours}
                placeholder="Tracking End Time"
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default TrackingDetails;
