import { Box, Typography } from '@mui/material';
import styles from './index.module.css'
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // The actual data object for the hovered bar

    return (
       <Box className={styles.tooltipBox}>
        <Typography variant="body2" className={styles.tooltipTitle}>
          {data.time}
        </Typography>
        <Typography variant="caption" className={styles.tooltipProductive}>
          Productive: {data.productive.toFixed(0)}%
        </Typography>
        <Typography variant="caption" className={styles.tooltipNeutral}>
          Neutral: {data.neutral.toFixed(0)}%
        </Typography>
        <Typography variant="caption" className={styles.tooltipUnproductive}>
          Unproductive: {data.unproductive.toFixed(0)}%
        </Typography>
        {data.apps && data.apps.length > 0 && (
          <Typography variant="caption" className={styles.tooltipMeta}>
            Apps: {data.apps.map((app) => app.name).join(', ')}
          </Typography>
        )}
        {data.total && (
          <Typography variant="caption" className={styles.tooltipMeta}>
            Total: {data.total}
          </Typography>
        )}
      </Box>
    );
  }

  return null;
};

export default CustomTooltip;