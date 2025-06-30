import React from 'react';
import { Box, Typography } from '@mui/material';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // The actual data object for the hovered bar

    return (
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #ccc',
          p: 1,
          borderRadius: '4px',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          display:'flex',
          flexDirection:'column'
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
         {data.time} {/* Display the 'time' */}
        </Typography>
        <Typography variant="caption" sx={{ color: '#4caf50' }}>
          Productive: {data.productive.toFixed(0)}% {/* Display productive percentage */}
        </Typography>
        <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
          Neutral: {data.neutral.toFixed(0)}% {/* Display neutral percentage */}
        </Typography>
        <Typography variant="caption" sx={{ color: '#ffc107' }}>
          Unproductive: {data.unproductive.toFixed(0)}% {/* Display unproductive percentage */}
        </Typography>
        {data.apps && data.apps.length > 0 && (
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
            Apps: {data.apps.map(app => app.name).join(', ')} {/* Display apps if available */}
          </Typography>
        )}
        {data.total && (
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
            Total: {data.total} {/* Display total if available */}
          </Typography>
        )}
      </Box>
    );
  }

  return null;
};

export default CustomTooltip;