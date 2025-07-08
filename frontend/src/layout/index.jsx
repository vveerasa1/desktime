// src/components/layout/AppLayout.jsx
import React, { useState, useEffect } from "react";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Toolbar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const AppLayout = () => {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:900px)");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const drawerWidth = mobileOpen || isMobile ? 240 : 72;
  return (
    <Box sx={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      <Grid sx={{ width: drawerWidth }}>
        <Sidebar
          open={open}
          setOpen={setOpen}
          setMobileOpen={setMobileOpen}
          mobileOpen={mobileOpen}
          isMobile={isMobile}
          drawerWidth={drawerWidth}
        />
      </Grid>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        //   mt: 3,
          //   ml: `${drawerWidth}px`, // Add margin-left based on sidebar
          width: `calc(100% - ${drawerWidth}px)`,
          transition: "all 0.3s ease-in-out",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
        <Box
          sx={{
            px: 3,
            py: 10,
            flex: 1,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
