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
        endIcon,
        handleBlur,
        startIcon,
        onStartIconClick,
        onEndIconClick,
        type,
        rows
    }

) => {
    return (
        <Box sx={{
            height:'65px'
        }}>
            {label && (
                <Typography className={styles.label} variant='subtitle2'>
                    {label}{isRequired && <span style={{ color: "red" }}>*</span>}
                </Typography>
            )}
            <TextField
                rows={rows}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={(event) => {
                    handleChange(event, name)
                }}
                onBlur={handleBlur}
                error={error}
                helperText={helperText}
                disabled={disabled}
                fullWidth
                type={type || 'text'}
                variant='outlined'
                size="small" // <-- add this line

                sx={{
                    "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: "8px",
                        "& fieldset": {
                            borderColor: "#E8E8E8",
                        },
                        "&:hover fieldset": {
                            borderColor: "#706e6eff",
                        },
                        "&.Mui-focused fieldset": {
                            borderColor: "#194CF0",
                        },
                    },
                }}

                InputProps={{
                    sx: {
                        fontSize: "14px",
                        height: '40px',          // explicit height to match Select
                    },
                    startAdornment: startIcon ? (
                        <InputAdornment position="start">
                            <Box className={styles.startIcon}>
                                {React.cloneElement(startIcon, { sx: { fontSize: 18 } })}
                            </Box>
                        </InputAdornment>
                    ) : null,
                    // startAdornment: startIcon ? (
                    //     <InputAdornment position="end">{startIcon}</InputAdornment>
                    // ) : null,
                    endAdornment: endIcon ? (
                        <InputAdornment position="end" onClick={onEndIconClick}>
                            <Box className={styles.endIcon}>
                                {endIcon}</Box>
                        </InputAdornment>
                    ) : null,
                }}
            />
        </Box>
    )
}

export default CustomTextField
