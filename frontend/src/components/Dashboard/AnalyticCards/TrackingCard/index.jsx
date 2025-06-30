import { Grid, Paper, Typography, Box, Divider } from '@mui/material';

const MetricDisplay = ({ title, value, valueColor }) => (
  <Box sx={{ textAlign: "center", p: 1 }}>
    <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
      {title}
    </Typography>
    <Typography
      variant="h5"
      sx={{
        fontWeight: 600,
        color: valueColor || "#333",
        lineHeight: 1,
      }}
    >
      {value}
    </Typography>
  </Box>
);

const TrackingCard = ({ orderedCards }) => {
  return (
    <Grid item xs={12} md={3}>
      <Paper
        elevation={3}
        sx={{ p: 2, borderRadius: "8px", overflow: "hidden" }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <MetricDisplay
              title={orderedCards[0]?.title}
              value={orderedCards[0]?.value}
            />
            <MetricDisplay
              title={orderedCards[2]?.title}
              value={orderedCards[2]?.value}
            />
          </Box>

          <Box>
            <MetricDisplay
              title={orderedCards[1]?.title}
              value={orderedCards[1]?.value}
              valueColor={orderedCards[1]?.valueColor}
            />
            <MetricDisplay
              title={orderedCards[3]?.title}
              value={orderedCards[3]?.value}
            />
          </Box>
        </Box>

        {/* Divider between rows if needed */}
      </Paper>
    </Grid>
  );
};

export default TrackingCard;
