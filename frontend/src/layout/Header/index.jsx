// src/components/layout/Header.jsx
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import {jwtDecode} from "jwt-decode";
import { useGetSingleProfileQuery } from '../../redux/services/user'; 
import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const token = localStorage.getItem('token');
  console.log(token,"CHECKING FOR TOKEN")
  let userId = null;
  const auth = useAuth();
  const navigate=useNavigate()
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded?.userId || decoded?.sub; 
    } catch (err) {
      console.error("Invalid token", err);
    }
  } 

  console.log(userId,"CHECKING FOR USER ID")
  const { data: currentUserProfile, isLoading, isError } =
    useGetSingleProfileQuery(userId, {
      skip: !userId
    });

  const username = currentUserProfile?.data?.username || "Guest";
  const avatarLetter = username ? username.charAt(0).toUpperCase() : '?';
  useEffect(() => {
    console.log('auth', auth);
    // auth.signoutPopup();

    if (!auth.isLoading && !auth.isAuthenticated) {
      console.log('auth', auth);
      navigate('/')
    }
    if (auth.isAuthenticated) {
      // console.log(auth.user?.profile?.sub);
      // localStorage.setItem('token', auth.user.access_token);
      // localStorage.setItem("authUser", auth.user?.profile);

      const groups = auth.user?.profile?.["cognito:groups"] || [];
      if (groups.includes("hrmsAccess")) {
        navigate('/dashboard');
      } else {
        navigate('/subscribe-trackme');
      }
    }
  }, [auth.isLoading, auth.isAuthenticated]);
  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: '#fff',
        color: '#000',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {/* Chat Icon */}
        <Tooltip title="Messages">
          <IconButton>
            <ChatBubbleOutlineIcon />
          </IconButton>
        </Tooltip>

        {/* Notification Icon */}
        <Tooltip title="Notifications">
          <IconButton>
            <NotificationsNoneIcon />
          </IconButton>
        </Tooltip>

        {/* User Info */}
        <Box display="flex" alignItems="center" gap={1}>
          <Box textAlign="right">
            {isLoading ? (
              <Typography variant="subtitle2">Loading...</Typography>
            ) : isError ? (
              <Typography variant="subtitle2" color="error">Error</Typography>
            ) : (
              <Typography variant="subtitle2">{username}</Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Pentabay Softwares
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: 'green' }}>{avatarLetter}</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;