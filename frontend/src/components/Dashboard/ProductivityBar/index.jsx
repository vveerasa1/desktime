import React from 'react';
import { Paper, Box, Typography } from "@mui/material";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";
import CustomTooltip from "../CustomTooltip";
import ActivityTimelineBar from './ActivityTimelineBar';

// --- Helper Functions ---
const timeToMinutes = (timeString) => {
  if (!timeString) return 0;
  if (typeof timeString === 'number') {
    return timeString;
  }
  if (typeof timeString === 'string' && timeString.includes(':')) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }
  try {
    const dateObj = new Date(timeString);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.getHours() * 60 + dateObj.getMinutes();
    }
  } catch (e) {
    // console.error("Failed to parse timeString:", timeString, e);
  }
  return 0;
};

const getNearestSlotTime = (minutes) => {
  const roundedMinutes = Math.floor(minutes / 5) * 5;
  const hour = Math.floor(roundedMinutes / 60);
  const minute = roundedMinutes % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const generateTimeSlots = (start, end, interval) => {
  const slots = [];
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  let current = startMinutes;

  while (current <= endMinutes) {
    const hour = Math.floor(current / 60)
      .toString()
      .padStart(2, "0");
    const minute = (current % 60).toString().padStart(2, "0");
    const label = `${hour}:${minute}`;
    slots.push(label);
    current += interval;
  }
  return slots;
};

// --- Time Slot and Label Definitions ---
const dayTimeSlots = generateTimeSlots("08:00", "22:00", 5);
const dayTimeLabels = [
  "08:00", "10:00", "12:00", "14:00",
  "16:00", "18:00", "20:00", "22:00"
];

const weekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekTimeSlots = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekTimeLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


// --- Styling Constants ---
const TRACKED_COLOR = "#5664e7"; // Green for tracked
const UNTRACKED_COLOR = "white"; // Grey for untracked/idle


const ProductivityBar = ({ getProductiviyData }) => {
  const productivity = getProductiviyData?.data;

  // --- Determine viewMode based on data structure ---
  let currentViewMode = 'day'; // Default to day view
  let sessionList = [];

  if (Array.isArray(productivity?.session)) {
    // Check if the primary 'session' array contains 'date' property and 'session' array within
    // This heuristic determines if it's weekly data (an array of daily summaries)
    const isAPIMoreThanOneDay =
      productivity.session.length > 0 &&
      productivity.session[0]?.date &&
      Array.isArray(productivity.session[0]?.session);

    if (isAPIMoreThanOneDay) {
      currentViewMode = 'week';
      // Flatten week data: [{date: "...", session: [...]}, ...] -> [{time: "...", date: "..."}, ...]
      sessionList = productivity.session.flatMap((day) =>
        (day.session || []).map((s) => ({ ...s, date: day.date }))
      );
    } else {
      currentViewMode = 'day';
      // It's already single day data: [{time: "...", apps: [...]}, ...]
      sessionList = productivity.session.map((s) => ({
        ...s,
        date: productivity.date, // Ensure date is present if coming from a higher level
      }));
    }
  }


  // --- Data Aggregation and Normalization based on currentViewMode ---
  let currentNormalizedData = [];
  let currentChartComponent;
  let currentLabels;

  if (currentViewMode === 'day') {
    // DAY VIEW LOGIC (Aggregates to 5-minute slots)
    const aggregatedDataMap = new Map(
      dayTimeSlots.map(slot => [slot, { productive: 0, neutral: 0, unproductive: 0, apps: [], total: "" }])
    );

    sessionList.forEach(item => {
      // Filter sessions for the specific day if data contains multiple days (e.g., if a week dataset was passed, but we are in derived day mode)
      // For single-day data, productivity.date will already match item.date (if present)
      const targetDate = productivity.date; // The specific date for the day view
      if (!targetDate || item.date === targetDate) { // If targetDate is not specified, assume all data is for the day
        const itemMinutes = timeToMinutes(item.time);
        const slotKey = getNearestSlotTime(itemMinutes);

        if (aggregatedDataMap.has(slotKey)) {
          const currentSlotData = aggregatedDataMap.get(slotKey);
          currentSlotData.productive += item.productive;
          currentSlotData.neutral += item.neutral;
          currentSlotData.unproductive += item.break || 0;
          currentSlotData.apps = [...currentSlotData.apps, ...item.apps];
          if (item.total) { currentSlotData.total = item.total; }
        }
      }
    });

    currentNormalizedData = dayTimeSlots.map(slot => {
      const data = aggregatedDataMap.get(slot);
      const total = data.productive + data.neutral + data.unproductive;
      let isTracked = false;

      if (total > 0) {
        isTracked = true;
        return {
          time: slot,
          productive: (data.productive / total) * 100,
          neutral: (data.neutral / total) * 100,
          unproductive: (data.unproductive / total) * 100,
          apps: data.apps,
          total: data.total,
          isTracked: isTracked
        };
      } else {
        return {
          time: slot,
          productive: 0,
          neutral: 0,
          unproductive: 0,
          apps: [],
          total: "",
          isTracked: isTracked
        };
      }
    });

    currentLabels = dayTimeLabels;

    // Chart component for Day View: BarChart
    currentChartComponent = (
        <BarChart
            data={currentNormalizedData}
            barSize={15}
            barGap={0}
            barCategoryGap={'10%'}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
            <XAxis // XAxis is retained here for proper chart functionality
                dataKey="time"
                axisLine={false}
                tickLine={false}
                ticks={currentLabels}
                tick={{ fontSize: 10, fill: "#666", dy: 10 }}
            />
            <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 10, fill: "#666" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="productive" stackId="a" fill="#4caf50" />
            <Bar dataKey="neutral" stackId="a" fill="#9e9e9e" />
            <Bar dataKey="unproductive" stackId="a" fill="#ffc107" />
        </BarChart>
    );

  } else { // currentViewMode === 'week'
    // WEEK VIEW LOGIC (Aggregates to daily data)
    const aggregatedWeekDataMap = new Map(
        weekTimeSlots.map(day => [day, { productive: 0, neutral: 0, unproductive: 0, isTracked: false }])
    );

    sessionList.forEach(item => {
        const itemDate = new Date(item.date);
        const dayOfWeekIndex = itemDate.getDay();
        const dayName = weekDayNames[dayOfWeekIndex];

        if (aggregatedWeekDataMap.has(dayName)) {
            const currentDayData = aggregatedWeekDataMap.get(dayName);
            currentDayData.productive += item.productive;
            currentDayData.neutral += item.neutral;
            currentDayData.unproductive += item.break || 0;
            currentDayData.isTracked = true;
        }
    });

    currentNormalizedData = weekTimeSlots.map(day => {
        const data = aggregatedWeekDataMap.get(day);
        const total = data.productive + data.neutral + data.unproductive;

        if (total > 0) {
            return {
                time: day, // X-axis data key (e.g., "Mon")
                productive: (data.productive / total) * 100,
                neutral: (data.neutral / total) * 100,
                unproductive: (data.unproductive / total) * 100,
                isTracked: data.isTracked
            };
        } else {
            return {
                time: day,
                productive: 0,
                neutral: 0,
                unproductive: 0,
                isTracked: false
            };
        }
    });

    currentLabels = weekTimeLabels;

    // Chart component for Week View: AreaChart (wavy bar)
    currentChartComponent = (
        <AreaChart
            data={currentNormalizedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
            <XAxis // XAxis is retained here for proper chart functionality
                dataKey="time"
                axisLine={false}
                tickLine={false}
                ticks={currentLabels}
                tick={{ fontSize: 10, fill: "#666", dy: 10 }}
            />
            <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 10, fill: "#666" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="unproductive" stackId="1" stroke="#ff7a00" fill="#ffc107" fillOpacity={0.8} />
            <Area type="monotone" dataKey="neutral" stackId="1" stroke="#b0b0b0" fill="#b0b0b0" fillOpacity={0.8} />
            <Area type="monotone" dataKey="productive" stackId="1" stroke="#82ca9d" fill="#4caf50" fillOpacity={0.8} />
        </AreaChart>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, marginBottom: "15px",marginTop:2 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#333", mb: 2 }}>
          {currentViewMode === 'day' ? 'Daily Productivity Timeline' : 'Weekly Productivity Timeline'}
        </Typography>

        {/* Main Chart Area */}
        <Box sx={{ position: "relative", width: "100%", height: 250, backgroundColor: '', borderRadius: '4px' }}>
          <ResponsiveContainer width="100%" height="100%">
            {currentChartComponent}
          </ResponsiveContainer>
        </Box>

        <ActivityTimelineBar
          currentNormalizedData={currentNormalizedData}
          TRACKED_COLOR={TRACKED_COLOR}
          UNTRACKED_COLOR={UNTRACKED_COLOR}
        />

      </Box>
    </Paper>
  );
};

export default ProductivityBar;
// import React from 'react';
// import { Paper, Box, Typography } from '@mui/material';
// import { Customized } from 'recharts';

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer
// } from 'recharts';
// import CustomTooltip from '../CustomTooltip';
// const preData = [
//   { time: '07:00', productive: 10, neutral: 20, break: 0, apps: [] },
//   { time: '07:12', productive: 30, neutral: 10, break: 0, apps: [] },
//   { time: '07:24', productive: 20, neutral: 25, break: 0, apps: [] },
//   { time: '07:36', productive: 40, neutral: 10, break: 0, apps: [] },
//   { time: '07:48', productive: 30, neutral: 15, break: 0, apps: [] },
//   { time: '08:00', productive: 25, neutral: 30, break: 0, apps: [] },
//   { time: '08:12', productive: 50, neutral: 10, break: 0, apps: [] },
//   { time: '08:24', productive: 40, neutral: 20, break: 0, apps: [] },
//   { time: '08:36', productive: 35, neutral: 15, break: 0, apps: [] },
//   { time: '08:48', productive: 45, neutral: 5, break: 0, apps: [] }
// ];

// const productivityData = [
//   ...preData,
//   { time: '09:00', productive: 60, neutral: 20, break: 0, apps: [] },
//   { time: '10:00', productive: 45, neutral: 25, break: 0, apps: [] },
//   {
//     time: '10:30',
//     productive: 70,
//     neutral: 25,
//     break: 0,
//     timeRange: '10:30 - 10:45',
//     apps: [
//       { name: 'localhost', time: '3m 29s', type: 'productive' },
//       { name: 'PickerHost', time: '2s', type: 'neutral' },
//       { name: 'ShellExperienceHost', time: '1m 27s', type: 'productive' },
//       { name: 'SnippingTool', time: '2s', type: 'neutral' }
//     ],
//     total: '5m 0s'
//   },
//   {
//     time: '10:35',
//     productive: 75,
//     neutral: 25,
//     break: 0,
//     timeRange: '10:35 - 10:40',
//     apps: [
//       { name: 'localhost', time: '3m 29s', type: 'productive' },
//       { name: 'PickerHost', time: '2s', type: 'neutral' },
//       { name: 'ShellExperienceHost', time: '1m 27s', type: 'productive' },
//       { name: 'SnippingTool', time: '2s', type: 'neutral' }
//     ],
//     total: '5m 0s'
//   },
//   {
//     time: '10:40',
//     productive: 75,
//     neutral: 25,
//     break: 0,
//     timeRange: '10:40 - 10:45',
//     apps: [
//       { name: 'localhost', time: '3m 29s', type: 'productive' },
//       { name: 'PickerHost', time: '2s', type: 'neutral' },
//       { name: 'ShellExperienceHost', time: '1m 27s', type: 'productive' },
//       { name: 'SnippingTool', time: '2s', type: 'neutral' }
//     ],
//     total: '5m 0s'
//   },
//   { time: '11:00', productive: 40, neutral: 30, break: 15, apps: [] },
//   { time: '12:00', productive: 0, neutral: 0, break: 60, apps: [] },
//   { time: '13:00', productive: 50, neutral: 25, break: 0, apps: [] },
//   { time: '14:00', productive: 35, neutral: 30, break: 0, apps: [] },
//   { time: '15:00', productive: 0, neutral: 0, break: 0, apps: [] },
//   { time: '16:00', productive: 0, neutral: 0, break: 0, apps: [] },
//   { time: '17:00', productive: 0, neutral: 0, break: 0, apps: [] },
//   { time: '18:00', productive: 0, neutral: 0, break: 0, apps: [] },
//   { time: '19:00', productive: 0, neutral: 0, break: 0, apps: [] },
//   { time: '20:00', productive: 0, neutral: 0, break: 0, apps: [] },
//   { time: '21:00', productive: 0, neutral: 0, break: 0, apps: [] }
// ];

// const generateTimeSlots = (start, end, interval = 5) => {
//   const slots = [];
//   const startHour = parseInt(start.split(':')[0], 10);
//   const endHour = parseInt(end.split(':')[0], 10);
//   let current = startHour * 60;

//   while (current < endHour * 60) {
//     const hour = Math.floor(current / 60).toString().padStart(2, '0');
//     const minute = (current % 60).toString().padStart(2, '0');
//     const label = `${hour}:${minute}`;
//     slots.push(label);
//     current += interval;
//   }

//   return slots;
// };

// const timeSlots = generateTimeSlots('07:00', '20:00', 5);

// const timeLabels = ['07:00', '09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00'];

// const ProductivityBar = ({ data = productivityData }) => {
//   const normalizedData = timeSlots.map((slot) => {
//     const existing = productivityData.find((item) => item.time === slot);
//     return {
//       time: slot,
//       productive: existing?.productive || 0,
//       neutral: existing?.neutral || 0,
//       break: existing?.break || 0,
//       apps: existing?.apps || [],
//       total: existing?.total || '',
//     };
//   });
//   const BAR_SIZE = 4;

//   return (
//     <Paper elevation={3} sx={{ p: 2,marginBottom:'15px' }}>
//     <Box
//       sx={{
//         // backgroundColor: 'white',
//         // borderRadius: 2,
//         // boxShadow: 1,
//         p: 2
//       }}
//     >
//       <Typography
//         variant="subtitle2"
//         sx={{ fontWeight: 600, color: '#333', mb: 2 }}
//       >
//         Productivity Bar
//       </Typography>

//       <Box sx={{ position: 'relative', width: '100%', height: 250 }}>
//         <ResponsiveContainer width="100%" height="100%">

//           <BarChart 
          
//             data={normalizedData}
//             barSize={4}              // small bar
//             // barGap={1}               // 1px gap between stacked bars
//             barGap={0}
//             barCategoryGap={0}
//             // barCategoryGap="10%"     // reduce space between categories (tweak if bars overflow)
//           >
//             {/* <XAxis
//               dataKey="time"
//               // axisLine={false}
//               tick={false}
//               tickLine={false}
//             /> */}
//             <Customized
//               component={({ xAxisMap, height, width, offset }) => {
//                 console.log(width,offset)
//                 const barWidth = width / normalizedData.length;
//                 console.log(Math.round(barWidth))
//                 const x0 = offset.left;
//                 console.log((offset.left),"offset.left")

//                 return (
//                   <g>
//                     {normalizedData.map((d, i) => {
//                         const hasData = d.productive > 0 || d.neutral > 0 || d.break > 0;
//                         const x = x0 + i * BAR_SIZE;
                     
//                       return (
//                         <rect
//                           key={i}
//                           x={(offset.left + i * barWidth)}
//                           y={offset.top + height - 14}
//                           width={barWidth}
//                           height={60}
//                           fill={hasData ? '#4caf50' : '#e0e0e0'}
//                           rx={0}
//                         />
//                       );
//                     })}
//                   </g>
//                 );
//               }}
//             />

//             <YAxis
//               domain={[0, 100]}
//               axisLine={false}
//               tickLine={false}
//               tickFormatter={(value) => `${value}%`}

//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Bar dataKey="productive" stackId="a" fill="#4caf50"  barSize={BAR_SIZE}/>
//             <Bar dataKey="neutral" stackId="a" fill="#9e9e9e" barSize={BAR_SIZE} />
//           </BarChart>
//         </ResponsiveContainer>
//       </Box>
    
//     </Box>
//       <Box
//       sx={{
//         // position: 'absolute',
//         bottom: '-55px',
//         height: 20,
//         width:`98%`,
//         backgroundColor: '#e0e0e0',
//         borderRadius: '4px',
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         // mt: 1,
//         // px: 1,
//         // left: 40, // matches BarChart's left margin
//         // right: 20, // matches BarChart's right margin
//         marginLeft: '25px',
//         marginRight: '75px',
//         left: '143px',
//         right: '-23px',
//       }}
//     >
//       {timeLabels.map((label, index) => (
//         <Box
//           key={index}
//           sx={{
//             flex: 1,
//             textAlign: 'center'
//           }}
//         >
//           <Typography
//             variant="caption"
//             sx={{ fontSize: '10px', color: '#333' }}
//           >
//             {label}
//           </Typography>
//         </Box>
//       ))}
//     </Box>
//     </Paper>
//   );
// };

// export default ProductivityBar;