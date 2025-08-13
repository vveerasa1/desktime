import { useMemo, useCallback, useState, useEffect, useRef } from "react";
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
import GroupsIcon from "@mui/icons-material/Groups";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logo from "../../assets/images/logo.png";
import LogoIcon from "../../assets/images/favicon.png";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import styles from "./index.module.css";

const navItems = [
  { label: "My Tracking", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Team Members", path: "/team-members", icon: <PeopleIcon /> },
  { label: "Colleagues", path: "/colleagues", icon: <AccountCircleIcon /> },
  { label: "Offline Times", path: "/offline-times", icon: <EventBusyIcon /> },
  { label: "Projects", path: "/projects", icon: <FolderIcon /> },
  { label: "Teams", path: "/teams", icon: <GroupsIcon /> },
];

const settingsItems = [{ label: "My Profile", path: "/settings" }];

const Sidebar = ({
  setOpen,
  setMobileOpen,
  mobileOpen,
  isMobile,
  drawerWidth,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const sidebarRef = useRef(null);

  const handleMouseEnter = () => {
    if (!isMobile) {
      clearTimeout(hoverTimeoutRef.current);
      setMobileOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      hoverTimeoutRef.current = setTimeout(() => {
        setMobileOpen(false);
      }, 50); 
    }
  };

  const handleItemClick = useCallback(
    (label, path) => {
      if (path) navigate(path);
      if (isMobile) setMobileOpen(false);
      if (label === "Logout") setOpen(true);
    },
    [navigate, isMobile, setMobileOpen, setOpen]
  );

  const toggleSettings = useCallback(() => {
    setSettingsOpen(!settingsOpen);
  }, [settingsOpen]);

  const isSettingsActive = useMemo(
    () => location.pathname.startsWith("/settings"),
    [location.pathname]
  );

  useEffect(() => {
    return () => {
      clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const drawerContent = useMemo(
    () => (
      <>
        <Toolbar
          className={styles.toolbar}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Box
            className={
              !isMobile && mobileOpen
                ? styles.logoWrapperWeb
                : styles.logoWrapper
            }
          >
            {!isMobile && mobileOpen ? (
              <Box className={styles.brandLogo}>
                <img className={styles.logoImg} src={Logo} alt="TrackMe Logo" />
              </Box>
            ) : (
              <Box className={styles.brandLogo}>
                <img
                  className={styles.logoIconImg}
                  src={LogoIcon}
                  alt="TrackMe Logo"
                />
              </Box>
            )}
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
                className={`${styles.listItem} ${
                  isActive ? styles.activeItem : ""
                }`}
                onClick={() => handleItemClick(label, path)}
                onMouseEnter={() => !isMobile && setMobileOpen(true)}
              >
                <Box mt={0.5} className={styles.iconWrapper}>
                  {icon}
                </Box>
                {!isMobile && mobileOpen && (
                  <ListItemText
                    className={styles.listItemText}
                    primary={label}
                  />
                )}
              </ListItem>
            );
          })}

          <ListItem
            button
            className={`${styles.listItem} ${
              isSettingsActive ? styles.activeItem : ""
            }`}
            onClick={toggleSettings}
            onMouseEnter={() => !isMobile && setMobileOpen(true)}
          >
            <Box mt={0.5} className={styles.iconWrapper}>
              <SettingsIcon />
            </Box>
            {!isMobile && mobileOpen && (
              <>
                <ListItemText
                  className={styles.listItemText}
                  primary="Settings"
                />
                {settingsOpen ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItem>
          <Collapse
            in={!isMobile && mobileOpen && settingsOpen}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              {settingsItems.map(({ label, path }) => {
                const isActive = path && location.pathname.startsWith(path);
                return (
                  <ListItem
                    button
                    key={label}
                    className={`${styles.listItem} ${styles.nestedItem} ${
                      isActive ? styles.activeItem : ""
                    }`}
                    onClick={() => handleItemClick(label, path)}
                    onMouseEnter={() => !isMobile && setMobileOpen(true)}
                  >
                    <Box mt={0.5} className={styles.iconWrapper}>
                      {label === "My Profile" ? (
                        <PersonOutlineIcon />
                      ) : (
                        <SettingsIcon />
                      )}
                    </Box>
                    {!isMobile && mobileOpen && (
                      <ListItemText
                        sx={{ width: "160px" }}
                        className={styles.listItemText}
                        primary={label}
                      />
                    )}
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </List>
      </>
    ),
    [
      mobileOpen,
      isMobile,
      location.pathname,
      handleItemClick,
      setMobileOpen,
      settingsOpen,
      toggleSettings,
      isSettingsActive,
    ]
  );

  return (
    <Box
      ref={sidebarRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        position: "relative",
        height: "100vh",
        width: mobileOpen ? drawerWidth : "72px",
        transition: "width 0.3s ease-in-out",
      }}
    >
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
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
    </Box>
  );
};

export default Sidebar;