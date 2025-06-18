import React from "react";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const daysList = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

const CustomDays = ({ selectedDays, onChange, label = "Select days" }) => {
  const handleToggle = (day) => {
    const updated = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    onChange(updated);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Typography variant="subtitle1">{label}</Typography>
        <Tooltip title="Select the days you want to include">
          <IconButton size="small">
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {daysList.map((day) => {
          const isSelected = selectedDays.includes(day);
          return (
            <Box
              key={day}
              onClick={() => handleToggle(day)}
              sx={{
                width: 30,
                height: 30,
                paddingX:2,
                paddingY:2,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                fontWeight: "bold",
                    fontSize: "12px", // 👈 Add this line to reduce font size

                color: isSelected ? "white" : "gray",
                backgroundColor: isSelected ? "#9e9e9e" : "white",
                border: `1px solid ${isSelected ? "#9e9e9e" : "#ccc"}`,
                transition: "all 0.2s ease-in-out",
                userSelect: "none",
              }}
            >
              {day}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CustomDays;
