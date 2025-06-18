import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import styles from './index.module.css';

const AuthImageSection = () => {
  return (
    <Box className={styles.imageContainer}>
      <Paper elevation={3} className={styles.logoBox}>
        <Typography variant="h6" component="div" align="center">
          LO<br />GO
        </Typography>
      </Paper>

      <Typography variant="body2" className={styles.quote}>
        “Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec bibendum odio a risus feugiat pharetra.”
      </Typography>
    </Box>
  );
};

export default AuthImageSection;
