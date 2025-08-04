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
const dayTimeLabels = [];

for (let hour = 8; hour <= 22; hour++) {
  const formatted = hour.toString().padStart(2, "0") + ":00";
  dayTimeLabels.push(formatted);
}

// --- Styling Constants ---
const TRACKED_COLOR = "#3BA5E3"; // Blue for tracked
const UNTRACKED_COLOR = "white"; // Grey for untracked/idle
const NO_DATA_COLOR = "#E0E0E0"; // Light grey for no data bars

const ProductivityBar = ({ getProductiviyData,isSnap,title  }) => {
  const productivity = getProductiviyData?.data;

  let currentViewMode = "day";
  let sessionList = [];
  let noDataCollected = false;

  if (Array.isArray(productivity?.session) && productivity.session.length > 0) {
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
  } else {
    noDataCollected = true;
  }

  let currentChartComponent;
  let chartTitle;

  // Create a dummy data array that contains all dayTimeSlots for the XAxis
  const xAxisDummyData = dayTimeSlots.map((slot) => ({ time: slot, value: 0 }));

  if (noDataCollected) {
    chartTitle = "Productivity Timeline";
    const noDataChartData = dayTimeSlots.map((slot) => ({
      time: slot,
      // For no data, we'll set a dummy value to make the bar visible
      // and let the fill color be NO_DATA_COLOR
      noDataValue: 100, // This will make the bar fill 100% of the height
      productive: 0,
      neutral: 0,
      unproductive: 0,
      apps: [],
      total: "",
      isTracked: false,
    }));

    currentChartComponent = (
      <>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 180,
            backgroundColor: "",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={noDataChartData}
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
              {/* Render a single bar with the noDataValue to show the grey bars */}
              <Bar dataKey="noDataValue" stackId="a" fill={NO_DATA_COLOR} />
            </BarChart>
          </ResponsiveContainer>
          <Box
            sx={{
              position: "absolute",
              top: "57%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
              bgcolor: "white", // White background
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Subtle box shadow
              borderRadius: "4px", // Optional: for rounded corners
              padding: "20px", // Optional: Add some padding around the text
              opacity: "0.5",
              textAlign: 'center'
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                color: "#151515",
                fontSize: "18px",
              }}
            >
              No data collected
            </Typography>
            <Typography
              sx={{
                color: "#666",
                fontSize: "15px",
              }}
            >
              Download and log into the desktop app to track time and measure
              productivity
            </Typography>
          </Box>
        </Box>
        <ActivityTimelineBar
          // For the activity timeline, if no data, render all untracked with NO_DATA_COLOR if you wish
          // Or pass an empty array to render no activity bars
          currentNormalizedData={noDataChartData.map((d) => ({
            ...d,
            isTracked: false,
          }))} // Ensure activity bar shows "untracked" look
          TRACKED_COLOR={TRACKED_COLOR}
          UNTRACKED_COLOR={NO_DATA_COLOR} // Use NO_DATA_COLOR for untracked in this state
        />
        <Box sx={{ width: "100%", height: 30, mt: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={xAxisDummyData}
              layout="horizontal"
              margin={{ top: 0, right: 30, left: 80, bottom: 2 }}
            >
              <XAxis
                dataKey="time"
                type="category"
                axisLine={false}
                tickLine={false}
                ticks={dayTimeLabels}
                tick={{ fontSize: 10, fill: "#666", dy: 10 }}
                interval={0}
                padding={{ left: 0, right: 0 }}
                minTickGap={-10}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </>
    );
  } else if (currentViewMode === "day") {
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
    chartTitle = "Productivity Timeline";
    currentChartComponent = (
      <>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 180,
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
              <Bar dataKey="productive" stackId="a" fill="#5FBA2B" />
              <Bar dataKey="neutral" stackId="a" fill="#ffffffff" />
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
        <Box sx={{ width: "100%", height: 30, mt: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={xAxisDummyData} // Use dummy data with all time slots
              layout="horizontal"
              margin={{ top: 0, right: 30, left: 80, bottom: 2 }}
            >
              <XAxis
                dataKey="time"
                type="category"
                axisLine={false}
                tickLine={false}
                ticks={dayTimeLabels}
                tick={{ fontSize: 10, fill: "#666", dy: 10 }}
                interval={0}
                padding={{ left: 0, right: 0 }}
                minTickGap={-10}
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
              {
                productive: 0,
                neutral: 0,
                unproductive: 0,
                apps: [],
                total: "",
              },
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

    const sortedDates = Array.from(dailyDataMaps.keys()).sort(
      (a, b) => new Date(a) - new Date(b)
    );

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
          elevation={1}
          sx={{
            mb: 3,
            p: 2,
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
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
              height: 200,
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
                <Bar dataKey="productive" stackId="a" fill="#5FBA2B" />
                <Bar dataKey="neutral" stackId="a" fill="#ffffffff" />
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
          <Box sx={{ width: "100%", height: 30, mt: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={xAxisDummyData} // Use dummy data with all time slots
                layout="horizontal"
                margin={{ top: 0, right: 30, left: 80, bottom: 2 }}
              >
                <XAxis
                  dataKey="time"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  ticks={dayTimeLabels}
                  tick={{ fontSize: 9, fill: "#666", dy: 10 }}
                  interval={0}
                  padding={{ left: 0, right: 0 }}
                  minTickGap={-10}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      );
    });
  }

  return (
    <Paper elevation={3} sx={{ p: 2, marginBottom: "15px" }}>
      <Box sx={{ p: 2 }}>
        {<Typography
          sx={{ fontSize: "18px", fontWeight: "600 !important", mb: 2 }}
        >
          {title||chartTitle}
        </Typography>
        }
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
