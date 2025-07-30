import React, { useEffect, useState, useMemo } from "react";
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
import { useGetAllTeamQuery } from "../../../redux/services/team";
import { jwtDecode } from "jwt-decode";
const AddEmployeeModal = ({ open, handleClose, openToaster ,handleCloseToaster}) => {
  const token = localStorage.getItem("token");
  let ownerId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      ownerId = decoded?.ownerId;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
const [getTeamsData, setGetTeamsData] = useState([]);

  const [createProfileApi, { isLoading: createProfileApiIsLoading }] =
    useCreateProfileMutation();
const {
  data: teamsData,
  isLoading,
  isError,
  isSuccess,
} = useGetAllTeamQuery(ownerId, {
  skip: !ownerId,
});

// Memoize formatted team data only when it's available
const formattedTeams = useMemo(() => {
  if (isSuccess && Array.isArray(teamsData?.data)) {
    return teamsData.data.map((team) => ({
      id: team._id,
      name: team.name,

    }));
  }
  return [];
}, [isSuccess, teamsData]);
useEffect(() => {
  if (formattedTeams.length > 0) {
    setGetTeamsData(formattedTeams); // this assumes you have a state setter
  }
}, [formattedTeams]);
console.log(formattedTeams, "formatted data")
  console.log(teamsData?.data, "TEAMS DATA IN ADD EMPLOYEE MODAL");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    team:"",
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
      const trimmedEmail = value.trim();

      if (!trimmedEmail) {
        error = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
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
      team:"",
    };

    if (!formData.username.trim()) {
      errors.username = "User Name is required";
      hasError = true;
    } else if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(formData.username)) {
      errors.username =
        "Only letters and spaces are allowed. Do not use leading or trailing spaces";
      hasError = true;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      hasError = true;
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Invalid email format";
      hasError = true;
    }
     if (!formData.team) {
      errors.team = "Team is required";
      hasError = true; // This was missing - now it will prevent submission
    }

    if (hasError) {
      setFormData((prev) => ({ ...prev, errors }));
      return;
    }
    // const
    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email,
        team:formData.team,
        ownerId,
      };

      await createProfileApi(payload).unwrap();
      openToaster("Employee Added Successfully!", "success");
      setTimeout(() => {
        setFormData({
          username: "",
          email: "",
          team:"",
          errors: { username: "", email: "" ,team:"" },
        });
        handleCloseToaster();

      }, 2000);
      // Clear form and errors
      setFormData({
        username: "",
        email: "",
        team:"",
        errors: {
          username: "",
          email: "",
        team:""
        },
      });
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  console.log(formData,"formdata")
  const handleSelect = (event,name) =>{
    console.log(event,"EVENT",name,"NAMEM")
    const { value } = event.target;
    console.log(value,"VALUE")
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      errors: {
        ...prev.errors,
        [name]: "",
      },
    }));
  }
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Add New Employee</DialogTitle>
      <DialogContent dividers>
        <Grid>
          <EmployeeProfileDetails
            formData={formData}
            handleChange={handleChange}
            handleSelect={handleSelect}
            getTeamsData={getTeamsData}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button sx={{textTransform:"none"}} onClick={handleClose} color="error" variant="outlined">
          Cancel
        </Button>
        <CustomButton
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
