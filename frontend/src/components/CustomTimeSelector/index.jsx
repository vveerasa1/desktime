import React from "react";
import { Autocomplete, TextField, Typography, Box } from "@mui/material";
import styles from "./index.module.css";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Generate time slots like 09:00 AM, 09:30 AM, etc.
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 5) {
      const h = hour.toString().padStart(2, "0");
      const m = min.toString().padStart(2, "0");
      times.push(`${h}:${m}`);
    }
  }

  // Ensure the last time is 23:59 if it's not already included
  if (times[times.length - 1] !== "23:59") {
    times.push("23:59");
  }

  return times;
};


const timeOptions = generateTimeOptions(); // You can change interval if needed

const CustomTimeSelector = ({
  label,
  value,
  name,
  handleChange,
  placeholder,
  isRequired,
  error,
  helperText,
  disabled,
}) => {
  return (
    <Box >
      {label && (
        <Typography className={styles.label} variant="subtitle2">
          {label}
          {isRequired && <span className={styles.required}>*</span>}
        </Typography>
      )}
      <Autocomplete
        freeSolo
        options={timeOptions}
        value={value}
        onChange={(event, newValue) => {
          handleChange({ target: { name, value: newValue } }, name);
        }}
        onInputChange={(event, newInputValue) => {
          handleChange({ target: { name, value: newInputValue } }, name);
        }}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            placeholder={placeholder || "Select or type time"}
            error={error}
            helperText={helperText}
            fullWidth
            variant="outlined"
            size="small" // <-- add this line
 InputProps={{
      ...params.InputProps,
      style: {
        height: "40px",              // <-- desired height in px
        boxSizing: "border-box",
      },
    }}
    
    inputProps={{
      ...params.inputProps,
      style: {
        padding: "10px 0",       // reduce internal padding
        fontSize: "14px",
      },
    }}
          />
        )}
      />
    </Box>
  );
};

export default CustomTimeSelector;
