import React from 'react'
import { TextField, Box, Typography, InputAdornment } from '@mui/material'
import styles from './index.module.css'
const CustomTextField = (
    {
        label,
        value,
        handleChange,
        name,
        placeholder,
        error,
        helperText,
        disabled,
        isRequired,
        icon,
        handleBlur }

) => {
    return (
        <Box>
            {label && (
                <Typography className={styles.label} variant='subtitle2'>
                    {label}{isRequired && <span className={styles.required}>*</span>}
                </Typography>
            )}
            <TextField
           
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={(event)=>{
                    handleChange(event, name)
                }}
                onBlur={handleBlur}
                error={error}
                helperText={helperText}
                disabled={disabled}
                fullWidth
                variant='outlined'
               size="small" // <-- add this line
                InputProps={{
                    sx: {
        fontSize: "14px",
            height: '40px',          // explicit height to match Select
          },
                    endAdornment: icon ? (
                        <InputAdornment position="end">{icon}</InputAdornment>
                    ) : null,
                }}
            />
        </Box>
    )
}

export default CustomTextField
