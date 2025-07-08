import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
} from "@mui/material";
import { useCreateProfileMutation } from "../../../redux/services/user";
import EmployeeProfileDetails from "./EmployeeProfileDetails";
import CustomButton from "../../../components/CustomButton";
const AddEmployeeModal = ({ open, handleClose , openToaster }) => {
  const [createProfileApi, { isLoading: createProfileApiIsLoading }] =
    useCreateProfileMutation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    errors: {
      username: "",
      email: "",
    },
  });

  const handleChange = (event, name) => {
    const { value } = event.target;

    let error = "";
    if (name === "username") {
      if (!value.trim()) {
        error = "User Name is required";
      } else if (!/^[A-Za-z\s]*$/.test(value)) {
        error = "Only letters and spaces allowed";
      }
    }

    if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Invalid email format";
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
       errors: {
        ...prev.errors,
        [name]: "",
      },
    }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    let hasError = false;
    const errors = {
      username: "",
      email: "",
    };

    if (!formData.username.trim()) {
      errors.username = "User Name is required";
      hasError = true;
    } else if (!/^[A-Za-z\s]*$/.test(formData.username)) {
      errors.username = "Only letters and spaces allowed";
      hasError = true;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      hasError = true;
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Invalid email format";
      hasError = true;
    }

    if (hasError) {
      setFormData((prev) => ({ ...prev, errors }));
      return;
    }

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
      };

      await createProfileApi(payload).unwrap();
      openToaster("Employee Added Successfully!", "success");
     setTimeout(() => {
        setFormData({
          username: "",
          email: "",
          errors: { username: "", email: "" },
        });
      }, 2000);
      // Clear form and errors
      setFormData({
        username: "",
        email: "",
        errors: {
          username: "",
          email: "",
        },
      });
        handleClose();

    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Add New Employee</DialogTitle>
      <DialogContent dividers>
        <Grid>
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
        <CustomButton
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={createProfileApiIsLoading}
          loading={createProfileApiIsLoading}
          label="Add Employee"
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeModal;
