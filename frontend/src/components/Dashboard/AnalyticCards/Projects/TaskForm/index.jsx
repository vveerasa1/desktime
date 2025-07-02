import { useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomTextField from "../../../../CustomTextField";
import styles from "./index.module.css";

const AddTaskModal = ({ open, onClose }) => {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const content = useMemo(() => (
    <Grid container spacing={2}>
      <Grid item xs={6} size={6}>
        <CustomTextField
          fullWidth
          label="Project Name"
          name="projectName"
          margin="dense"
        />
      </Grid>
      <Grid item xs={6} size={6}>
        <CustomTextField
          fullWidth
          label="Task Name"
          name="taskName"
          margin="dense"
        />
      </Grid>
    </Grid>
  ), []);

  const actions = useMemo(() => (
    <>
      <Button onClick={handleClose} variant="outlined">
        Cancel
      </Button>
      <Button variant="contained" className={styles.saveButton}>
        Save
      </Button>
    </>
  ), [handleClose]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle className={styles.dialogTitle}>
        Add Task
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>{content}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  );
};

export default AddTaskModal;
