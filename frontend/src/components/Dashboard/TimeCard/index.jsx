import { Typography, Box, IconButton, Grid } from "@mui/material";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import styles from "./index.module.css";

const StatCardWithChart = ({
  title,
  value,
  valueColor = "#000",
  chartColor = "#27ae60",
  chartData,
}) => {
  return (
    // <Paper elevation={1} className={styles.card}>
    <Grid  item className={styles.card}>
      <Box className={styles.header}>
        <Typography variant="subtitle2" className={styles.title}>
          {title}
        </Typography>
        <IconButton size="small" className={styles.info}>
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
      <Typography
        variant="h5"
        className={styles.value}
        style={{ color: valueColor }}
      >
        {value}
      </Typography>
      <Box className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill={chartColor}
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Grid>

    // </Paper>
  );
};

export default StatCardWithChart;
