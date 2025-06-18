import React from 'react';
import { Grid } from '@mui/material';
import styles from './index.module.css';
import StatCardWithChart from '../TimeCard';
import { statCardsData } from './constant';

const AnalyticCards = () => {
  return (
    <Grid container  className={styles.gridContainer}>
      {statCardsData.map((card, index) => (
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
