import { Grid, Box } from "@mui/material";
import { statCardsData } from "./constant";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import moment from "moment";
import { useMemo } from "react";
import TrackingCard from "./Tracking";
import ProjectCard from "./Projects";
import styles from "./index.module.css";

dayjs.extend(duration);

// Helper to convert seconds to "Xh Ym"
const formatSecondsToHHMM = (seconds) => {
  if (typeof seconds !== "number" || isNaN(seconds)) return "--";
  const dur = dayjs.duration(seconds, "seconds");
  const hours = dur.hours();
  const minutes = dur.minutes();
  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`.trim();
};

const AnalyticCards = ({ getDashboardData }) => {
  const dashboardData = getDashboardData?.data || {};
  const dynamicStatCards = useMemo(() => {
    return statCardsData.map((card) => {
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
            value: dashboardData.leftTime
              ? moment(dashboardData.leftTime, "HH:mm:ss").format("HH:mm")
              : "ONLINE",
            valueColor: !dashboardData.leftTime ? "#FFA500" : undefined,
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
  }, [dashboardData]);

  const orderedCards = useMemo(() => {
    return [
      dynamicStatCards.find((card) => card.title === "Arrival time"),
      dynamicStatCards.find((card) => card.title === "Left time"),
      dynamicStatCards.find((card) => card.title === "Desktime time"),
      dynamicStatCards.find((card) => card.title === "Time at work"),
    ].filter(Boolean);
  }, [dynamicStatCards]);

  return (
    <Grid container sx={{ width: "100%" }}>
      <Box className={styles.container}>
        <TrackingCard orderedCards={orderedCards} />
        <ProjectCard />
      </Box>
    </Grid>
  );
};

export default AnalyticCards;
