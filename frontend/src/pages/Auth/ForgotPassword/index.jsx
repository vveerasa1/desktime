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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({ email: 'akash@gmail.com', password: 'Akash21@' });
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
      console.error(window.electronAPI, window.electronAPI, 'inside the window.electronAPI');

      if (window.electronAPI && window.electronAPI.sendToken) {

        window.electronAPI.sendToken(token);
      }
      // navigate('/dashboard');
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
            Forgot Your Password?
          </Typography>
          <Typography variant="body2" gutterBottom className={styles.subtitle}>
            Enter your registered email, and we’ll send you a password reset link or OTP.          </Typography>

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
              'Continue'
            )}
          </Button>

          {isError && (
            <Typography color="error" variant="body2" mt={1}>
              {error?.data?.message || 'Invalid credentials'}
            </Typography>
          )}

          <Divider className={styles.divider}>OR</Divider>
          <Button
            variant="contained"
            fullWidth
            className={styles.button}
            onClick={handleLogin}
            disabled={isLoading}
            onEndIconClick={togglePasswordVisibility}
            sx={{
              backgroundColor: "white",
              color: '#1976d2'
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Send reset link.'
            )}
          </Button>
        </Box>
      </Box>

      <ImageSection />
    </Box>
  );
};

export default ForgotPassword;
