import { Grid, Box, Typography } from "@mui/material";
// import styles from "./index.module.css"; // Assuming you might still use this for overall layout if needed
// import StatCardWithChart from "../TimeCard"; // No longer needed for this specific layout
import { statCardsData } from "./constant"; // Still used for initial card structure
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import moment from "moment";
import TrackingCard from "./TrackingCard";
import ProjectCard from "./ProjectsCard";
dayjs.extend(duration);

// Helper to convert seconds to "Xh Ym"
const formatSecondsToHHMM = (seconds) => {
  if (typeof seconds !== "number" || isNaN(seconds)) {
    return "--"; // Handle cases where seconds might be null or invalid
  }
  const dur = dayjs.duration(seconds, "seconds");
  const hours = dur.hours();
  const minutes = dur.minutes();

  if (hours === 0 && minutes === 0) {
    return "0h 0m"; // Explicitly show 0h 0m for zero seconds
  }

  let formatted = "";
  if (hours > 0) {
    formatted += `${hours}h `;
  }
  formatted += `${minutes}m`;
  return formatted.trim(); // Trim to remove trailing space if hours is 0
};

const AnalyticCards = ({ getDashboardData }) => {
  const dashboardData = getDashboardData?.data || {};
  const dynamicStatCards = statCardsData.map((card) => {
    switch (card.title) {
      case "Arrival time":
        return {
          ...card,
          value: dashboardData?.arrivalTime
            ? moment(dashboardData.arrivalTime, "HH:mm:ss").format("HH:mm")
            : "--",
        };

      case "Left time":
        return {
          ...card,
          // Value can be null, a time string, or "ONLINE"
          value:
            dashboardData.leftTime === null
              ? "ONLINE"
              : dashboardData.leftTime
              ? moment(dashboardData.leftTime, "HH:mm:ss").format("HH:mm") // Format if it's a time string
              : "--",
          valueColor: dashboardData.leftTime === null ? "#FFA500" : undefined, // Apply orange color for ONLINE
        };
      case "Desktime time":
        return {
          ...card,
          value: dashboardData.deskTime
            ? formatSecondsToHHMM(dashboardData.deskTime)
            : "--",
        };
      case "Time at work":
        return {
          ...card,
          value: dashboardData.timeAtWork
            ? formatSecondsToHHMM(dashboardData.timeAtWork)
            : "--",
        };
      default:
        return card;
    }
  });

  // Re-order based on the image: Arrival, Left, Desktime, Time at work
  const orderedCards = [
    dynamicStatCards.find((card) => card.title === "Arrival time"),
    dynamicStatCards.find((card) => card.title === "Left time"),
    dynamicStatCards.find((card) => card.title === "Desktime time"),
    dynamicStatCards.find((card) => card.title === "Time at work"),
  ].filter(Boolean); // Filter out any undefined if a card title isn't found


  return (
    <Grid container>
  <Box
    gap={3}
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <Box >
      <TrackingCard orderedCards={orderedCards} />
    </Box>

    <Box>
      <ProjectCard />
    </Box>
  </Box>
</Grid>

  );
};

export default AnalyticCards;
