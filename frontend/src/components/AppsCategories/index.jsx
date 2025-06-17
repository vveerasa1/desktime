import React from 'react';
import { Box, Typography } from '@mui/material';

const AppCategoryPanel = ({ title, totalTime, apps, headerColor }) => {
  const columns = 4;
  const chunkSize = Math.ceil(apps.length / columns);
  const chunks = Array.from({ length: columns }, (_, i) =>
    apps.slice(i * chunkSize, i * chunkSize + chunkSize)
  );

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: 1,
        mb: 2,
      }}
    >
      {/* Header */}
      <Box sx={{ backgroundColor: headerColor, p: 1.5 }}>
        <Typography
          variant="subtitle2"
          sx={{ color: 'white', fontWeight: 600 }}
        >
          {title} - {totalTime}
        </Typography>
      </Box>

      {/* App List */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 2,
          py: 2,
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        {chunks.map((chunk, colIndex) => (
          <Box key={colIndex} sx={{ flex: 1, minWidth: 160 }}>
            {chunk.map((app, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 0.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontSize: '14px', color: '#333' }}
                >
                  {app.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: '13px', color: '#666' }}
                >
                  {app.time}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AppCategoryPanel;
