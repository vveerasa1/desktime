import React, { useState } from "react";
import {
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
  Stack,
} from "@mui/material";
import {
  CheckBoxOutlineBlank,
  CheckBoxOutlined,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import CustomDropdown from "../../CustomDropDown";
import CustomTextField from "../../CustomTextField";
import { useCreateProfileMutation } from "../../../redux/services/user";

const roleOptions = [
  { id: "Employee", name: "Employee" },
  { id: "Admin", name: "Admin" },
];

const TeamMembersForm = ({
  open,
  handleClose,
  ownerId,
  formattedTeamOptions,
  refetchTeamMembers,
  openToaster,
  formData,
  setFormData
}) => {
  

  const [createProfile, { isLoading }] = useCreateProfileMutation();

  // Helper to validate a member
  const validateMember = (member) => {
    const errors = {};

    if (!member.username.trim()) errors.username = "Name is required";
    if (!member.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(member.email))
      errors.email = "Invalid email format";

    if (!member.team) errors.team = "Team is required";
    if (!member.role) errors.role = "Role is required";

    return errors;
  };

  const handleAddMember = () => {
    const newId =
      formData.teamMembers.length > 0
        ? Math.max(...formData.teamMembers.map((m) => m.id)) + 1
        : 1;

    setFormData((prev) => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        {
          id: newId,
          username: "",
          email: "",
          team: "",
          role: "",
          touched: {},
          errors: {},
        },
      ],
    }));
  };

  const removeMember = (id) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((m) => m.id !== id),
    }));
  };

  const handleMemberChange = (e, name, memberId) => {
  const { value } = e.target;

  setFormData((prev) => {
    const updatedMembers = prev.teamMembers.map((member) => {
      if (member.id !== memberId) return member;

      const updated = {
        ...member,
        [name]: value,
        touched: { ...member.touched, [name]: true },
      };

      return updated;
    });

    // Check for duplicate emails
    const emailCounts = {};
    updatedMembers.forEach((member) => {
      const email = member.email?.trim().toLowerCase();
      if (email) {
        emailCounts[email] = (emailCounts[email] || 0) + 1;
      }
    });

    const finalMembers = updatedMembers.map((member) => {
      const email = member.email?.trim().toLowerCase();
      const errors = validateMember(member) || {};

      if (email && emailCounts[email] > 1) {
        errors.email = 'This email is already entered';
      }

      return {
        ...member,
        errors,
      };
    });

    return {
      ...prev,
      teamMembers: finalMembers,
    };
  });
};


  const handleBlur = (memberId, field) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member) => {
        if (member.id !== memberId) return member;

        const updated = {
          ...member,
          touched: { ...member.touched, [field]: true },
        };

        updated.errors = validateMember(updated);

        return updated;
      }),
    }));
  };

  const handleSelectAll = (e) => {
    setFormData((prev) => ({
      ...prev,
      selectAll: e.target.checked,
    }));
  };

  const handleSendInvite = (e) => {
    setFormData((prev) => ({
      ...prev,
      sendInvite: e.target.checked,
    }));
  };

  const handleInvite = async () => {
    const updatedMembers = formData.teamMembers.map((member) => {
      const errors = validateMember(member);
      return {
        ...member,
        touched: {
          username: true,
          email: true,
          team: true,
          role: true,
        },
        errors,
      };
    });

    const hasErrors = updatedMembers.some((m) => Object.keys(m.errors).length > 0);

    if (hasErrors) {
      setFormData((prev) => ({
        ...prev,
        teamMembers: updatedMembers,
        submissionError: "Please fix the errors before submitting.",
      }));
      return;
    }

    const payload = updatedMembers.map(({ username, email, team, role }) => ({
      username,
      email,
      team,
      role,
      ownerId,
      sendInvite: formData.sendInvite,
    }));

    try {
      await createProfile(payload).unwrap();
      handleClose();
      openToaster("Team Members Added Sucessfully")
      await refetchTeamMembers();
    } catch (err) {
      setFormData((prev) => ({
        ...prev,
        submissionError: err?.data?.message || "An unexpected error occurred.",
      }));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          maxWidth: "1180px !important",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#143351",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
        }}
      >
        <Typography variant="h6" sx={{ color: "white" }}>
          Add team members
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.selectAll}
              onChange={handleSelectAll}
              icon={<CheckBoxOutlineBlank fontSize="small" />}
              checkedIcon={<CheckBoxOutlined fontSize="small" />}
            />
          }
          label="Select all"
          sx={{ padding:1 }}
        />

        <Stack >
          {formData.teamMembers.map((member) => (
            <Grid mx={3} container mt={3} spacing={3} key={member.id} alignItems="flex-end">
              <Grid item>
                <Checkbox
                  checked={false}
                  icon={<CheckBoxOutlineBlank fontSize="small" />}
                  checkedIcon={<CheckBoxOutlined fontSize="small" />}
                />
              </Grid>
              <Grid item>
                <CustomTextField
                  label="Full name"
                  name="username"
                  value={member.username}
                  handleChange={(e) =>
                    handleMemberChange(e, "username", member.id)
                  }
                  onBlur={() => handleBlur(member.id, "username")}
                  placeholder="Full name"
                  isRequired
                  error={member.touched?.username && member.errors?.username}
                  helperText={
                    member.touched?.username ? member.errors?.username : ""
                  }
                />
              </Grid>
              <Grid item>
                <CustomTextField
                  label="Email"
                  name="email"
                  value={member.email}
                  handleChange={(e) =>
                    handleMemberChange(e, "email", member.id)
                  }
                  onBlur={() => handleBlur(member.id, "email")}
                  placeholder="E-mail"
                  isRequired
                  error={member.touched?.email && member.errors?.email}
                  helperText={
                    member.touched?.email ? member.errors?.email : ""
                  }
                />
              </Grid>
              <Grid item>
                <CustomDropdown
                  label="Team"
                  name="team"
                  selectedValue={member.team}
                  options={formattedTeamOptions}
                  handleSelect={(e) => handleMemberChange(e, "team", member.id)}
                  onBlur={() => handleBlur(member.id, "team")}
                  placeholder="Team"
                  error={member.touched?.team && !!member.errors?.team}
                  helperText={member.touched?.team ? member.errors?.team : ""}
                />
              </Grid>
              <Grid item xs={2}>
                <CustomDropdown
                  label="Role"
                  name="role"
                  selectedValue={member.role}
                  options={roleOptions}
                  handleSelect={(e) => handleMemberChange(e, "role", member.id)}
                  onBlur={() => handleBlur(member.id, "role")}
                  placeholder="Employee"
                  error={member.touched?.role && !!member.errors?.role}
                  helperText={member.touched?.role ? member.errors?.role : ""}
                />
              </Grid>
              {formData.teamMembers.length > 1 && (
                <Grid item mb={1} xs={1}>
                  <IconButton onClick={() => removeMember(member.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          ))}
        </Stack>

        <Box mt={3}>
          <Button
            variant="text"
            startIcon={<AddIcon />}
            onClick={handleAddMember}
            sx={{ textTransform: "none", color: "#143351" }}
          >
            ADD TEAM MEMBER
          </Button>
        </Box>

        {formData.submissionError && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {formData.submissionError}
          </Typography>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.sendInvite}
              onChange={handleSendInvite}
              icon={<CheckBoxOutlineBlank fontSize="small" />}
              checkedIcon={<CheckBoxOutlined fontSize="small" />}
            />
          }
          label="Send invite email to team members"
          sx={{ mt: 3 }}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            color: "#6A6A6A",
            borderColor: "#E8E8E8",
          }}
        >
          Close
        </Button>
        <Button
          onClick={handleInvite}
          variant="contained"
          disabled={isLoading}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            backgroundColor: "#143351",
          }}
        >
          {isLoading ? "Inviting..." : "Invite"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamMembersForm;
