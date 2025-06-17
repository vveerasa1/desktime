import React from 'react';
import {Paper, Box, Typography, Stack } from '@mui/material';

const CategoryBar = ({ categories, barSegments }) => {
  return (
    <Paper sx={{padding:'10px 10px'}}>
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>Categories</Typography>

      {/* Legend */}
      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', mb: 2 }}>
        {categories.map((cat, idx) => (
          <Stack key={idx} direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: cat.color }} />
            <Typography variant="body2">{cat.name}</Typography>
          </Stack>
        ))}
      </Stack>

      {/* Bar Chart */}
      <Box
        sx={{
          display: 'flex',
          height: 24,
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 1,
        }}
      >
        {barSegments.map((seg, idx) => (
          <Box
            key={idx}
            sx={{
              flex: seg.percentage,
              backgroundColor: seg.color,
              transition: 'flex 0.3s ease',
            }}
          />
        ))}
      </Box>
    </Box>
    </Paper>
  );
};

export default CategoryBar;
