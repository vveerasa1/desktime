// // src/components/layout/Header.jsx
// import React from 'react';
// import { AppBar, Toolbar, IconButton, Typography, useMediaQuery } from '@mui/material';
// import MenuOpenIcon from '@mui/icons-material/MenuOpen';
// import { useTheme } from '@mui/material/styles';

// const Header = ({ onMenuClick }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   return (
//     <AppBar position="fixed" sx={{ backgroundColor: '#fff', color: '#000' }}>
//       {/* <Toolbar>

//         <Typography
//           variant="h6"
//           noWrap
//           component="div"
//           onClick={onMenuClick} // Optional: Also toggle on logo click
//           sx={{ cursor: 'pointer' }}
//         >
//           DeskTime
//         </Typography>
//       </Toolbar> */}
//     </AppBar>
//   );
// };

// export default Header;
import React from 'react';
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

const Header = () => {
  return (
    <AppBar
      // position="fixed"
      elevation={0}
      sx={{
        backgroundColor: '#fff',
        color: '#000',
        // zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: '1px solid #e0e0e0',
        // left: '240px'

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
            <Typography variant="subtitle2">Vineetha Yenugula</Typography>
            <Typography variant="caption" color="text.secondary">
              Pentabay Softwares
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: 'green' }}>V</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
