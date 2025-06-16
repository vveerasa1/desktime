import React from 'react'
import { Select,MenuItem,Typography,Box,InputLabel } from '@mui/material'
import styles from './index.module.css'
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
const CustomDropdown = (
    {
        label,
        name,
        selectedValue,
        options,
        handleSelect,
        placeholder,
        addPlusIcon,
        onPlusClick,
        isRequired,
        disabled,
        minWidth,
    }
) => {

    const menuProps = {
    PaperProps: {
      className: styles.menuPaper,
      sx: { width: "250px" },
    },
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
  };
  return (
    <Box>
      {label && (
        <Typography className={styles.label} variant='subtitle2'>
          {label}{isRequired && <span className={styles.required}>*</span>}
        </Typography>
      )}
      <Box sx={{display:'flex',alignItems:"center",minWidth:minWidth || "200px"}}>
        <Select
        name={name}
        value={selectedValue || ""}
        onChange={(event) => handleSelect(event, name)}
        displayEmpty
        disabled={disabled}
        fullWidth
        MenuProps={menuProps}
        IconComponent={KeyboardArrowDownIcon}
         sx={{
        fontSize: "14px",
          height: "36px", // Reduce height
          
            minWidth: addPlusIcon ? "calc(100% - 40px)" : "100%",
            "& .MuiSelect-select": {
              padding: "10px",
              color: selectedValue ? "#000" : "#9e9e9e",
              
            },
          }}
           renderValue={(value) => {
            const selected = options?.find((opt) => opt.id == value);
            return selected?.name || (
              <span style={{ color: "#9e9e9e" }}>{placeholder || "Select"}</span>
            );
          }}
        >
         <MenuItem disabled value="">
           {placeholder || `Select ${label}`}
            </MenuItem>
            {options?.map((option,index)=>(
                <MenuItem
                key={index}
                value={option?.id}
                >
                    {option?.name}
                </MenuItem>
            ))}   
        </Select>
            {addPlusIcon && (
          <Box onClick={onPlusClick} className={styles.plusIconWrapper}>
            <AddIcon className={styles.plusIcon} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default CustomDropdown
