import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SettingsIcon from "@mui/icons-material/Settings";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import styles from "./index.module.css";
import LogoutConfirmationDialog from "../../pages/Auth/LogoutModal";

const navItems = [
  { label: "My DeskTime", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Colleagues", path: "/colleagues", icon: <PeopleIcon /> },
  // { label: 'Projects', path: '/projects', icon: <AssignmentIcon /> },
  // { label: 'Work Schedules', path: '/work-schedules', icon: <CalendarMonthIcon /> },
  {
    label: "Absence Calendar",
    path: "/absence-calendar",
    icon: <EventBusyIcon />,
  },
  // { label: 'Reports', path: '/reports', icon: <AssessmentIcon /> },
  // { label: 'Exports', path: '/exports', icon: <FileDownloadIcon /> },
  { label: "Settings", path: "/settings", icon: <SettingsIcon /> },
  { label: "Logout", icon: <PowerSettingsNewIcon /> },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:900px)");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open,setOpen] = useState(false)
  const drawerWidth = mobileOpen || isMobile ? 240 : 72;
const handleCloseDialog =() =>{
  setOpen(false)
}
  const drawerContent = (
    <>
      <Toolbar
        sx={{ cursor: "pointer", px: 2 }}
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <MenuOpenIcon />
          {!mobileOpen || isMobile ? null : (
            <Typography variant="h6" sx={{ ml: 1 }}>
              DeskTime
            </Typography>
          )}
        </Box>
      </Toolbar>
      <Divider />
      <List className={styles.sidebar}>
        {navItems.map(({ label, path, icon }) => {
          const selected = location.pathname === path;
          return (
            <ListItem
              button
              key={label}
              className={selected ? styles.activeItem : ""}

              onClick={() => {
                navigate(path);
                if (isMobile) setMobileOpen(false);
                if(label === 'Logout'){
                  setOpen(true)
                }
              }}
              // className={selected ? styles.activeItem : ""}
              sx={{ gap: 1 }}
            >
              <Box sx={{
              }}>
                <Box
                  className={styles.menuIcon}
                  component="span"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  {icon}
                </Box>
              </Box>

              {!isMobile && mobileOpen && <ListItemText primary={label} />}
            </ListItem>
          );
        })}
      </List>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={() => setMobileOpen(false)}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#143351",
              borderRadius: '0px 20px 20px 0px !important',
          color: "#fff",
          zIndex: (theme) => theme.zIndex.appBar + 2, // keep it below header
          //   pt: 8, // pushes content below header height (64px)
          transition: "width 0.3s ease-in-out",
          overflowX: "hidden",
          top: "0px",
        },
      }}
    >
      {drawerContent}
      <LogoutConfirmationDialog open={open} setOpen={setOpen} handleCloseDialog={handleCloseDialog}/>
    </Drawer>
  );
};

export default Sidebar;
