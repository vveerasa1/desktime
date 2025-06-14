// src/components/layout/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import styles from './index.module.css';

const Header = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#fff', color: '#000' }}>
      <Toolbar className={styles.toolbar}>
        <Typography variant="h6" noWrap component="div">
          DeskTime
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
