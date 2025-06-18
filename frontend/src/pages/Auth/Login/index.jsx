import React,{useState } from 'react';
import { Box, Button, Typography, Divider } from '@mui/material';
import styles from './index.module.css';
import ImageSection from '../../../components/AuthImageSection';
import CustomTextField from "../../../components/CustomTextField";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  })
  const handleChange = (e, name) => {
    const { value } = e.target;
    setLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.leftSection}>
        <Box className={styles.formBox}>
          <Typography variant="h5" gutterBottom className={styles.title}>Welcome</Typography>
          <Typography variant="body2" gutterBottom className={styles.subtitle}>Get started for a seamless work tracking experience.</Typography>
          <CustomTextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            startIcon={<EmailIcon />}             value={loginInfo.email}
            handleChange={(e) => handleChange(e, "email")}
            // startIcon={EmailIcon}
          />
          <CustomTextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            startIcon={<LockIcon/>}
            value={loginInfo.password}
            handleChange={(e) => handleChange(e, "password")}
          />

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
