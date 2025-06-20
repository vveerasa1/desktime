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
        type
    }

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
                InputProps={{
                    sx: {
                        fontSize: "14px",
                        height: '40px',          // explicit height to match Select
                    },
                    startAdornment: startIcon ? (
                        <InputAdornment position="start">
                            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                {React.cloneElement(startIcon, { sx: { fontSize: 18 } })}
                            </Box>
                        </InputAdornment>
                    ) : null,
                    // startAdornment: startIcon ? (
                    //     <InputAdornment position="end">{startIcon}</InputAdornment>
                    // ) : null,
                    endAdornment: endIcon ? (
                        <InputAdornment position="end" onClick={onEndIconClick}>
                            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                {endIcon}</Box>
                        </InputAdornment>
                    ) : null,
                }}
            />
        </Box>
    )
}

export default CustomTextField
