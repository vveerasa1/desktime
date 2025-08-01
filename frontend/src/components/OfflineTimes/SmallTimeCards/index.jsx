import React, { useMemo } from 'react';
import { Button, Box, Typography } from '@mui/material';

const SmallTimeCards = ({ onShowTimes }) => {
  const cards = useMemo(() => [
    {
      title: 'Requests',
      value: 2546,
      valueColor: 'black',
    },
    {
      title: 'Productive time',
      value: '259h 48m 42s',
      valueColor: 'green',
    },
    {
      title: 'Unproductive time',
      value: '3h 47m 24s',
      valueColor: 'red',
    },
    {
      title: 'Neutral time',
      value: '457h 22m 11s',
      valueColor: 'gray',
    },
  ], []);

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {cards.map((card, index) => (
        <Button
          key={index}
          variant="outlined"
          size="small"
          onClick={() => onShowTimes && onShowTimes(card)}
          sx={{
            backgroundColor: 'white',
            fontFamily: 'sans-serif',
            fontSize: '13px',
            textTransform: 'none',
            color: 'black',
            borderColor: '#ccc',
            // '&:hover': {
            //   backgroundColor: '#96a5d4ff',
            //   borderColor: '#999',
            // },
            display: 'flex',
            // flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0Ypx 15px',
            // width: '100%',
            height:'40px',
            border:'none'

          }}
        >
          <Typography sx={{ fontSize: '12px', color: 'gray',paddingTop:'1px',whiteSpace:'nowrap'}}>{card.title}</Typography>
          <Typography sx={{ color: card.valueColor, fontWeight: 'bold', fontSize: '13px',whiteSpace:'nowrap',marginLeft:'20px' }}>
            {card.value}
          </Typography>
        </Button>
      ))}
    </Box>
  );
};

export default SmallTimeCards;
