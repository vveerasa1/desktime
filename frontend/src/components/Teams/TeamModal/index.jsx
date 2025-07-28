import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import React, { useState } from "react";

import { Close as CloseIcon } from "@mui/icons-material";
import CustomTextField from "../../CustomTextField";
import {
  useGetSingleTeamQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
} from "../../../redux/services/team";
import { useEffect } from "react";

const TeamModal = ({ open, handleClose, teamId, ownerId,openToaster }) => {
  const [formData, setFormData] = useState({
    name: "",
    ownerId: ownerId,
    errors: {
      name: "",
    },
  });
  const { data: singleTeamsData, isLoading: singleTeamDataIsLoading } =
    useGetSingleTeamQuery({ id: teamId }, { skip: !teamId });
  const [createTeam, isLoading] = useCreateTeamMutation();
  const [updateTeam] = useUpdateTeamMutation();

  const handleChange = (event, name) => {
    const { value } = event.target;

    let error = "";
    if (name === "name") {
      if (!value.trim()) {
        error = "Team Name is required";
      } else if (!/^[A-Za-z\s]*$/.test(value)) {
        error = "Only letters and spaces allowed";
      }
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        errors: {
          ...prev.errors,
          [name]: "",
        },
      }));
    }
  };
  const handleSubmit = async () => {
    try {
      let hasError = false;
      const errors = {
        username: "",
        email: "",
      };

      if (!formData.name.trim()) {
        errors.name = "User Name is required";
        hasError = true;
      } else if (!/^[A-Za-z]+(?:\s[A-Za-z]+)*$/.test(formData.name)) {
        errors.name =
          "Only letters and spaces allowed, and no leading or trailing spaces";
        hasError = true;
      }

      if (hasError) {
        setFormData((prev) => ({ ...prev, errors }));
        return;
      }
      const payload = {
        name: formData.name,
        ownerId: ownerId,
      };
      if (teamId) {
        await updateTeam({ id: teamId, payload: payload });
        openToaster("Team Updated Successfully!", "success");
      } else {
        await createTeam(payload);
        openToaster("Team Added Successfully!", "success");
        
      }
      setFormData({
          name: "",
        });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  // Reset formData when modal closes
useEffect(() => {
  if (!open) {
    setFormData({
      name: "",
      ownerId: ownerId,
      errors: {
        name: "",
      },
    });
  }
}, [open, ownerId]);

useEffect(() => {
  if (open && teamId && singleTeamsData?.data) {
    setFormData((prev) => ({
      ...prev,
      name: singleTeamsData?.data?.name || "",
      ownerId: ownerId,
      errors: {
        name: "",
      },
    }));
  }
}, [teamId, singleTeamsData, open, ownerId]);


  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '13px', // Rounded corners for the dialog
        },
      }}
    >
      {/* Custom Title Bar */}
      <DialogTitle
        sx={{
          color: "black",
          display: "flex",
          borderBottom: "1px solid #e0e0e0",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1.5,
          px: 2,
        }}
      >
        <Typography variant="h6" component="div" fontWeight="bold">
          {teamId ? "Edit Team" : "  Add new team"}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "common.white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pt: "20px !important", pb: 1 }}>
        <CustomTextField
          label="Team Name"
          name="name"
          value={formData?.name}
          handleChange={(e) => handleChange(e, "name")}
          isRequired
          error={Boolean(formData.errors?.name)}
          helperText={formData.errors?.name}
        />
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"

          
          sx={{
            textTransform: "none",
            borderColor: "grey.400",
            color: "text.primary",
            mr: 1,
            borderRadius: "8px",

          }}
        >
          Close
        </Button>
        <Button
          onClick={handleSubmit}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#143BA0",
              color:"white"
            },
          }}
        >
          {teamId ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamModal;
