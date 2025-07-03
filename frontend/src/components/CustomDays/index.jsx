import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import styles from "./index.module.css"; // ✅ Import the CSS module

const daysList = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

const CustomDays = ({ selectedDays, onChange, label = "Select days" }) => {
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
              onClick={() => handleToggle(day)}
              className={`${styles.dayBox} ${isSelected ? styles.selected : ""}`}
            >
              {day}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CustomDays;
