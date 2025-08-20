import React, { useMemo } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  styled,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import clsx from 'clsx';
import styles from './index.module.css';

// Styled card with hover effect and animated border
const MetricCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
    '&::before': {
      transform: 'translateX(0)',
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `#143351`,
    transform: 'translateX(-100%)',
    transition: 'transform 0.6s ease',
    zIndex: 1,
  },
}));

// Metric display component with conditional design
const MetricDisplay = ({ title, value, valueColor, isTimeMetric }) => {
  if (isTimeMetric) {
    return (
      <Box className={styles.clockContainer} sx={{ textAlign: 'center' }}>
        <AccessTimeIcon sx={{ fontSize: 48, color: '#143351' }} />
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, color: valueColor || '#143351' }}
        >
          {value}
        </Typography>
      </Box>
    );
  }

  // Original design for non-time metrics
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      <Typography
        variant="h5"
        className={clsx(styles.metricValue, {
          [styles.orange]: valueColor === '#FFA500',
          [styles.green]: valueColor === '#008000',
        })}
        sx={{
          fontWeight: 600,
          color: valueColor || 'text.primary',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

const TrackingCard = ({ orderedCards }) => {
  const cards = useMemo(() => [
    {
      title: orderedCards[0]?.title,
      value: orderedCards[0]?.value,
      color: orderedCards[0]?.valueColor,
    },
    
    // If Left time is empty, show Status instead
 {
  title: !orderedCards[1]?.value || orderedCards[1]?.value === "ONLINE"
    ? "Status"
    : orderedCards[1]?.title,

  value: !orderedCards[1]?.value || orderedCards[1]?.value === "00:00"
    ? (orderedCards[0]?.value && orderedCards[0]?.value !== "00:00"
        ? "ONLINE"
        : "OFFLINE")
    : orderedCards[1]?.value,

  color: !orderedCards[1]?.value || orderedCards[1]?.value === "00:00"
    ? (orderedCards[0]?.value && orderedCards[0]?.value !== "00:00"
        ? "#008000" // green
        : "#808080") // grey
    : (orderedCards[1]?.value === "ONLINE"
        ? "#008000" // force green if ONLINE
        : orderedCards[1]?.valueColor || "#808080"), // fallback to grey
},

    {
      title: orderedCards[2]?.title,
      value: orderedCards[2]?.value,
      color: orderedCards[2]?.valueColor,
    },
    {
      title: orderedCards[3]?.title,
      value: orderedCards[3]?.value,
      color: orderedCards[3]?.valueColor,
    },
  ], [orderedCards]);

  return (
    <Grid container spacing={2}>
      {cards.map((card, index) => (
        <Grid item xs={12} md={3} key={index} sx={{ flex: 1 }}>
          <MetricCard>
            <CardContent sx={{ py: 2 }}>
              <MetricDisplay
                title={card.title}
                value={card.value}
                valueColor={card.color}
                isTimeMetric={['ArrivalTime', 'DeskTime', 'Left Time'].includes(card.title)}
              />
            </CardContent>
          </MetricCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default TrackingCard;