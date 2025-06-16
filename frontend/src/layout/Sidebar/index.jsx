// src/components/layout/Sidebar.jsx
import React from 'react';
import { Drawer, List, ListItem, ListItemText, Toolbar, Box, Typography  } from '@mui/material';
import { useNavigate, useLocation} from 'react-router-dom';
import styles from './index.module.css';

const drawerWidth = 240;
const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const navItems = [
        'My DeskTime',
        'Colleagues',
        'Projects',
        'Work Schedules',
        'Absence Calendar',
        'Reports',
        'Exports',
        'Settings',
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#20252b',
                    color: '#fff',
                },
            }}
        >
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/logo192.png" alt="DeskTime Logo" width={30} height={30} style={{ marginRight: 8 }} />
                    <Typography variant="h6">DeskTime</Typography>
                </Box>
            </Toolbar>
            <List className={styles.sidebar}>
                {navItems.map((text) => {
                    const path = `/${text.toLowerCase().replace(/\s/g, '-')}`;
                    const selected = location.pathname === path;

                    return (
                        <ListItem
                            button
                            key={text}
                            onClick={() => navigate(path)}
                            className={selected ? styles.activeItem : ''}
                        >
                            <ListItemText primary={text} />
                        </ListItem>
                    );
                })}
            </List>
        </Drawer>
    );
};

export default Sidebar; 