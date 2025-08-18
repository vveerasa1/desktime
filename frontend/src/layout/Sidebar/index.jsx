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
  IconButton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventBusy as EventBusyIcon,
  Settings as SettingsIcon,
  Folder as FolderIcon,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight,
  Groups as GroupsIcon,
  AccountCircle as AccountCircleIcon,
  PersonOutline as PersonOutlineIcon,
} from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Logo from "../../assets/images/logo.png";
import LogoIcon from "../../assets/images/favicon.png";
import styles from "./index.module.css";
import { jwtDecode } from "jwt-decode";

const Sidebar = ({
  setOpen,
  setMobileOpen,
  mobileOpen,
  isMobile,
  drawerWidth,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  let userRole = null;
  if (token) {
    const decoded = jwtDecode(token);
    userRole = decoded?.role;
  }

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hoverEnabled, setHoverEnabled] = useState(false); // Hover is now disabled by default
  const hoverTimeoutRef = useRef(null);
  const clickTimeoutRef = useRef(null);

  useEffect(() => {
    // This ensures the sidebar is open on the initial render
    setMobileOpen(true);

    // Cleanup timeouts on component unmount
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [setMobileOpen]);

  const navItems = [
    { label: "My Tracking", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "Team Members", path: "/team-members", icon: <PeopleIcon /> },
    { label: "Colleagues", path: "/colleagues", icon: <AccountCircleIcon /> },
    { label: "Projects", path: "/projects", icon: <FolderIcon /> },
    ...(userRole === "Admin" || userRole === "Owner"
      ? [
          {
            label: "Offline Times",
            path: "/offline-times",
            icon: <EventBusyIcon />,
          },
        ]
      : []),
    { label: "Teams", path: "/teams", icon: <GroupsIcon /> },
  ];

  const settingsItems = [
    { label: "My Profile", path: "/settings" },
    { label: "Billing", path: "/billings" },
  ];

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

  const toggleSidebar = useCallback(() => {
    // Clear any pending hover timeouts immediately
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Toggle the sidebar state
    setMobileOpen(!mobileOpen);

    // Toggle the hoverEnabled state
    setHoverEnabled(!hoverEnabled);

    // This part ensures a smooth transition and prevents glitches
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      setHoverEnabled(!hoverEnabled);
    }, 400);
  }, [mobileOpen, setMobileOpen, hoverEnabled]);

  const handleMouseEnter = useCallback(() => {
    if (!isMobile && !mobileOpen && hoverEnabled) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setMobileOpen(true);
      }, 1000); // 1-second delay for hover
    }
  }, [isMobile, mobileOpen, hoverEnabled, setMobileOpen]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (!isMobile && mobileOpen && hoverEnabled) {
      setMobileOpen(false);
    }
  }, [isMobile, mobileOpen, hoverEnabled, setMobileOpen]);

  const isSettingsActive = useMemo(
    () => location.pathname.startsWith("/settings"),
    [location.pathname]
  );

  const drawerContent = useMemo(
    () => (
      <>
        <Toolbar className={styles.toolbar}>
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
                  >
                    <Box mt={0.5} className={styles.iconWrapper}>
                      <Box mt={0.5} className={styles.iconWrapper}>
                        {label === "My Profile" ? (
                          <PersonOutlineIcon />
                        ) : label === "Billing" ? (
                          <AttachMoneyIcon />
                        ) : (
                          <SettingsIcon />
                        )}
                      </Box>
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
      settingsOpen,
      toggleSettings,
      isSettingsActive,
      navItems,
      settingsItems,
    ]
  );

  return (
    <Box
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
          [`& .MuiDrawer-paper`]: {
            width: mobileOpen ? drawerWidth : "72px",
            boxSizing: "border-box",
            backgroundColor: "#143351",
            borderRadius: "0px 20px 20px 0px !important",
            color: "#fff",
            zIndex: (theme) => theme.zIndex.appBar + 2,
            transition: "width 0.3s ease-in-out",
            overflowX: "hidden",
            top: 0,
          },
        }}
      >
        {drawerContent}
        {!isMobile && (
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "fixed",
            // Position the button exactly at the sidebar's edge, minus half its width
            left: mobileOpen ? `${drawerWidth - 12}px` : "60px",
            zIndex: 1301,
            backgroundColor: "#143351",
            color: "white",
            borderRadius: "0 30px 30px 0",
            width: "26px",
            marginTop:"14px",
            transition: "left 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "#1a446b",
            },
          }}
        >
          {mobileOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      )}
      </Drawer>

      
    </Box>
  );
};

export default Sidebar;
