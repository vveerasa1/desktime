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
        onChange={(newValue) => onChange(newValue, name)}
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
                height: "32px",
                padding: "18px 8px",
                borderColor: "#dddddd",
                color: "#333c43",
                backgroundColor: disabled ? "#f5f5f5" : "#fff",
                "& .MuiInputBase-input": {
                  padding: "6px 8px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#dddddd",
                  borderRadius: "6px",
                },
                "& .MuiInputAdornment-root svg": {
                  fontSize: "16px",
                  color: "#999da1",
                },
              },
            },
          },
          popper: {
            sx: {
              "& .MuiPaper-root": {
                borderRadius: "8px",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
              },
              "& .MuiDateCalendar-root": {
                width: "228px",
                maxHeight: "336px",
                padding: "4px 0",
              },
              // Header styling
              "& .MuiPickersCalendarHeader-root": {
                padding: "0 8px",
                minHeight: "36px",
                borderBottom: "1px solid #e0e0e0",
                "& .MuiPickersCalendarHeader-label": {
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#333c43",
                },
                "& .MuiPickersArrowSwitcher-root button": {
                  color: "#333c43",
                  padding: "2px",
                },
              },
              // Weekday labels
              "& .MuiDayCalendar-weekDayLabel": {
                fontSize: "12px",
                color: "#999da1",
                fontWeight: 500,
              },
              // Day cells
              "& .MuiPickersDay-root": {
                fontSize: "13px",
                width: "32px",
                height: "32px",
                margin: "2px 0",
                color: "#333c43",
                "&:hover": {
                  backgroundColor: "#e6f4ea",
                },
              },
              "& .MuiPickersDay-root.Mui-selected": {
                backgroundColor: "#143352 !important",
                color: "#fff !important",
              },
              "& .MuiPickersDay-today": {
                border: "1px solid #143352",
              },
              "& .MuiPickersDay-dayOutsideMonth": {
                color: "#ccc",
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default CustomCalendar;
