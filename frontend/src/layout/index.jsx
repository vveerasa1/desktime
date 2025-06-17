// src/components/layout/AppLayout.jsx
import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { Toolbar } from '@mui/material';
const AppLayout = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width:900px)');
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    console.log(mobileOpen, "mobileOpen")


    return (

        <Box sx={{ display: 'flex', width: '100%'}}>
            <Sidebar />
            <Box
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh'  }}
            >
                <Header />
                <Toolbar />
                <Box component="main"
                    sx={{
                        flexGrow: 1,
                        px: 3,
                        py: 2,
                        backgroundColor: '#f9f9f9',
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>

    );
};

export default AppLayout;
