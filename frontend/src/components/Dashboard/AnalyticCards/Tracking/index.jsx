import { useMemo } from 'react';
import { Grid, Paper, Divider, Typography, Box } from '@mui/material';
import clsx from 'clsx'; // for conditional className
import styles from './index.module.css';

const MetricDisplay = ({ title, value, valueColor }) => {
  return (
    <Box className={styles.metricBox}>
      <Typography variant="body1" className={styles.metricTitle}>
        {title}
      </Typography>
      <Typography
        variant="h5"
        className={clsx(styles.metricValue, {
          [styles.orange]: valueColor === '#FFA500',
          [styles.green]: valueColor === '#008000',
        })}
      >
        {value}
      </Typography>
    </Box>
  );
};

const TrackingCard = ({ orderedCards }) => {
  const content = useMemo(() => {
    return (
      <Paper elevation={3} className={styles.card}>
        <Box className={styles.row}>
          <Box className={styles.cell}>
            <MetricDisplay title={orderedCards[0]?.title} value={orderedCards[0]?.value} />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box className={styles.cell}>
            <MetricDisplay
              title={orderedCards[1]?.title}
              value={orderedCards[1]?.value}
              valueColor={orderedCards[1]?.value === 'ONLINE' ? '#008000' : orderedCards[1]?.valueColor}
              style={orderedCards[1]?.value === 'ONLINE' ? { color: '#008000' } : undefined}
            />
          </Box>
        </Box>

        <Divider className={styles.hDivider} />

        <Box className={styles.row}>
          <Box className={styles.cell}>
            <MetricDisplay title={orderedCards[2]?.title} value={orderedCards[2]?.value} />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box className={styles.cell}>
            <MetricDisplay title={orderedCards[3]?.title} value={orderedCards[3]?.value} />
          </Box>
        </Box>
      </Paper>
    );
  }, [orderedCards]);

  return <Grid item xs={12} md={4}>{content}</Grid>;
};

export default TrackingCard;
