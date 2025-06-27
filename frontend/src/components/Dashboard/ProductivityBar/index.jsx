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
const TRACKED_COLOR = "#4caf50"; // Green for tracked
const UNTRACKED_COLOR = "#b0b0b0"; // Grey for untracked/idle


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
                axisLine={true}
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
            <Area type="monotone" dataKey="unproductive" stackId="1" stroke="#ff7a00" fill="#ff7a00" fillOpacity={0.8} />
            <Area type="monotone" dataKey="neutral" stackId="1" stroke="#b0b0b0" fill="#b0b0b0" fillOpacity={0.8} />
            <Area type="monotone" dataKey="productive" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.8} />
        </AreaChart>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, marginBottom: "15px" }}>
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
