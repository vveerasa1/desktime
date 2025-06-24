import React, { useState, useRef } from 'react';
import { Box, Button, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthImageSection from '../../../components/AuthImageSection';
import styles from './index.module.css';

const OtpVerify = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputsRef = useRef([]);

  const handleChange = (element, index) => {
    if (/[^0-9]/.test(element.value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      alert('Please enter the 6-digit OTP');
      return;
    }
    // TODO: Add verify OTP API call here
    alert('OTP Verified: ' + enteredOtp);
    // navigate('/next-route'); // Navigate after successful verification
  };

  const handleResend = () => {
    // TODO: Add resend OTP API call here
    alert('OTP resent');
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.leftSection}>
        <Box className={styles.formBox}>
          <Typography variant="h5" gutterBottom className={styles.title}>
            Verify Your Account
          </Typography>
          <Typography variant="body2" gutterBottom className={styles.subtitle}>
            We&apos;ve sent a 6-digit verification code to your registered email
          </Typography>

          <Typography variant="body2" className={styles.label}>
            OTP
          </Typography>
          <Box className={styles.otpContainer}>
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                name="otp"
                maxLength="1"
                className={styles.otpInput}
                value={data}
                onChange={e => handleChange(e.target, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                ref={el => (inputsRef.current[index] = el)}
                autoComplete="off"
              />
            ))}
          </Box>

          <Button
            variant="contained"
            fullWidth
            className={styles.verifyButton}
            onClick={handleVerify}
          >
            Verify
          </Button>

          <Typography variant="body2" className={styles.resendText}>
            Didn&apos;t receive the code?{' '}
            <Link component="button" onClick={handleResend} className={styles.resendLink}>
              Resend code
            </Link>
          </Typography>
        </Box>
      </Box>

      <AuthImageSection />
    </Box>
  );
};

export default OtpVerify;
