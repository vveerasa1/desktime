import React, { useState } from "react";
import { Box, Button, Modal, Typography, IconButton } from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import CustomTextField from "../../../components/CustomTextField";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const ChangePasswordModal = ({ open, setOpen }) => {
  const [authData, setAuthData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
   setAuthData({
    currentPassword: "",
    newPassword: "",
   })
  };

  const handleChange = (e, name) => {
    const { value } = e.target;
    setAuthData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        currentPassword: authData.currentPassword,
        newPassword: authData.newPassword,
      };
      const response = await axios.post("https://httpbin.org/post", payload);
      handleClose();
    } catch (error) {
      console.log(error, "AUTH ERROR");
    }
    // Add API call here
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Change Password</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box mt={2} display="flex" flexDirection="column" gap={2}>
          <CustomTextField
            label="Current Password"
            name="currentPassword"
            type="password"
            fullWidth
            value={authData.currentPassword}
            handleChange={(e) => handleChange(e, "currentPassword")}
          />
          <CustomTextField
            label="New Password"
            name="newPassword"
            type="password"
            fullWidth
            value={authData.newPassword}
            handleChange={(e) => handleChange(e, "newPassword")}
          />
          <Box display="flex" justifyContent="end" gap={2}>
            <Box>
              <Button
                variant="contained"
                color="white"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ChangePasswordModal;
