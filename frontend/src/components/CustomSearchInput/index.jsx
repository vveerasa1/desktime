// components/CustomSearchInput.jsx
import React from "react";
import { TextField } from "@mui/material";

const CustomSearchInput = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <TextField
      size="small"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      fullWidth
    />
  );
};

export default CustomSearchInput;
