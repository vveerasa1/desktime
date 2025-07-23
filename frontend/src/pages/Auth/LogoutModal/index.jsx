import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import { useAuth } from 'react-oidc-context';

import { useLogoutSessionMutation } from "../../../redux/services/electron";
const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "12px",
        },
      },
    },
  },
});

const LogoutConfirmationDialog = ({ open, setOpen, handleCloseDialog }) => {
 const userId =  localStorage.getItem('userId')
  const navigate = useNavigate();
   const auth = useAuth();

 

  const [logoutApi, { isLoading, isError, error }] = useLogoutSessionMutation();
  const handleConfirmLogout = () => {
    logoutApi({userId});
    localStorage.clear();
    auth.signoutRedirect(); // This will redirect to Cognito's logout and return to your app
    navigate("/", { replace: true });
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Dialog
          open={open}
          onClose={handleCloseDialog}
          aria-labelledby="logout-dialog-title"
          aria-describedby="logout-dialog-description"
        >
          <DialogTitle id="logout-dialog-title" sx={{ fontWeight: "bold" }}>
            {"Confirm Logout"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="logout-dialog-description">
              Are you sure you want to log out? This will clear your session.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              color="primary"
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                color: "#6b7280",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              No
            </Button>
            <Button
              onClick={handleConfirmLogout}
              color="primary"
              variant="contained"
              autoFocus
              sx={{
                backgroundColor: "#ef4444",
                "&:hover": {
                  backgroundColor: "#dc2626",
                },
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default LogoutConfirmationDialog;
