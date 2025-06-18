import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const CustomTooltip = ({ active, payload, label, coordinate }) => {
  if (
    active &&
    payload &&
    payload.length &&
    payload[0].payload.apps.length > 0
  ) {
    const data = payload[0].payload;
    const productiveApps = data.apps.filter(app => app.type === 'productive');
    const neutralApps = data.apps.filter(app => app.type === 'neutral');

    return (
      <Box
        sx={{
          position: 'absolute',
          left: coordinate?.x || 0,
          top: (coordinate?.y || 0) - 10,
          transform: 'translateY(-100%)',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: 2,
          p: 2,
          fontSize: 12,
          boxShadow: 3,
          zIndex: 1000,
          minWidth: 200,
        }}
      >
        <Typography fontWeight={600} mb={1}>
          {data.timeRange || label}
        </Typography>

        {data.productive > 0 && (
          <>
            <Box display="flex" alignItems="center" mb={1}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#4caf50',
                  borderRadius: 0.5,
                  mr: 1,
                }}
              />
              <Typography variant="body2">productive</Typography>
              <Typography sx={{ ml: 'auto', fontWeight: 600 }}>
                {data.productive}%
              </Typography>
            </Box>

            {productiveApps.map((app, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                mb={0.5}
                pl={2}
              >
                <Typography variant="body2">{app.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {app.time}
                </Typography>
              </Box>
            ))}
          </>
        )}

        {data.neutral > 0 && (
          <>
            <Box display="flex" alignItems="center" mb={1} mt={1}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#9e9e9e',
                  borderRadius: 0.5,
                  mr: 1,
                }}
              />
              <Typography variant="body2">neutral</Typography>
              <Typography sx={{ ml: 'auto', fontWeight: 600 }}>
                {data.neutral}%
              </Typography>
            </Box>

            {neutralApps.map((app, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="space-between"
                mb={0.5}
                pl={2}
              >
                <Typography variant="body2">{app.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {app.time}
                </Typography>
              </Box>
            ))}
          </>
        )}

        <Divider sx={{ mt: 1, mb: 1 }} />

        <Box display="flex" justifyContent="space-between" fontWeight={600}>
          <Typography variant="body2">Total:</Typography>
          <Typography variant="body2">{data.total}</Typography>
        </Box>
      </Box>
    );
  }

  return null;
};

export default CustomTooltip;
