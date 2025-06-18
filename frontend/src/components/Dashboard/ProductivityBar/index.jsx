import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { Customized } from 'recharts';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import CustomTooltip from '../CustomTooltip';
const preData = [
  { time: '07:00', productive: 10, neutral: 20, break: 0, apps: [] },
  { time: '07:12', productive: 30, neutral: 10, break: 0, apps: [] },
  { time: '07:24', productive: 20, neutral: 25, break: 0, apps: [] },
  { time: '07:36', productive: 40, neutral: 10, break: 0, apps: [] },
  { time: '07:48', productive: 30, neutral: 15, break: 0, apps: [] },
  { time: '08:00', productive: 25, neutral: 30, break: 0, apps: [] },
  { time: '08:12', productive: 50, neutral: 10, break: 0, apps: [] },
  { time: '08:24', productive: 40, neutral: 20, break: 0, apps: [] },
  { time: '08:36', productive: 35, neutral: 15, break: 0, apps: [] },
  { time: '08:48', productive: 45, neutral: 5, break: 0, apps: [] }
];

const productivityData = [
  ...preData,
  { time: '09:00', productive: 60, neutral: 20, break: 0, apps: [] },
  { time: '10:00', productive: 45, neutral: 25, break: 0, apps: [] },
  {
    time: '10:30',
    productive: 70,
    neutral: 25,
    break: 0,
    timeRange: '10:30 - 10:45',
    apps: [
      { name: 'localhost', time: '3m 29s', type: 'productive' },
      { name: 'PickerHost', time: '2s', type: 'neutral' },
      { name: 'ShellExperienceHost', time: '1m 27s', type: 'productive' },
      { name: 'SnippingTool', time: '2s', type: 'neutral' }
    ],
    total: '5m 0s'
  },
  {
    time: '10:35',
    productive: 75,
    neutral: 25,
    break: 0,
    timeRange: '10:35 - 10:40',
    apps: [
      { name: 'localhost', time: '3m 29s', type: 'productive' },
      { name: 'PickerHost', time: '2s', type: 'neutral' },
      { name: 'ShellExperienceHost', time: '1m 27s', type: 'productive' },
      { name: 'SnippingTool', time: '2s', type: 'neutral' }
    ],
    total: '5m 0s'
  },
  {
    time: '10:40',
    productive: 75,
    neutral: 25,
    break: 0,
    timeRange: '10:40 - 10:45',
    apps: [
      { name: 'localhost', time: '3m 29s', type: 'productive' },
      { name: 'PickerHost', time: '2s', type: 'neutral' },
      { name: 'ShellExperienceHost', time: '1m 27s', type: 'productive' },
      { name: 'SnippingTool', time: '2s', type: 'neutral' }
    ],
    total: '5m 0s'
  },
  { time: '11:00', productive: 40, neutral: 30, break: 15, apps: [] },
  { time: '12:00', productive: 0, neutral: 0, break: 60, apps: [] },
  { time: '13:00', productive: 50, neutral: 25, break: 0, apps: [] },
  { time: '14:00', productive: 35, neutral: 30, break: 0, apps: [] },
  { time: '15:00', productive: 0, neutral: 0, break: 0, apps: [] },
  { time: '16:00', productive: 0, neutral: 0, break: 0, apps: [] },
  { time: '17:00', productive: 0, neutral: 0, break: 0, apps: [] },
  { time: '18:00', productive: 0, neutral: 0, break: 0, apps: [] },
  { time: '19:00', productive: 0, neutral: 0, break: 0, apps: [] },
  { time: '20:00', productive: 0, neutral: 0, break: 0, apps: [] },
  { time: '21:00', productive: 0, neutral: 0, break: 0, apps: [] }
];

const generateTimeSlots = (start, end, interval = 5) => {
  const slots = [];
  const startHour = parseInt(start.split(':')[0], 10);
  const endHour = parseInt(end.split(':')[0], 10);
  let current = startHour * 60;

  while (current < endHour * 60) {
    const hour = Math.floor(current / 60).toString().padStart(2, '0');
    const minute = (current % 60).toString().padStart(2, '0');
    const label = `${hour}:${minute}`;
    slots.push(label);
    current += interval;
  }

  return slots;
};

const timeSlots = generateTimeSlots('07:00', '20:00', 5);

const timeLabels = ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'];

const ProductivityBar = ({ data = productivityData }) => {
  const normalizedData = timeSlots.map((slot) => {
    const existing = productivityData.find((item) => item.time === slot);
    return {
      time: slot,
      productive: existing?.productive || 0,
      neutral: existing?.neutral || 0,
      break: existing?.break || 0,
      apps: existing?.apps || [],
      total: existing?.total || '',
    };
  });
  const BAR_SIZE = 4;

  return (
    <Paper elevation={3} sx={{ p: 2,marginBottom:'15px' }}>
    <Box
      sx={{
        // backgroundColor: 'white',
        // borderRadius: 2,
        // boxShadow: 1,
        p: 2
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 600, color: '#333', mb: 2 }}
      >
        Productivity Bar
      </Typography>

      <Box sx={{ position: 'relative', width: '100%', height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">

          <BarChart 
          
            data={normalizedData}
            barSize={4}              // small bar
            // barGap={1}               // 1px gap between stacked bars
            barGap={0}
            barCategoryGap={0}
            // barCategoryGap="10%"     // reduce space between categories (tweak if bars overflow)
          >
            {/* <XAxis
              dataKey="time"
              // axisLine={false}
              tick={false}
              tickLine={false}
            /> */}
            <Customized
              component={({ xAxisMap, height, width, offset }) => {
                console.log(width,offset)
                const barWidth = width / normalizedData.length;
                console.log(Math.round(barWidth))
                const x0 = offset.left;
                console.log((offset.left),"offset.left")

                return (
                  <g>
                    {normalizedData.map((d, i) => {
                        const hasData = d.productive > 0 || d.neutral > 0 || d.break > 0;
                        const x = x0 + i * BAR_SIZE;
                     
                      return (
                        <rect
                          key={i}
                          x={(offset.left + i * barWidth)}
                          y={offset.top + height - 14}
                          width={barWidth}
                          height={60}
                          fill={hasData ? '#4caf50' : '#e0e0e0'}
                          rx={0}
                        />
                      );
                    })}
                  </g>
                );
              }}
            />

            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}

            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="productive" stackId="a" fill="#4caf50"  barSize={BAR_SIZE}/>
            <Bar dataKey="neutral" stackId="a" fill="#9e9e9e" barSize={BAR_SIZE} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    
    </Box>
      <Box
      sx={{
        // position: 'absolute',
        bottom: '-55px',
        height: 20,
        width:`98%`,
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        // mt: 1,
        // px: 1,
        // left: 40, // matches BarChart's left margin
        // right: 20, // matches BarChart's right margin
        marginLeft: '25px',
        marginRight: '75px',
        left: '143px',
        right: '-23px',
      }}
    >
      {timeLabels.map((label, index) => (
        <Box
          key={index}
          sx={{
            flex: 1,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontSize: '10px', color: '#333' }}
          >
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
    </Paper>
  );
};

export default ProductivityBar;
