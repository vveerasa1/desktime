// // components/CustomPhoneInput.js
// import React from "react";
// import PhoneInput from "react-phone-input-2";
// import 'react-phone-input-2/lib/material.css'; // MUI-friendly style
// import { Typography, Box } from "@mui/material";
// import styles from './index.module.css'
// const CustomPhoneInput = ({ value, onChange, label, isRequired, onBlur, error, helperText }) => {
//   return (
//     <Box className={styles.phoneContainer}>
//       {label && (
//         <Typography className={styles.phone}>
//           {label} {isRequired && <span style={{ color: "red" }}>*</span>}
//         </Typography>
//       )}
//       <PhoneInput
//         country={"in"}
//         value={value}
//         onChange={onChange}
//         inputProps={{
//           required: isRequired,
//           onBlur: onBlur, // ⬅️ Attach blur here
//         }}
//         inputStyle={{
//           width: "100%",
//           height: "40px",
//           fontSize: "13px",
//           borderRadius: "4px",
//           border: error ? "1px solid red" : "1px solid #c4c4c4",
//           paddingLeft: "48px",
//         }}
//         specialLabel=""
//         containerStyle={{ width: "100%" }}
//         enableSearch
//       />
//       {error && (
//         <Typography sx={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
//           {helperText}
//         </Typography>
//       )}
//     </Box>
//   );
// };


// export default CustomPhoneInput;
import React from "react";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/material.css';
import { Typography, Box } from "@mui/material";
import styles from './index.module.css';
import { isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';
import { useState } from "react";

const CustomPhoneInput = ({
  value,
  onChange,
  label,
  isRequired,
  onBlur,
  // error,
  helperText,
  // setPhoneError // ⬅️ Add this prop for external validation control
}) => {
  const [error,setPhoneError]=useState('')
  const handleBlur = () => {
    const phoneNumber = parsePhoneNumberFromString("+" + value);
    let errorMessage = "";

    if (isRequired && (!value || value.trim() === "")) {
      errorMessage = "Phone number is required";
    } else if (!phoneNumber || !phoneNumber.isValid()) {
      errorMessage = "Invalid phone number for selected country";
    }

    if (setPhoneError) {
      setPhoneError(errorMessage);
    }

    if (onBlur) {
      onBlur(); // optional callback
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
      {error && (
        <Typography sx={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default CustomPhoneInput;
