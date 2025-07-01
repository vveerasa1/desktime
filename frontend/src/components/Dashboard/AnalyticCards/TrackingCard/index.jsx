import { Grid, Paper, Typography, Box, Divider } from '@mui/material'; // Import Divider

const MetricDisplay = ({ title, value, valueColor }) => (
  <Box sx={{ textAlign: "center", p: 2 }}>
    <Typography variant="body1" sx={{ color: "#666", mb: 0.5 }}>
      {title}
    </Typography>
    <Typography
      variant="h5"
      sx={{
        fontWeight: 600,
        color: valueColor || "#333",
        lineHeight: 2,
      }}
    >
      {value}
    </Typography>
  </Box>
);

const TrackingCard = ({ orderedCards }) => {
  return (
    <Grid item size={{xs:12,md:4}}>
      <Paper
        elevation={3}
        sx={{ p: 2, borderRadius: "8px", overflow: "hidden" }}
      >
        <Box  sx={{ display: "flex", justifyContent: "space-around"}}>
          {/* Top-Left: Arrival Time */}
          <Box sx={{  display: 'flex', flexDirection: 'column', justifyContent: 'center' ,minWidth:'170px'}}>
            <MetricDisplay
              title={orderedCards[0]?.title}
              value={orderedCards[0]?.value}
            />
          </Box>

          {/* Vertical Divider 1 */}
          <Divider orientation="vertical" flexItem />

          {/* Top-Right: Left Time */}
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center',minWidth:'170px' }}>
            <MetricDisplay
              title={orderedCards[1]?.title}
              value={orderedCards[1]?.value}
              valueColor={orderedCards[1]?.valueColor}
            />
          </Box>
        </Box>

        {/* Horizontal Divider */}
        <Divider sx={{ my: 0 }} />

        <Box sx={{ display: "flex", justifyContent: "space-around", }}>
          {/* Bottom-Left: Desktime */}
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center',minWidth:'170px' }}>
            <MetricDisplay
              title={orderedCards[2]?.title}
              value={orderedCards[2]?.value}
            />
          </Box>

          {/* Vertical Divider 2 */}
          <Divider orientation="vertical" flexItem />

          {/* Bottom-Right: Time at Work */}
          <Box sx={{  display: 'flex', flexDirection: 'column', justifyContent: 'center',minWidth:'170px' }}>
            <MetricDisplay
              title={orderedCards[3]?.title}
              value={orderedCards[3]?.value}
            />
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default TrackingCard;