import React from 'react';
import { Paper, Box, Grid, Typography, Avatar } from '@mui/material';

const ScreenshotGrid = ({ screenshots }) => {
    return (
        <Paper sx={{ padding: '10px 10px', marginTop: '15px' }}>

            <Box>
                <Typography variant="h6" gutterBottom>Screenshots</Typography>
                <Grid container spacing={2}>
                    {screenshots.map((shot, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={idx}>
                            <Box sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
                                <img
                                    src={shot.imageUrl}
                                    alt={shot.title}
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                                <Box sx={{ p: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Avatar src={shot.iconUrl} sx={{ width: 24, height: 24 }} />
                                        <Typography variant="body2">{shot.title}</Typography>
                                    </Box>
                                    <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>
                                        {shot.percentage}
                                    </Typography>
                                    <Typography variant="caption">{shot.time}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Paper>
    );
};

export default ScreenshotGrid;
