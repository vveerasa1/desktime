import { Box, Button, Typography } from "@mui/material";
import styles from './index.module.css'
const ActivityTimelineBar = ({
  currentNormalizedData,
  TRACKED_COLOR,
  UNTRACKED_COLOR,
}) => {
    
  return (
   <Box sx={{marginTop:-3}}>
      {/* --- Activity Timeline Bar Below Chart --- */}
      <Box className={styles.wrapper}>
        <Box className={styles.timelineContainer}>
          {currentNormalizedData.map((d, index) => (
            <Box
              key={index}
              className={styles.timelineBlock}
              style={{
                flexBasis: `calc(100% / ${currentNormalizedData.length})`,
                backgroundColor: d.isTracked ? TRACKED_COLOR : UNTRACKED_COLOR,
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
