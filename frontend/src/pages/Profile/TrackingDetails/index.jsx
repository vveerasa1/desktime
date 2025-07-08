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
  handleBlur,
  role
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
             disabled={role !== "Admin"} 
            onChange={(days) => handleDaysChange(days, "workingDays")}
            error={Boolean(formData.errors?.workingDays)}
            helperText={formData.errors?.workingDays}
          />

          <Box className={styles.rowFlex}>
            <Box className={styles.fullWidth}>
              <CustomTimeSelector
                label="Work Starts"
                name="workStartTime"
                value={formData.workStartTime}
                handleChange={(e) => handleChange(e, "workStartTime")}
                onBlur={(e) => handleBlur(e, "workStartTime")}
                isRequired
                disabled={flexibleHours || role !== 'Admin'}
                placeholder="Work Start Time"
                error={Boolean(formData.errors?.workStartTime)}
                helperText={formData.errors?.workStartTime}
              />
            </Box>
            <Box className={styles.fullWidth}>
              <CustomTimeSelector
                label="Work Ends"
                name="workEndTime"
                value={formData.workEndTime}
                handleChange={(e) => handleChange(e, "workEndTime")}
                onBlur={(e) => handleBlur(e, "workEndTime")}
                disabled={flexibleHours || role !== 'Admin'}
                placeholder="Work End Time"
                error={Boolean(formData.errors?.workEndTime)}
                helperText={formData.errors?.workEndTime}
              />
            </Box>
          </Box>

          <Box className={styles.halfWidth}>
            <CustomDropdown
              label="Minimum Hours"
              name="minimumHours"
              selectedValue={formData.minimumHours}
              options={minimumHoursOptions}
              handleSelect={(e) => handleSelect(e, "minimumHours")}
              onBlur={(e) => handleBlur(e, "minimumHours")}
              isRequired
              placeholder="Hours"
              disabled={role !=='Admin'}
              error={Boolean(formData.errors?.minimumHours)}
              helperText={formData.errors?.minimumHours}
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

             disabled={role !== "Admin"} 

            onChange={(days) => handleDaysChange(days, "trackingDays")}
            error={Boolean(formData.errors?.trackingDays)}
            helperText={formData.errors?.trackingDays}
         />

          <Box className={styles.rowFlex}>
            <Box className={styles.fullWidth}>
              <CustomTimeSelector
                label="Tracking Starts"
                name="trackingStartTime"
                value={formData.trackingStartTime}
                handleChange={(e) => handleChange(e, "trackingStartTime")}
                onBlur={(e) => handleBlur(e, "trackingStartTime")}
                isRequired
                disabled={flexibleHours || role !== 'Admin'}
                placeholder="Tracking Start Time"
                error={Boolean(formData.errors?.trackingStartTime)}
                helperText={formData.errors?.trackingStartTime}
              />
            </Box>
            <Box className={styles.fullWidth}>
              <CustomTimeSelector
                label="Tracking Ends"
                name="trackingEndTime"
                value={formData.trackingEndTime}
                handleChange={(e) => handleChange(e, "trackingEndTime")}
                onBlur={(e) => handleBlur(e, "trackingEndTime")}
                disabled={flexibleHours || role !== 'Admin'}
                placeholder="Tracking End Time"
                error={Boolean(formData.errors?.trackingEndTime)}
                helperText={formData.errors?.trackingEndTime}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default TrackingDetails;
