import { Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import styles from "./index.module.css";

const CustomCalendar = ({
  label,
  name,
  selectedDate,
  onChange,
  isRequired,
  minDate,
  maxDate,
  disabled,
}) => {
  return (
    <Box>
      {label && (
        <Typography className={styles.label} variant="subtitle2">
          {label} {isRequired && <span className={styles.required}>*</span>}
        </Typography>
      )}
      <DatePicker
        value={selectedDate ? dayjs(selectedDate) : null}
        onChange={(newValue) => onChange(newValue, name)} // ✅ pass name back on change
        disableFuture={false}
        minDate={minDate ? dayjs(minDate) : undefined}
        maxDate={maxDate ? dayjs(maxDate) : undefined}
        disabled={disabled}
        slotProps={{
          textField: {
            variant: "outlined",
            size: "small",
            InputProps: {
              sx: {
                fontSize: "14px",
                height: "32px", // reduce height
                padding: "18px 8px", // tighter padding
                backgroundColor: disabled ? "#f5f5f5" : "#fff",
                "& .MuiInputBase-input": {
                  padding: "6px 8px", // adjust inside padding
                },
                "& .MuiInputAdornment-root": {
                  marginRight: "4px", // tighter icon padding
                },
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default CustomCalendar;
