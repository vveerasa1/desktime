import React, { useState } from "react";
import {
  Select,
  MenuItem,
  Typography,
  Box,
  FormControl,
  FormHelperText,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  CheckBoxOutlineBlank,
  CheckBoxOutlined,
  HelpOutline,
} from "@mui/icons-material";
import CustomDropdown from "../../CustomDropDown";
import CustomTextField from "../../CustomTextField";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

// --- Main App Component ---

const initialTeamMember = {
  id: 1,
  fullName: "",
  email: "",
  team: "",
  role: "",
};

const teamOptions = [
  { id: "1", name: "Without team" },
  { id: "2", name: "Engineering" },
  { id: "3", name: "Marketing" },
  { id: "4", name: "Sales" },
];

const roleOptions = [
  { id: "1", name: "Employee" },
  { id: "2", name: "Admin" },
  { id: "3", name: "Manager" },
];

const TeamMembersForm = ({ open, handleClose }) => {
  const [teamMembers, setTeamMembers] = useState([initialTeamMember]);
  const [selectAll, setSelectAll] = useState(false);
  const [sendInvite, setSendInvite] = useState(false);

  const handleAddMember = () => {
    const newId = teamMembers.length + 1;
    setTeamMembers([...teamMembers, { ...initialTeamMember, id: newId }]);
  };
  const removeMember = (id) => {
    setTeamMembers((prev) => prev.filter((member) => member.id !== id));
  };
  const handleInputChange = (event, name, memberId) => {
    const { value } = event.target;
    setTeamMembers(
      teamMembers.map((member) =>
        member.id === memberId ? { ...member, [name]: value } : member
      )
    );
  };

  const handleSelectChange = (event, name, memberId) => {
    const { value } = event.target;
    setTeamMembers(
      teamMembers.map((member) =>
        member.id === memberId ? { ...member, [name]: value } : member
      )
    );
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
  };

  const handleSendInvite = (event) => {
    setSendInvite(event.target.checked);
  };

  return (
    <Box sx={{ bgcolor: "#f4f4f4" }}>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        // maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            maxWidth:"925px !important",

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
        <DialogContent  >
          {/* Form Rows */}
          <FormControlLabel 
            control={
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAll}
                icon={<CheckBoxOutlineBlank fontSize="small" />}
                checkedIcon={<CheckBoxOutlined fontSize="small" />}
              />
            }
            label="Select all"
             sx={{ padding:1 }}
          />

          <Stack>
            {teamMembers?.map((member) => (
              <Grid container spacing={1} key={member.id} alignItems="flex-end">
                <Grid item sx={{  paddingBottom: '10px !important'}}>
                  <Checkbox
                    checked={false}
                    icon={<CheckBoxOutlineBlank fontSize="small" />}
                    checkedIcon={<CheckBoxOutlined fontSize="small" />}
                  />
                </Grid>
                <Grid item >
                  <CustomTextField
                    label="Full name"
                    name="fullName"
                    value={member.fullName}
                    handleChange={(e) =>
                      handleInputChange(e, "fullName", member.id)
                    }
                    placeholder="Full name"
                    isRequired={true}
                  />
                </Grid>
                <Grid item >
                  <CustomTextField
                    label="Email"
                    name="email"
                    value={member.email}
                    handleChange={(e) =>
                      handleInputChange(e, "email", member.id)
                    }
                    placeholder="E-mail"
                    isRequired={true}
                  />
                </Grid>
                <Grid item >
                  <CustomDropdown
                    label="Team"
                    name="team"
                    selectedValue={member.team}
                    options={teamOptions}
                    handleSelect={(e) =>
                      handleSelectChange(e, "team", member.id)
                    }
                    placeholder="Without team"
                  />
                </Grid>
                <Grid item xs={2}>
                  <CustomDropdown
                    label="Role"
                    name="role"
                    selectedValue={member.role}
                    options={roleOptions}
                    handleSelect={(e) =>
                      handleSelectChange(e, "role", member.id)
                    }
                    placeholder="Employee"
                  />
                </Grid>
                {teamMembers.length > 1 && (
                  <Grid item xs={1}>
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

          <FormControlLabel
            control={
              <Checkbox
                checked={sendInvite}
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
            onClick={handleClose}
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              backgroundColor: "#143351",
            }}
          >
            Invite
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamMembersForm;
