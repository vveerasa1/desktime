import { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';

import styles from './index.module.css';
import ImageSection from '../../../components/AuthImageSection';
import CustomTextField from '../../../components/CustomTextField';
import { useLoginMutation } from '../../../redux/services/login';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({ email: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const [loginApi, { isLoading, isError, error }] = useLoginMutation();

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const capitalize = useCallback((str) => str.charAt(0).toUpperCase() + str.slice(1), []);

  const handleChange = useCallback((e, name) => {
    const { value } = e.target;

    setLoginInfo((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: value ? '' : `${capitalize(name)} is required`,
    }));
  }, [capitalize]);

  const validateForm = useCallback(() => {
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
  }, [loginInfo, emailRegex]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    try {


      // navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  }, [validateForm, loginInfo, loginApi]);

  return (
  
    <Box className={styles.container}>
      <Box className={styles.imageContainer}
      />
      <Box className={styles.leftSection}>
        <Box className={styles.formBox}>
          <Typography variant="h5" className={styles.title}>
            Forgot Your Password?
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            Enter your registered email, and we’ll send you a password
            reset link or OTP.
          </Typography>

          <Box className={styles.field}>
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
          </Box>

          <Button
            variant="contained"
            fullWidth
            className={styles.button}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Continue"
            )}
          </Button>

          <Box className={styles.resetLink}>
            <a className={styles.link} href="#">
              Send resend link.
            </a>
          </Box>

          {isError && (
            <Typography color="error" variant="body2" mt={1}>
              {error?.data?.message || "Invalid credentials"}
            </Typography>
          )}

        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
