import { Snackbar, Alert } from '@mui/material';


const MuiToaster = ({ open, handleClose, message, severity = 'success' }) => {
    return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >   
      <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MuiToaster;
