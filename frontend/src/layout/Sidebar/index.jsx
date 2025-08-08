// export default Sidebar;
import { useMemo, useCallback, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Collapse,
  IconButton,
} from "@mui/material";
import {
  MenuOpen as MenuOpenIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventBusy as EventBusyIcon,
  Settings as SettingsIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  Folder as FolderIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import GroupsIcon from '@mui/icons-material/Groups';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Logo from '../../assets/images/logo.png'
import LogoIcon from '../../assets/images/favicon.png'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutConfirmationDialog from "../../pages/Auth/LogoutModal";
import styles from "./index.module.css";

const navItems = [
  { label: "My Tracking", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Team Members", path: "/team-members", icon: <PeopleIcon /> },
  { label: "Colleagues", path: "/colleagues", icon: <AccountCircleIcon /> },
  // { label: "Absence Calendar", path: "/absence-calendar", icon: <EventBusyIcon /> },
  { label: "Offline Times", path: "/offline-times", icon: <EventBusyIcon /> },
  { label: "Projects", path: "/projects", icon: <FolderIcon /> },
  { label: "Teams", path: "/teams", icon: <GroupsIcon /> },
];

const settingsItems = [
  { label: "My Profile", path: "/settings" },
];

const Sidebar = ({ setOpen, setMobileOpen, mobileOpen, isMobile, drawerWidth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleItemClick = useCallback((label, path) => {
    if (path) navigate(path);
    if (isMobile) setMobileOpen(false);
    if (label === "Logout") setOpen(true);
  }, [navigate, isMobile, setMobileOpen, setOpen]);

  const toggleSettings = useCallback(() => {
    setSettingsOpen(!settingsOpen);
  }, [settingsOpen]);

  const isSettingsActive = useMemo(() => 
    location.pathname.startsWith('/settings'), 
    [location.pathname]
  );

  const drawerContent = useMemo(() => (
    <>
      <Toolbar className={styles.toolbar} onClick={() => setMobileOpen(!mobileOpen)}>
        <Box className={!isMobile && mobileOpen ? styles.logoWrapperWeb : styles.logoWrapper}>
          {!isMobile && mobileOpen ? (
            <Box className={styles.brandLogo}>
              <img className={styles.logoImg} src={Logo} alt="TrackMe Logo" />
            </Box>
          ) :
            <Box className={styles.brandLogo}>
              <img className={styles.logoIconImg} src={LogoIcon} alt="TrackMe Logo" />
            </Box>
          }
        </Box>
      </Toolbar>
      <Divider />
      <List className={styles.sidebar}>
        {navItems.map(({ label, path, icon }) => {
          const isActive = path && location.pathname.startsWith(path);
          return (
            <ListItem
              button
              key={label}
              className={`${styles.listItem} ${isActive ? styles.activeItem : ""}`}
              onClick={() => handleItemClick(label, path)}
            >
              <Box mt={0.5} className={styles.iconWrapper}>{icon}</Box>
              {!isMobile && mobileOpen && <ListItemText className={styles.listItemText} primary={label} />}
            </ListItem>
          );
        })}
        
        {/* Settings Dropdown */}
        <ListItem
          button
          className={`${styles.listItem} ${isSettingsActive ? styles.activeItem : ""}`}
          onClick={toggleSettings}
        >
          <Box mt={0.5}className={styles.iconWrapper}><SettingsIcon /></Box>
          {!isMobile && mobileOpen && (
            <>
              <ListItemText className={styles.listItemText} primary="Settings" />
              {settingsOpen ? <ExpandLess /> : <ExpandMore />}
            </>
          )}
        </ListItem>
        <Collapse in={(!isMobile && mobileOpen) && settingsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {settingsItems.map(({ label, path }) => {
              const isActive = path && location.pathname.startsWith(path);
              return (
                <ListItem
                  button
                  key={label}
                  className={`${styles.listItem} ${styles.nestedItem} ${isActive ? styles.activeItem : ""}`}
                  onClick={() => handleItemClick(label, path)}
                >
                  <Box mt={0.5} className={styles.iconWrapper}>
                                {label === "My Profile" ? <PersonOutlineIcon /> : <SettingsIcon />}

                  </Box>
                  {!isMobile && mobileOpen && (
                
                    <ListItemText sx={{width:"160px"}}  className={styles.listItemText} primary={label} />
    
                 
                  )}
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      </List>
    </>
  ), [mobileOpen, isMobile, location.pathname, handleItemClick, setMobileOpen, settingsOpen, toggleSettings, isSettingsActive]);

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={() => setMobileOpen(false)}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: drawerWidth,
        flexShrink: 5,
          transition: "width 0.3s ease-in-out",
        
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#143351",
          borderRadius: "0px 20px 20px 0px !important",
          color: "#fff",
          zIndex: (theme) => theme.zIndex.appBar + 2,
          transition: "width 0.3s ease-in-out",
          overflowX: "hidden",
          top: 0,
          cursor: "pointer",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;