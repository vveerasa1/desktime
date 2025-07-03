import React, { useState } from "react";
import {
  IconButton,
  Popover,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import styles from './index.module.css'
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
        className={styles.container}
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
        <Paper className={styles.paper}>
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
