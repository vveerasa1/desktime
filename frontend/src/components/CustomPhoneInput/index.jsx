import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { Typography, Box } from "@mui/material";
import styles from "./index.module.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const CustomPhoneInput = ({
  value,
  onChange,
  label,
  isRequired,
  onBlur,
  error,
  helperText,
}) => {
  console.log(helperText,"HELPER")
  const handleBlur = () => {
    const phoneNumber = parsePhoneNumberFromString("+" + value);
    let errorMessage = "";

    if (isRequired && (!value || value.trim() === "")) {
      errorMessage = "Phone number is required";
    } else if (!phoneNumber || !phoneNumber.isValid()) {
      errorMessage = "Invalid phone number for selected country";
    }

   

    if (onBlur) {
      onBlur();
    }
  };

  return (
    <Box className={styles.phoneContainer}>
      {label && (
        <Typography className={styles.phone}>
          {label} {isRequired && <span style={{ color: "red" }}>*</span>}
        </Typography>
      )}

      <PhoneInput
        country={"in"}
        value={value}
        onChange={onChange}
        inputProps={{
          required: isRequired,
          onBlur: handleBlur,
        }}
        inputStyle={{
          width: "100%",
          height: "40px",
          fontSize: "13px",
          borderRadius: "4px",
          border: error ? "1px solid red" : "1px solid #c4c4c4",
          paddingLeft: "48px",
        }}
        specialLabel=""
        containerStyle={{ width: "100%" }}
        enableSearch
      />

      {/* Always reserve space for helper text */}
      <Typography
        sx={{
          color: error ? "red" : "#6b6b6b",
          fontSize: "12px",
          marginTop: "4px",
          minHeight: "16px", // prevents layout shift
        }}
      >
        {error ? helperText :   ""}
      </Typography>
    </Box>
  );
};

export default CustomPhoneInput;
