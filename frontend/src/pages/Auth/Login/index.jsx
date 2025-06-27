import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import styles from './index.module.css';
import ImageSection from '../../../components/AuthImageSection';
import CustomTextField from '../../../components/CustomTextField';
import { useLoginMutation } from '../../../redux/services/login';
const Login = () => {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({ email: 'avinesh.r@pentabay.com', password: 'Avinesh@123' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loginApi, { isLoading, isError, error }] = useLoginMutation();
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleChange = (e, name) => {
    const { value } = e.target;

    setLoginInfo((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: value ? '' : `${capitalize(name)} is required`,
    }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const newErrors = {
      email: !loginInfo.email
        ? 'Email is required'
        : !emailRegex.test(loginInfo.email)
          ? 'Enter a valid email'
          : '',
      password: loginInfo.password.trim() ? '' : 'Password is required',
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  };


  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const res = await loginApi(loginInfo).unwrap();
      console.log(res)
      const token = res?.accessToken;

      localStorage.setItem('token', token);
      // if (window.electronAPI && window.electronAPI.sendToken) {
      //   window.electronAPI.sendToken(token);
      // }
      console.error(window.electronAPI,window.electronAPI,'inside the window.electronAPI');

      if (window.electronAPI && window.electronAPI.sendToken) {

        window.electronAPI.sendToken(token);
      }
       navigate('/dashboard');

    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <Box className={styles.container}>
      <Box className={styles.leftSection}>
        <Box className={styles.formBox}>
          <Typography variant="h5" gutterBottom className={styles.title}>
            Welcome
          </Typography>
          <Typography variant="body2" gutterBottom className={styles.subtitle}>
            Get started for a seamless work tracking experience.
          </Typography>

          <CustomTextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            startIcon={<EmailIcon />}
            value={loginInfo.email}
            handleChange={(e) => handleChange(e, 'email')}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />

          <CustomTextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            startIcon={<LockIcon />}
            endIcon={
              showPassword ? (
                <VisibilityOff onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />
              ) : (
                <Visibility onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }} />
              )
            }
            value={loginInfo.password}
            handleChange={(e) => handleChange(e, 'password')}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />

          <Box className={styles.link} onClick={()=>{
            navigate('/forgot-password')
          }}>
            <a href="">Forgot Password?</a>
          </Box>

          <Button
            variant="contained"
            fullWidth
            className={styles.button}
            onClick={handleLogin}
            disabled={isLoading}
            onEndIconClick={togglePasswordVisibility}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Login'
            )}
          </Button>

          {isError && (
            <Typography color="error" variant="body2" mt={1}>
              {error?.data?.message || 'Invalid credentials'}
            </Typography>
          )}

          <Divider className={styles.divider}>OR</Divider>

          <Button variant="outlined" fullWidth className={styles.googleBtn}>
            Google
          </Button>
        </Box>
      </Box>

      <ImageSection />
    </Box>
  );
};

export default Login;
