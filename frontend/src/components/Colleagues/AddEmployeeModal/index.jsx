import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Dialog,         // Import Dialog
  DialogTitle,    // Import DialogTitle
  DialogContent,  // Import DialogContent
  DialogActions,  // Import DialogActions
} from "@mui/material";
import { useCreateProfileMutation } from "../../../redux/services/user";
import MuiToaster from "../../../components/MuiToaster";
import EmployeeProfileDetails from "./EmployeeProfileDetails";

const AddEmployeeModal = ({ open, handleClose }) => {
  const [openToaster, setOpenToaster] = useState(false);
const [createProfileApi, { isLoading: createProfileApiIsLoading }] =
    useCreateProfileMutation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password:""
  });
 const handleSubmit = async () => {
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password:formData.password
      };

      const response = await createProfileApi(payload).unwrap();
      setFormData({
        username: "",
        email: "",
        password:""

      });
      setOpenToaster(true); // Show toaster
      setTimeout(() => {
        setOpenToaster(false);
      }, 2000); // Shorter timeout to close modal faster after toaster
      handleClose()
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleCloseToaster = (event, reason) => {
    if (reason === 'clickaway') {
      setOpenToaster(false);
    }
  };
  const handleChange = (e,name) =>{
        const { value } = e.target;
        setFormData((prev)=>(
            {...prev,[name]:value}
        ))
  }
  return (
    <Dialog open={open} onClose={handleClose} fullWidth >
      <MuiToaster
        handleClose={() => handleCloseToaster(null, "clickaway")}
        open={openToaster}
        message={"Employee Added Successfully!"} 
        severity="success"
      />
      <DialogTitle>Add New Employee</DialogTitle>
      <DialogContent dividers > 
        <Grid >
          <EmployeeProfileDetails
            formData={formData}
            handleChange={handleChange}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={createProfileApiIsLoading}
        >
          <Typography fontSize={14}>Add Employee</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeModal;