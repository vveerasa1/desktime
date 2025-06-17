import React from 'react';
import { CircularProgress, Box } from '@mui/material';
import styles from './index.module.css';

const LoadingComponent = () => {
  return (
    <Box className={styles.loaderContainer}>
      <CircularProgress thickness={6} className={styles.loader} />
    </Box>
  );
};

export default LoadingComponent;
