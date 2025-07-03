// components/CustomPhoneInput.js
import React from "react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/material.css'; // MUI-friendly style
import { Typography, Box } from "@mui/material";
import styles from './index.module.css'
const CustomPhoneInput = ({ value, onChange, label, isRequired }) => {
  return (
    <Box  
      className={styles.phoneContainer}>
      {label && (
        <Typography
          className={styles.phone}
        >
          {label} {isRequired && <span style={{ color: "red" }}>*</span>}
        </Typography>
      )}
      <PhoneInput
        country={"in"}
        value={value}
        onChange={onChange}
        inputProps={{
          required: isRequired,
        }}
        inputStyle={{
           width: "100%",
          height: "40px",              // Match MUI dropdown height
          fontSize: "13px", 
          borderRadius: "4px",
          border: "1px solid #c4c4c4",
                    paddingLeft: "48px",         // Leave room for flag dropdown

        }}
          specialLabel="" // ✅ This removes the default "Phone" label

        containerStyle={{ width: "100%" }}
        enableSearch
        
      />
    </Box>
  );
};

export default CustomPhoneInput;
