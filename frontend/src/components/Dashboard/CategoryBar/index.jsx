import React from 'react';
import { Paper, Box, Typography, Stack } from '@mui/material';
import styles from './index.module.css';

const CategoryBar = ({ categories, barSegments }) => {
  return (
    <Paper sx={{ padding: '10px 10px' }}>
      <Box className={styles.container}>
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>

        {/* Legend */}
        <Stack direction="row" spacing={2} className={styles.legend}>
          {categories.map((cat, idx) => (
            <Stack key={idx} direction="row" spacing={1} className={styles.legendItem}>
              <Box
                className={styles.colorDot}
                sx={{ backgroundColor: cat.color }}
              />
              <Typography variant="body2">{cat.name}</Typography>
            </Stack>
          ))}
        </Stack>

        {/* Bar Chart */}
        <Box className={styles.barWrapper}>
          {barSegments.map((seg, idx) => (
            <Box
              key={idx}
              className={styles.segment}
              sx={{
                flex: seg.percentage,
                backgroundColor: seg.color,
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default CategoryBar;
