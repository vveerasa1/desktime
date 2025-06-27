// CustomTooltip.jsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Define a custom order for display to ensure consistency
    const order = { 'productive': 1, 'neutral': 2, 'unproductive': 3 };
    const sortedPayload = [...payload].sort((a, b) => {
      // Handle cases where dataKey might not be in the predefined order (shouldn't happen with our data)
      const orderA = order[a.dataKey] || 99;
      const orderB = order[b.dataKey] || 99;
      return orderA - orderB;
    });

    return (
      <Paper elevation={3} sx={{ p: 1, bgcolor: 'background.paper', opacity: 0.9, borderRadius: '4px' }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block' }}>
          {label} {/* This will be "HH:MM" for day, or "Mon"/"Tue" for week */}
        </Typography>
        {sortedPayload.map((entry, index) => (
          <Box key={`item-${index}`} sx={{ display: 'flex', alignItems: 'center', mb: 0.2 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: entry.color, mr: 1 }} />
            <Typography variant="caption" sx={{ fontSize: '12px' }}>
              {/* Capitalize the first letter of the dataKey for display */}
              {entry.dataKey.charAt(0).toUpperCase() + entry.dataKey.slice(1)}: {entry.value.toFixed(0)}%
            </Typography>
          </Box>
        ))}
        {/*
        // You can conditionally show apps/total if the data in payload[0].payload has it.
        // This generally applies to day view, as week view aggregates.
        {payload[0].payload.apps && payload[0].payload.apps.length > 0 && (
          <Box sx={{ mt: 0.5 }}>
            <Typography variant="caption" sx={{ fontSize: '12px', fontWeight: 'bold' }}>Top Apps:</Typography>
            {payload[0].payload.apps.slice(0, 3).map((app, appIndex) => (
              <Typography key={`app-${appIndex}`} variant="caption" sx={{ fontSize: '10px', display: 'block' }}>
                - {app.name}
              </Typography>
            ))}
            {payload[0].payload.apps.length > 3 && (
              <Typography variant="caption" sx={{ fontSize: '10px' }}>
                ...and {payload[0].payload.apps.length - 3} more
              </Typography>
            )}
          </Box>
        )}
        */}
      </Paper>
    );
  }

  return null;
};

export default CustomTooltip;