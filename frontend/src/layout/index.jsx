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
        console.log(mobileOpen, "KKKKKKKKKKKKKKKK")
        setMobileOpen(!mobileOpen);
    };
    console.log(mobileOpen, "mobileOpen")


    return (

        <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' ,paddingTop:8}}>
            <Sidebar />
            <Box
            //  sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}
           sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
             >
                <Header />
                {/* <Toolbar /> */}
                <Box component="main" 
                // sx={{ p: 4, height:'100%',width:'100%',backgroundColor: 'gray'}}
                sx={{
                    flexGrow: 1,
                    
                    width: '100% !important',
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
