import React from 'react';
import { Box, TextField, Button, Typography, Divider } from '@mui/material';
import styles from './index.module.css';
import ImageSection from '../../../components/AuthImageSection';

const Login = () => {
  return (
    <Box className={styles.container}>
      <Box className={styles.leftSection}>
        <Box className={styles.formBox}>
          <Typography variant="h5" gutterBottom className={styles.title}>Welcome</Typography>
          <Typography variant="body2" gutterBottom className={styles.subtitle}>Get started for a seamless work tracking experience.</Typography>
          <TextField fullWidth label="Email" margin="normal" />
          <TextField fullWidth label="Password" type="password" margin="normal" />
          <Box className={styles.link}><a href="#">Forgot Password?</a></Box>
          <Button variant="contained" fullWidth className={styles.button}>Login</Button>
          <Divider className={styles.divider}>OR</Divider>
          <Button variant="outlined" fullWidth className={styles.googleBtn}>Google</Button>
        </Box>
      </Box>
      <ImageSection />
    </Box>
  );
};

export default Login;
