import { useMemo } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  useTheme,
  styled 
} from '@mui/material';
import clsx from 'clsx';
import styles from './index.module.css';

// Styled card with hover effect and animated border
// const MetricCard = styled(Card)(({ theme }) => ({
//   transition: 'all 0.3s ease',
//   height: '100%',
//   position: 'relative',
//   overflow: 'hidden',
//   '&:hover': {
//     transform: 'translateY(-4px)',
//     boxShadow: theme.shadows[6],
//     '&::before': {
//       transform: 'translateX(0)',
//     }
//   },
//   '&::before': {
//     content: '""',
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: '4px',
//     background: `#143351`,
//     transform: 'translateX(-100%)',
//     transition: 'transform 0.6s ease',
//     zIndex: 1,
//   }
// }));
const MetricCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'highlightColor',
})(({ theme, highlightColor }) => ({
  transition: 'all 0.3s ease',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
    '&::before': {
      transform: 'translateX(0)',
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: highlightColor || '#143351', // fallback if not provided
    transform: 'translateX(-100%)',
    transition: 'transform 0.6s ease',
    zIndex: 1,
  }
}));

const MetricDisplay = ({ title, value, valueColor }) => {
  return (
    <Box sx={{ textAlign: 'center'}}>
      <Typography 
        variant="h6" 
        color="text.secondary"
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        // className={clsx(styles.metricValue, {
        //   [styles.orange]: valueColor === '#FFA500',
        //   [styles.green]: valueColor === '#008000',
        // })}
        sx={{ 
          fontWeight: 500,
          fontSize:'15px',
          fontFamily:'sans-serif',
          color: valueColor || 'text.primary'
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

const TrackingCard = ({totalOfflineTime}) => {
  const theme = useTheme();
 const cards = useMemo(() => [
    {
      title:'Total offline times',
      value: totalOfflineTime,
      // color: orderedCards[0]?.valueColor
    },

    {
      title: 'Productive time:',
      value: '259h 48m 42s',
      color:'#008000'
    },
    {
      title: 'Unproductive time',
      value: '3h 47m 24s',
      color:'#591207ff'
      // color: orderedCards[2]?.valueColor
    },
    {
      title: 'Neutral time:',
      value: '457h 22m 11s',
      color:'#008000'
      // color: orderedCards[3]?.valueColor
    }
  ], []);

  return (
    // <Grid container spacing={2}>
    <>
       {cards.map((card, index) => (
        <Grid item key={index} sx={{flex: 1 }}>
    <MetricCard highlightColor={card.color}>
            <CardContent sx={{ py: 1}}>
              <MetricDisplay 
                title={card.title} 
                value={card.value} 
                valueColor={card.color}
                // highlightColor={card.color}
              />
            </CardContent>
          </MetricCard>
        </Grid>
      ))}
    </>
   
    // </Grid>
  );
};

export default TrackingCard;