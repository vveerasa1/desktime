import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import styles from "./index.module.css";

const daysList = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

const CustomDays = ({
  selectedDays,
  onChange,
  label = "Select days",
  error = false,
  helperText = "",
  disabled = false,
}) => {
  const handleToggle = (day) => {
    const updated = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    onChange(updated);
  };

  return (
    <Box>
      <Box className={styles.labelWrapper}>
        <Typography variant="subtitle1">{label}</Typography>
        <Tooltip title="Select the days you want to include">
          <IconButton size="small">
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box className={styles.daysContainer}>
        {daysList.map((day) => {
          const isSelected = selectedDays.includes(day);
          return (
            <Box
              key={day}
              onClick={() => {
                if (!disabled) handleToggle(day);
              }}
              className={`${styles.dayBox} ${
                isSelected ? styles.selected : ""
              } ${disabled ? styles.disabled : ""}`}
            >
              {day}
            </Box>
          );
        })}
      </Box>

      {error && (
        <Typography
          sx={{ color: "red" }}
          variant="caption"
          className={styles.errorText}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default CustomDays;
