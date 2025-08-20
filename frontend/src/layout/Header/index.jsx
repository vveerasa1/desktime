// src/components/layout/Header.jsx
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useCallback } from "react";
import { useState } from "react";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import NotificationsIcon from "@mui/icons-material/Notifications";

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { jwtDecode } from "jwt-decode";
import { useGetSingleProfileQuery, useRefreshTokenMutation } from '../../redux/services/user';
import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import LogoutConfirmationDialog from "../../pages/Auth/LogoutModal";
import LoadingComponent from "../../components/ComponentLoader";
import { useLayoutEffect } from "react";
const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState();
  const autUser = JSON.parse(localStorage.getItem("autUser"));
  let userId = null;
  const auth = useAuth();
  if (autUser) {
    try {
      // const decoded = jwtDecode(token);
      userId = autUser?._id;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }
  const [refreshTokenApi] = useRefreshTokenMutation()

  const {
    data: currentUserProfile,
    isLoading,
    isError,
  } = useGetSingleProfileQuery(userId, {
    skip: !userId,
  });
  const username = (currentUserProfile)?.data?.username || "Guest";
  const avatarLetter = username ? username.charAt(0).toUpperCase() : '?';
  useLayoutEffect(() => {
    console.log("Dashboard Datalayout effect");
    const refreshUserToken = async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }
          await refreshTokenApi({ refreshToken: refreshToken }).unwrap().then(() => {
            console.log("Token refreshed successfully");
          }).catch((error) => {
            console.error("Error refreshing token:", error);
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = `https://us-east-16ivaal8x0.auth.us-east-1.amazoncognito.com/logout?client_id=4ddoerjll2aonqd8srp8rljt9&logout_uri=${encodeURIComponent("http://localhost:5173")}`;
            dispatch(addUserInfo({})); // Clear user info in Redux
            navigate('/');
          })
          // localStorage.setItem("token", user.id_token); // Store new token in local storage
        } catch (error) {
        console.log("Error refreshing token:", error);
        }
      }
    };

    refreshUserToken();
  }, []);
  useEffect(() => {
    console.log('auth', auth);
    if (!auth.isLoading && !auth.isAuthenticated) {
      console.log('auth', auth);
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
      const logoutUri = encodeURIComponent("http://localhost:5173");
      window.location.href = `https://us-east-16ivaal8x0.auth.us-east-1.amazoncognito.com/logout?client_id=4o3gl6qqe1i5uapeitu56p3lst&logout_uri=${logoutUri}`;
    }
    navigate('/dashboard');
  }, [auth.isLoading, auth.isAuthenticated]);

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseDialog = useCallback(() => {
    setOpen(false);
  }, [setOpen]);
  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        borderBottom: "1px solid #e0e0e0",
        cursor: "pointer",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        {/* Chat Icon */}

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box mt={0.3}>
            <Tooltip title="Messages">
              <IconButton>
                <ChatBubbleIcon sx={{ color: "#143351" }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip title="Notifications">
              <IconButton>
                <NotificationsIcon sx={{ color: "#143351" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* User Info */}
        <Box onClick={handleClick} display="flex" alignItems="center" gap={0}>
          <Box textAlign="right">
            {isLoading ? (
              <Typography variant="subtitle2">
                <LoadingComponent />
              </Typography>
            ) : isError ? (
              <Typography variant="subtitle2" color="error">
                Error
              </Typography>
            ) : (
              <Typography mt={1} mb={-1} variant="subtitle2">
                {username}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Pentabay Softwares
            </Typography>
          </Box>
          <IconButton onClick={handleClick}>
            <Avatar sx={{ bgcolor: "#143351" }}>{avatarLetter}</Avatar>
          </IconButton>
        </Box>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => navigate("/settings")}>
            <Typography>Profile</Typography>
          </MenuItem>
          {/* 
          <MenuItem onClick={handleClose}>
            <Typography>Contact us</Typography>
          </MenuItem> */}
          {/* <Divider />
          <MenuItem onClick={handleClose}>
            <Typography>Launch DeskTime app</Typography>
          </MenuItem> */}
          <MenuItem onClick={() => setOpen(true)}>
            <Typography color="error">Log out</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
      <LogoutConfirmationDialog
        userId={userId}
        open={open}
        setOpen={setOpen}
        handleCloseDialog={handleCloseDialog}
      />
    </AppBar>
  );
};

export default Header;
