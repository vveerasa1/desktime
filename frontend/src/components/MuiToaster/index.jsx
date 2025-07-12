import { Snackbar, Alert } from "@mui/material";

import styles from "./index.module.css";
const MuiToaster = ({ open, handleClose, message, severity = "success" }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        className={styles.alert}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default MuiToaster;
