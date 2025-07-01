// src/components/AddTaskModal.jsx
import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomTextField from "../../../../CustomTextField";

const AddTaskModal = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                Add Task
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={6}  size={6}>
                        <CustomTextField
                            fullWidth
                            label="Project Name"
                            name="projectName"
                            // value={formData.projectName}
                            // handleChange={(e) => handleChange(e, "reason")}
                            margin="dense"
                        />
                    </Grid>
                    <Grid item xs={6}  size={6}>
                        <CustomTextField
                            fullWidth
                            label="Task Name"
                            name="taskName"
                            // value={formData.reason}
                            // handleChange={(e) => handleChange(e, "reason")}
                            margin="dense"
                        />
                        {/* <TextField
              fullWidth
              label="Task Name"
              variant="outlined"
              size="small"
            /> */}
                    </Grid>
                    <Grid item xs={12}>
                        {/* <CustomTextField
                            fullWidth
                            label="Description"
                            name="Description"
                            // value={formData.reason}
                            // handleChange={(e) => handleChange(e, "reason")}
                            margin="dense"
                        /> */}
                        {/* <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              variant="outlined"
              size="small"
            /> */}
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined">
                    Cancel
                </Button>
                <Button variant="contained" sx={{ bgcolor: "#194CF0" }}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTaskModal;
