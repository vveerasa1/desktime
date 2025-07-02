import React, { useState } from "react";
import {
  IconButton,
  Popover,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

const FilterPopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Paper
        elevation={1}
        sx={{
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 2,
          border: "1px solid #E0E0E0",
          backgroundColor: "#fff",
        }}
      >
        <IconButton onClick={handleClick}>
          <FilterListIcon />
        </IconButton>
      </Paper>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Paper sx={{ p: 2 }}>
          <FormGroup>
            <FormControlLabel control={<Checkbox />} label="Active" />
            <FormControlLabel control={<Checkbox />} label="Inactive" />
            <FormControlLabel control={<Checkbox />} label="Admin Only" />
          </FormGroup>
        </Paper>
      </Popover>
    </>
  );
};

export default FilterPopover;
