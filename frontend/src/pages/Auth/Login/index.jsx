import { useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useSessionMutation } from "../../../redux/services/electron";
import { useLoginMutation } from "../../../redux/services/login";
import { jwtDecode } from "jwt-decode";
import styles from "./index.module.css";
import CustomTextField from "../../../components/CustomTextField";

const Login = () => {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const [loginApi, { isLoading, isError, error }] = useLoginMutation();
  const [electronAPI] = useSessionMutation();

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const capitalize = useCallback((str) => str.charAt(0).toUpperCase() + str.slice(1), []);

  const handleChange = useCallback((e, name) => {
    const { value } = e.target;

    setLoginInfo((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : `${capitalize(name)} is required`,
    }));
  }, [capitalize]);

  const validateForm = useCallback(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const newErrors = {
      email: !loginInfo.email
        ? "Email is required"
        : !emailRegex.test(loginInfo.email)
          ? "Enter a valid email"
          : "",
      password: loginInfo.password.trim() ? "" : "Password is required",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  }, [loginInfo]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const res = await loginApi(loginInfo).unwrap();
      const token = res?.accessToken;

      if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded?.userId;

        localStorage.setItem("token", token);

        try {
          const electronResponse = await electronAPI({ token, userId });
        } catch (err) {
          console.error("Failed to send token to Electron server:", err.message);
        }

        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  }, [validateForm, loginApi, loginInfo, electronAPI, navigate]);
  return (
    <Box className={styles.container}>
      <Box className={styles.imageContainer}
      // style={{ backgroundImage: `url(${entryBackground})` }}
      />
      <Box className={styles.leftSection}>
        <Box className={styles.formBox}>
          <Typography variant="h5" className={styles.title}>
            Welcome
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            Get started for a seamless work tracking experience.
          </Typography>

          <Box className={styles.field}>
            <CustomTextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              startIcon={<EmailIcon />}
              value={loginInfo.email}
              handleChange={(e) => handleChange(e, "email")}
              error={Boolean(errors.email)}
              helperText={errors.email}
            />
          </Box>

          <Box className={styles.field}>
            <CustomTextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              startIcon={<LockIcon />}
              endIcon={
                showPassword ? (
                  <VisibilityOff
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <Visibility
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  />
                )
              }
              value={loginInfo.password}
              handleChange={(e) => handleChange(e, "password")}
              error={Boolean(errors.password)}
              helperText={errors.password}
            />
          </Box>

          <Box className={styles.forgotPassword} onClick={()=>{navigate('/forgot-password')}}>
            <a className={styles.link} href="">
              Forgot Password?
            </a>
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
              "Login"
            )}
          </Button>

          {isError && (
            <Typography color="error" variant="body2" mt={1}>
              {error?.data?.message || "Invalid credentials"}
            </Typography>
          )}

          {/* <Divider className={styles.divider}>OR</Divider> */}
          <Box className={styles.dividerWrapper}>
            <span className={styles.line} />
            <span className={styles.orText}>OR</span>
            <span className={styles.line} />
          </Box>

          <Button variant="outlined" className={styles.googleBtn}>
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              style={{ height: 20, marginRight: 8 }}
            />
            Google
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
