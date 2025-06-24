import { Grid } from '@mui/material';
import styles from './index.module.css';
import StatCardWithChart from '../TimeCard';
import { statCardsData } from './constant';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import moment from 'moment';
dayjs.extend(duration);

// Helper to convert seconds to "Xh Ym"
const formatSecondsToHHMM = (seconds) => {
  const dur = dayjs.duration(seconds, 'seconds');
  return `${dur.hours()}h ${dur.minutes()}m`;
};


const AnalyticCards = ({ getDashboardData }) => {
  const dashboardData = getDashboardData?.data || {};
  const dynamicStatCards = statCardsData.map((card) => {
    switch (card.title) {
      case 'Arrival time':
        return {
          ...card,
          value: moment( dashboardData?.arrivalTime, "HH:mm:ss").format("HH:mm") || '--',
        };
        case 'Left time':
          return{
            ...card,
            value: dashboardData.leftTime === null ? "ONLINE" : dashboardData.leftTime
          };
      case 'Desktime time':
        return {
          ...card,
          value: dashboardData.deskTime
            ? formatSecondsToHHMM(dashboardData.deskTime)
            : '--',
        };
      case 'Time at work':
        return {
          ...card,
          value: dashboardData.timeAtWork
            ? formatSecondsToHHMM(dashboardData.timeAtWork)
            : '--',
        };
      default:
        return card;
    }
  });

  return (
    <Grid container className={styles.gridContainer}>
      {dynamicStatCards.map((card, index) => (
        <StatCardWithChart
          key={index}
          title={card.title}
          value={card.value}
          valueColor={card.valueColor}
          chartColor={card.chartColor}
          chartData={card.chartData}
        />
      ))}
    </Grid>
  );
};

export default AnalyticCards;
