import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import CustomTooltip from "../CustomTooltip";
import ActivityTimelineBar from "./ActivityTimelineBar";

// --- Helper Functions ---
const timeToMinutes = (timeString) => {
  if (!timeString) return 0;
  if (typeof timeString === "number") {
    return timeString;
  }
  if (typeof timeString === "string" && timeString.includes(":")) {
    const [hours, minutes] = timeString.split(":").map(Number);
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
  const minute = (roundedMinutes % 60).toString().padStart(2, "0");
  return `${String(hour).padStart(2, "0")}:${minute}`;
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
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
  "20:00",
  "22:00",
];

// --- Styling Constants ---
const TRACKED_COLOR = "#5664e7"; // Blue for tracked
const UNTRACKED_COLOR = "white"; // Grey for untracked/idle


const ProductivityBar = ({ getProductiviyData }) => {
  const productivity = getProductiviyData?.data;

  let currentViewMode = "day";
  let sessionList = [];

  if (Array.isArray(productivity?.session)) {
    const isAPIMoreThanOneDay =
      productivity.session.length > 0 &&
      productivity.session[0]?.date &&
      Array.isArray(productivity.session[0]?.session);

    if (isAPIMoreThanOneDay) {
      currentViewMode = "week";
      sessionList = productivity.session.flatMap((day) =>
        (day.session || []).map((s) => ({ ...s, date: day.date }))
      );
    } else {
      currentViewMode = "day";
      sessionList = productivity.session.map((s) => ({
        ...s,
        date: productivity.date,
      }));
    }
  }

  let currentChartComponent;
  let chartTitle;

  // Create a dummy data array that contains all dayTimeSlots for the XAxis
  const xAxisDummyData = dayTimeSlots.map(slot => ({ time: slot, value: 0 }));


  if (currentViewMode === "day") {
    const aggregatedDataMap = new Map(
      dayTimeSlots.map((slot) => [
        slot,
        { productive: 0, neutral: 0, unproductive: 0, apps: [], total: "" },
      ])
    );

    sessionList.forEach((item) => {
      const targetDate = productivity.date;
      if (!targetDate || item.date === targetDate) {
        const itemMinutes = timeToMinutes(item.time);
        const slotKey = getNearestSlotTime(itemMinutes);

        if (aggregatedDataMap.has(slotKey)) {
          const currentSlotData = aggregatedDataMap.get(slotKey);
          currentSlotData.productive += item.productive;
          currentSlotData.neutral += item.neutral;
          currentSlotData.unproductive += item.break || 0;
          currentSlotData.apps = [...currentSlotData.apps, ...item.apps];
          if (item.total) {
            currentSlotData.total = item.total;
          }
        }
      }
    });

    const dayNormalizedData = dayTimeSlots.map((slot) => {
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
          isTracked: isTracked,
        };
      } else {
        return {
          time: slot,
          productive: 0,
          neutral: 0,
          unproductive: 0,
          apps: [],
          total: "",
          isTracked: isTracked,
        };
      }
    });

    chartTitle = "Daily Productivity Timeline";
    currentChartComponent = (
      <>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 250,
            backgroundColor: "",
            borderRadius: "4px",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dayNormalizedData}
              barSize={15}
              barGap={0}
              barCategoryGap={"10%"}
              margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
            >
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
          </ResponsiveContainer>
        </Box>
        <ActivityTimelineBar
          currentNormalizedData={dayNormalizedData}
          TRACKED_COLOR={TRACKED_COLOR}
          UNTRACKED_COLOR={UNTRACKED_COLOR}
        />
        {/* Render XAxis separately below the ActivityTimelineBar */}
        <Box sx={{ width: '100%', height: 30, mt: 0, /* px: '20px' */ }}> {/* Removed px here as it's handled by margin below */}
           <ResponsiveContainer width="100%" height="100%">
             <BarChart
               data={xAxisDummyData} // Use dummy data with all time slots
               layout="horizontal"
               margin={{ top: 0, right: 30, left: 80, bottom: 2 }} // Match main chart's horizontal margins
             >
               <XAxis
                 dataKey="time"
                 type="category"
                 axisLine={false}
                 tickLine={false}
                 ticks={dayTimeLabels}
                 tick={{ fontSize: 10, fill: "#666", dy: 10 }}
                 interval={0}
                 // Adjust padding to align with the bars above
                 padding={{ left: 0, right: 0 }} // Explicitly set padding
                 minTickGap={-10} // Allow ticks to be closer if needed
               />
             </BarChart>
           </ResponsiveContainer>
         </Box>
      </>
    );
  } else {
    // currentViewMode === 'week' - RENDER MULTIPLE DAILY BARS IN SEPARATE Paper COMPONENTS
    chartTitle = "Weekly Productivity Timeline";
    const dailyDataMaps = new Map();

    sessionList.forEach((item) => {
      const itemDate = new Date(item.date).toDateString();
      if (!dailyDataMaps.has(itemDate)) {
        dailyDataMaps.set(
          itemDate,
          new Map(
            dayTimeSlots.map((slot) => [
              slot,
              { productive: 0, neutral: 0, unproductive: 0, apps: [], total: "" },
            ])
          )
        );
      }
      const aggregatedDataMap = dailyDataMaps.get(itemDate);
      const itemMinutes = timeToMinutes(item.time);
      const slotKey = getNearestSlotTime(itemMinutes);

      if (aggregatedDataMap.has(slotKey)) {
        const currentSlotData = aggregatedDataMap.get(slotKey);
        currentSlotData.productive += item.productive;
        currentSlotData.neutral += item.neutral;
        currentSlotData.unproductive += item.break || 0;
        currentSlotData.apps = [...currentSlotData.apps, ...item.apps];
        if (item.total) {
          currentSlotData.total = item.total;
        }
      }
    });

    const sortedDates = Array.from(dailyDataMaps.keys()).sort((a, b) => new Date(a) - new Date(b));

    currentChartComponent = sortedDates.map((dateString) => {
      const aggregatedDataMap = dailyDataMaps.get(dateString);
      const dailyNormalizedData = dayTimeSlots.map((slot) => {
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
            isTracked: isTracked,
          };
        } else {
          return {
            time: slot,
            productive: 0,
            neutral: 0,
            unproductive: 0,
            apps: [],
            total: "",
            isTracked: false,
          };
        }
      });

      return (
        <Paper
          key={dateString}
          elevation={1} // Subtle shadow for the box
          sx={{
            mb: 3, // Margin bottom for separation between daily boxes
            p: 2, // Padding inside each daily box
            borderRadius: "8px", // Rounded corners
            border: "1px solid #e0e0e0", // A light border for definition
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#555", mb: 1 }}
          >
            {new Date(dateString).toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 200, // Bar height as set previously
              borderRadius: "4px",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailyNormalizedData}
                barSize={15}
                barGap={0}
                barCategoryGap={"10%"}
                margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
              >
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 9, fill: "#666" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="productive" stackId="a" fill="#4caf50" />
                <Bar dataKey="neutral" stackId="a" fill="#9e9e9e" />
                <Bar dataKey="unproductive" stackId="a" fill="#ffc107" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <ActivityTimelineBar
            currentNormalizedData={dailyNormalizedData}
            TRACKED_COLOR={TRACKED_COLOR}
            UNTRACKED_COLOR={UNTRACKED_COLOR}
          />
          {/* Render XAxis separately below the ActivityTimelineBar */}
          <Box sx={{ width: '100%', height: 30, mt: 0, /* px: '20px' */ }}> {/* Removed px here */}
             <ResponsiveContainer width="100%" height="100%">
               <BarChart
                 data={xAxisDummyData} // Use dummy data with all time slots
                 layout="horizontal"
                 margin={{top: 0, right: 30, left: 80, bottom: 2 }} // Match main chart's horizontal margins
               >
                 <XAxis
                   dataKey="time"
                   type="category"
                   axisLine={false}
                   tickLine={false}
                   ticks={dayTimeLabels}
                   tick={{ fontSize: 9, fill: "#666", dy: 10 }}
                   interval={0}
                   // Adjust padding to align with the bars above
                   padding={{ left: 0, right: 0 }} // Explicitly set padding
                   minTickGap={-10} // Allow ticks to be closer if needed
                 />
               </BarChart>
             </ResponsiveContainer>
           </Box>
        </Paper>
      );
    });
  }

  return (
    <Paper elevation={3} sx={{ p: 2, marginBottom: "15px", marginTop: 2 }}>
      <Box sx={{ p: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: "#333", mb: 2 }}
        >
          {chartTitle}
        </Typography>

        <Box
          sx={{
            width: "100%",
          }}
        >
          {currentChartComponent}
        </Box>
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
