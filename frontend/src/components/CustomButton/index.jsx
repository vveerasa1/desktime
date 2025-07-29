import { Button, Box, CircularProgress } from '@mui/material';

const CustomButton = ({
    label,
    color = 'primary',
    variant = 'outlined', // Changed default to outlined
    size = 'medium',
    onClick,
    disabled = false,
    startIcon,
    endIcon,
    backgroundColor = '#1565c0',
    sx = {},
    fullWidth = false,
    loading = false,
    type = 'button',
}) => {
    return (
        <Button
            color={color}
            variant={variant}
            size={size}
            onClick={onClick}
            disabled={disabled}
            startIcon={startIcon}
            endIcon={endIcon}
            sx={{
                textTransform: "none",
                borderRadius: "8px",
                "&:hover": {
                    backgroundColor: "#143BA0",
                    color: "white"
                },
                ...(variant === 'contained' && {
                    backgroundColor: backgroundColor,
                    color: 'white'
                }),
                ...sx
            }}
            fullWidth={fullWidth}
            type={type}
        >
            {loading ? (
                <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={24} color="inherit" />
                </Box>
            ) : (
                label
            )}
        </Button>
    );
};

export default CustomButton;