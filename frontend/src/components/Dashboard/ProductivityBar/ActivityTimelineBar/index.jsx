import { Box, Button, Typography } from "@mui/material";
import OfflineTrackingModal from "../OfflineTrackingModal";
import { useState } from "react";
const ActivityTimelineBar = ({
  currentNormalizedData,
  TRACKED_COLOR,
  UNTRACKED_COLOR,
}) => {
    const [open,setOpen] = useState(false)

    const handleOpen = () =>{
        setOpen(true)
    }

    const handleClose = () =>{
        setOpen(false)
    }
  return (
    <Box>
        
      {/* --- Activity Timeline Bar Below Chart --- */}
      <Box
        sx={{
          width: `calc(100% - ${90 + 0}px)`, // Adjusts for chart's left and right margins
          ml: `72px`, // Aligns with chart's left margin
          mt: 3,
          mb: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: 20,
            width: "100%",
            overflow: "hidden",
            border: "2px dashed grey",
          }}

        >
          {currentNormalizedData.map((d, index) => (
            <Box
              key={index}
              sx={{
                flexGrow: 1,
                flexShrink: 0,
                flexBasis: `calc(100% / ${currentNormalizedData.length})`,
                backgroundColor: d.isTracked ? TRACKED_COLOR : UNTRACKED_COLOR,
                height: "100%",
                cursor:'pointer'
              }}
              title={`${d.time} - ${d.isTracked ? "Tracked" : "Untracked"}`}
            />
          ))}
        </Box>
      </Box>
     
    </Box>
  );
};

export default ActivityTimelineBar;
