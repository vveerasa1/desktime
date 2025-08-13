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
import { useSelector } from 'react-redux';
import { useResetPasswordMutation } from '../../../redux/services/auth';
const ResetPassword = () => {
    const email = useSelector((state) => state.authFlow.email);
    const [resetPassword] = useResetPasswordMutation();
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({ newPassword: '',confirmPassword:"" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ newPassword: '',confirmPassword:'' });
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

    const newErrors = {
      newPassword: loginInfo.newPassword.trim() ? '' : 'Password is required',
      confirmPassword: loginInfo.confirmPassword.trim() ? '' : 'Confirm Password is required',

    };

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  };


  const handleLogin = async () => {
    if (!validateForm()) return;

    try { 
      const payload = {
        newPassword:loginInfo.newPassword,
        confirmPassword:loginInfo.confirmPassword,
        email:email
      }
      await resetPassword(payload).unwrap();
      navigate('/');
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
          Reset Your Password
                    </Typography>
          <Typography variant="body2" gutterBottom className={styles.subtitle}>
          Create a new password for your account.
          </Typography>
          <CustomTextField
            label="New Password"
            name="newPassword"
            type="email"
            fullWidth
            startIcon={<EmailIcon />}
            value={loginInfo.newPassword}
            handleChange={(e) => handleChange(e, 'newPassword')}
            error={Boolean(errors.newPassword)}
            helperText={errors.newPassword}
          />
          <CustomTextField
            label="Confirm Password"
            name="confirmPassword"
            type="email"
            fullWidth
            startIcon={<EmailIcon />}
            value={loginInfo.confirmPassword}
            handleChange={(e) => handleChange(e, 'confirmPassword')}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
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

export default ResetPassword;
