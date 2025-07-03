import { Button } from '@mui/material';

const CustomButton = ({
    label,
    color = 'white !important',
    variant = 'contained',
    size = 'medium',
    onClick,
    disabled = false,
    startIcon,
    endIcon,
    backgroundColor = '#1565c0',
    sx = {},
    fullWidth = false,
    loading=false,
    type = 'button',
}) => {
    return (
        <Button
            //   color={color}
            //   variant={variant}
            size={size}

            onClick={onClick}
            disabled={disabled}
            startIcon={startIcon}
            endIcon={endIcon}
            sx={{
                backgroundColor: backgroundColor,
                color:'white'
            }}
            fullWidth={fullWidth}
            type={type}
        >
             {loading ? (
        <Box display="flex" alignItems="center" gap={1}>
          <CircularProgress color="inherit" size={loaderSize} />
          Loading...
        </Box>
      ) : (
        label
      )}
            {/* {label} */}
        </Button>
    );
};

// CustomButton.propTypes = {
//   label: PropTypes.string.isRequired,
//   color: PropTypes.oneOf([
//     'primary',
//     'secondary',
//     'error',
//     'info',
//     'success',
//     'warning',
//   ]),
//   variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
//   size: PropTypes.oneOf(['small', 'medium', 'large']),
//   onClick: PropTypes.func,
//   disabled: PropTypes.bool,
//   startIcon: PropTypes.node,
//   endIcon: PropTypes.node,
//   sx: PropTypes.object,
//   fullWidth: PropTypes.bool,
//   type: PropTypes.string,
// };

export default CustomButton;
