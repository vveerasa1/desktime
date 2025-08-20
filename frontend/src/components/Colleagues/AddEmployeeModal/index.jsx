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
const AddEmployeeModal = ({ open, handleClose, openToaster ,handleCloseToaster,colleaguesData,formData,setFormData}) => {
console.log("colleaguesData", colleaguesData);

const filteredColleagues = useMemo(() => {
  let filteredData = colleaguesData?.users;
  
  if (filteredData) {
    // ✅ Extract all emails
    return filteredData.map((user) => user.email);
  }

  return [];
}, [colleaguesData]);

console.log("emails", filteredColleagues);

  const token = localStorage.getItem("token");
  
  let ownerId =JSON.parse(localStorage.getItem("autUser"))?.ownerId;

  // if (token) {
  //   try {
  //     const decoded = jwtDecode(token);
  //     ownerId = decoded?.ownerId;
  //   } catch (err) {
  //     console.error("Invalid token", err);
  //   }
  // }
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
      } else if (filteredColleagues.includes(trimmedEmail)) {
        error = "User cannot have the same email";
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

  // const handleSubmit = async () => {
  //   let hasError = false;
  //   const errors = {
  //     username: "",
  //     email: "",
  //     team:"",
  //   };

  //   if (!formData.username.trim()) {
  //     errors.username = "User Name is required";
  //     hasError = true;
  //   } else if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(formData.username)) {
  //     errors.username =
  //       "Only letters and spaces are allowed. Do not use leading or trailing spaces";
  //     hasError = true;
  //   }

  //   if (!formData.email.trim()) {
  //     errors.email = "Email is required";
  //     hasError = true;
  //   } else if (!isValidEmail(formData.email)) {
  //     errors.email = "Invalid email format";
  //     hasError = true;
  //   }
  //    if (!formData.team) {
  //     errors.team = "Team is required";
  //     hasError = true; // This was missing - now it will prevent submission
  //   }

  //   if (hasError) {
  //     setFormData((prev) => ({ ...prev, errors }));
  //     return;
  //   }
  //   // const
  //   try {
  //     const payload = {
  //       username: formData.username.trim(),
  //       email: formData.email,
  //       team:formData.team,
  //       ownerId,
  //     };

  //     await createProfileApi([payload]).unwrap();
  //     openToaster("Employee Added Successfully!", "success");
  //     setTimeout(() => {
  //       setFormData({
  //         username: "",
  //         email: "",
  //         team:"",
  //         errors: { username: "", email: "" ,team:"" },
  //       });

  //     }, 2000);
  //     // Clear form and errors
  //     setFormData({
  //       username: "",
  //       email: "",
  //       team:"",
  //       errors: {
  //         username: "",
  //         email: "",
  //       team:""
  //       },
  //     });
  //     handleClose();
  //   } catch (error) {
  //   console.error("Error submitting form:", error);
  //   // Check if the error has a response and data property
  //   if (error.data && error.data.error) {
  //     // Display the specific error message from the API in the toaster
  //     openToaster(error.data.error, "error");
  //   } else {
  //     // Display a generic error message if the specific message is not available
  //     openToaster("An error occurred while adding the employee.", "error");
  //   }
  // }
  // };
  
  
    const handleSubmit = async () => {
    let hasError = false;
    const errors = {
      username: "",
      email: "",
      team: "",
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
    } else if (filteredColleagues.includes(formData.email.trim())) {
      errors.email = "User cannot have the same email";
      hasError = true;
    }

    if (!formData.team) {
      errors.team = "Team is required";
      hasError = true;
    }

    if (hasError) {
      setFormData((prev) => ({ ...prev, errors }));
      return;
    }

    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email,
        team: formData.team,
        ownerId,
      };

      await createProfileApi([payload]).unwrap();
      openToaster("Employee Added Successfully!", "success");
      setTimeout(() => {
        setFormData({
          username: "",
          email: "",
          team: "",
          errors: { username: "", email: "", team: "" },
        });
      }, 2000);

      setFormData({
        username: "",
        email: "",
        team: "",
        errors: { username: "", email: "", team: "" },
      });
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.data && error.data.error) {
        openToaster(error.data.error, "error");
      } else {
        openToaster("An error occurred while adding the employee.", "error");
      }
    }
  };

  const handleSelect = (event,name) =>{
    const { value } = event.target;
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
      <DialogTitle sx={{backgroundColor:"#143352",color:"white"}}>Add Employee</DialogTitle>
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
        <Button  onClick={handleClose}            variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            borderColor: "#ccc",
            color: "#666",
            "&:hover": {
              borderColor: "#999",
              backgroundColor: "#f0f0f0",
            },
          }}>
          Cancel
        </Button>
        <CustomButton
        variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            borderColor:"#143351",
            color:"#143351",
            "&:hover": {
              backgroundColor: "#143351",
              color: "white",
            },
          }}
          onClick={handleSubmit}
          disabled={createProfileApiIsLoading}
          loading={createProfileApiIsLoading}
          label="Create"
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeModal;
