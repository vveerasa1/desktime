import { Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import styles from './index.module.css';

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
            display:"none",
            InputProps: {
              sx: {
                fontSize: '14px',
                height: '36px',
                padding: '5px 12px',
                backgroundColor: disabled ? '#f5f5f5' : '#fff',
              },
            },
          },
        }}
      />
    </Box>
  );
};


export default CustomCalendar;
