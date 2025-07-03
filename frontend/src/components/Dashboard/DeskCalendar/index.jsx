import React, { useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Box, Typography } from "@mui/material";
import styles from "./index.module.css";
import dayjs from "dayjs";
// --- Helper Functions ---

/**
 * Converts a time string (HH:MM or Xm Ys) to total minutes.
 * @param {string} timeString - The time string to convert.
 * @returns {number} Total minutes.
 */
const timeToMinutes = (timeString) => {
  console.log(timeString, "TIME");
  if (!timeString) return 0;

  let totalMinutes = 0;

  if (
    typeof timeString === "string" &&
    timeString.includes("m") &&
    timeString.includes("s")
  ) {
    const minutesMatch = timeString.match(/(\d+)m/);
    const secondsMatch = timeString.match(/(\d+)s/);

    if (minutesMatch?.[1]) {
      totalMinutes += parseInt(minutesMatch[1], 10);
    }

    if (secondsMatch?.[1]) {
      totalMinutes += Math.ceil(parseInt(secondsMatch[1], 10) / 60); // Round seconds to full minute
    }
  } else if (typeof timeString === "string" && timeString.includes(":")) {
    const [hours, minutes] = timeString.split(":").map(Number);
    totalMinutes = hours * 60 + minutes;
  } else if (typeof timeString === "number") {
    totalMinutes = timeString;
  }

  return totalMinutes;
};

/**
 * Converts total minutes to "Xh Ym" format for display.
 * @param {number} totalMinutes - The total minutes to format.
 * @returns {string} Formatted time string.
 */
const formatMinutesToHoursMinutes = (totalMinutes) => {
  console.log(totalMinutes,"totalMinutesLLLLLLLLLLLLLLLL")
  if (typeof totalMinutes !== "number" || totalMinutes < 0) return "N/A";

  const hours = Math.floor(totalMinutes / 60);
  console.log(totalMinutes,hours)
  const minutes = totalMinutes % 60;

  console.log(totalMinutes,hours,minutes,`${hours}h ${minutes}m`)

  return `${hours}h ${minutes}m`;
};

/**
 * Renders the content of each day cell in the calendar.
 */
function renderDayCell(arg, apiSessionData, userData) {
  // Use 'en-CA' for YYYY-MM-DD format, which is typically good for API keys.
  // Make sure your apiSessionData keys match this format.
  const dateStr = arg.date.toLocaleDateString("en-CA");
  const data = apiSessionData[dateStr];

  let statusClass = ""; // For the background color/overall status
  let arrivalTimeClass = ""; // For styling arrival time specifically

  const minimumHoursMinutes = userData?.minimumHours
    ? parseInt(userData.minimumHours.split(" ")[0]) * 60
    : 0;
  const trackingStartTimeMinutes = userData?.trackingStartTime
    ? timeToMinutes(userData.trackingStartTime)
    : 0;
  const arrivalMinutes = data?.arrival ? timeToMinutes(data.arrival) : 0;
  const workedMinutes = data?.worked ? timeToMinutes(data.worked) : 0;
  const deskTimeMinutes = data?.deskTime ? timeToMinutes(data.deskTime) : 0;

  // --- Determine Status and Styling ---
  if (data?.status === "working") {
    statusClass = styles.working; // Explicitly set as working if API says so
  } else if (
    !data ||
    (data.status === "completed" && !data.arrival && !data.worked)
  ) {
    // No data for the day, or completed with no attendance info (implies absent)
    statusClass = styles.absent;
  } else if (data.status === "completed" && data.arrival) {
    // If completed and has arrival data, check worked hours against minimum
    if (workedMinutes < minimumHoursMinutes) {
      statusClass = styles.low; // Less than minimum hours
    } else {
      statusClass = styles.normal; // Met or exceeded minimum hours
    }

    // Check if arrival is before tracking start time for red text
    if (arrivalMinutes > 0 && arrivalMinutes < trackingStartTimeMinutes) {
      // Only apply if there's an actual arrival time
      arrivalTimeClass = styles.lateArrival; // Class for red text
    }
  }

  return (
    <Box className={`${styles.dayCell} ${statusClass}`}>
      <Box className={styles.statusBar}></Box>

      <Box sx={{ marginTop: "10px" }}>
        <Typography className={styles.dayNumber}>
          {arg.dayNumberText}
        </Typography>

        {/* Render content based on mapped data and determined statusClass */}
        {statusClass === styles.absent ? (
          <Typography className={styles.absentText}></Typography>
        ) : statusClass === styles.working ? (
          <Typography className={styles.workingText}>Working</Typography>
        ) : data && data.arrival ? ( // Details for completed days with attendance
          <Box className={styles.textAlign}>
            <Box className={styles.progressBarContainer}>
              {/* Green bar for worked time, Gray bar for idle/untracked time within deskTime */}
              {(() => {
                const effectiveDeskTimeMinutes =
                  deskTimeMinutes > 0 ? deskTimeMinutes : 1; // Avoid division by zero
                const workedPercentage =
                  (workedMinutes / effectiveDeskTimeMinutes) * 100;
                const idlePercentage = 100 - workedPercentage;
                return (
                  <>
                    <Box
                      className={styles.greenBar}
                      style={{ width: `${workedPercentage}%` }}
                    ></Box>
                    <Box
                      className={styles.grayBar}
                      style={{ width: `${idlePercentage}%` }}
                    ></Box>
                  </>
                );
              })()}
            </Box>
            <Typography className={`${styles.arrived} ${arrivalTimeClass}`}>
              Arrived at: {data.arrival}
            </Typography>
            <Typography className={styles.left}>
              Left at: {data.left || "N/A"}
            </Typography>
            <Typography className={styles.worked}>
              Worked for: {formatMinutesToHoursMinutes(workedMinutes)}
            </Typography>
            <Typography className={styles.text}>
              Desk Time: {formatMinutesToHoursMinutes(deskTimeMinutes)}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

// --- Main Calendar Component ---
export default function EmployeeCalendar({ getProductiviyData, filters }) {
  const apiSessionData = getProductiviyData?.data?.session || {};
  const userData = getProductiviyData?.data?.user || {};

  // Create a ref to access the FullCalendar component's API
  const calendarRef = useRef(null);

  const goToDate = (date) => {
    console.log(date);

    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(date);
    }
  };
  console.log(filters.date);

  useEffect(() => {
    if (filters?.date) {
      const parsedDate = dayjs(filters.date, "YYYY-MM-DD").toDate();
      goToDate(parsedDate);
    }

    // goToDate(new Date(filters.date));
  }, [filters.date]);
  // Pass all necessary data to renderDayCell via a wrapper
  const customDayCellContent = (arg) =>
    renderDayCell(arg, apiSessionData, userData);

  return (
    <div style={{ padding: 16 }}>
      <FullCalendar
        ref={calendarRef} // Assign the ref here
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        // 'initialDate' can also be used to set the initial visible date, e.g., '2025-06-01'
        // initialDate="2025-06-01" // This will make it start on June 2025

        height="auto"
        dayCellContent={customDayCellContent}
        contentHeight="auto"
        fixedWeekCount={false}
        dayMaxEventRows={1}
        headerToolbar={{
          start: "title",
          end: "prev,next", // Ensure prev/next buttons are visible for user navigation
          center: "",
        }}
        // Callback fired when the calendar's dates change (e.g., user clicks prev/next)
        // You can use this to fetch new data relevant to the displayed month
        datesSet={(dateInfo) => {
          // dateInfo.start and dateInfo.end represent the visible date range in the calendar
          console.log(
            "Calendar view changed. New range:",
            dateInfo.start,
            dateInfo.end
          );
          // Example: If your API needs to be called when the month changes, do it here
          // fetchProductivityDataForMonth(dateInfo.start.getFullYear(), dateInfo.start.getMonth());
        }}
        dayCellClassNames={(arg) => {
          // Ensure consistent date formatting with how apiSessionData keys are structured
          const dateStr = arg.date.toLocaleDateString("en-CA");
          const data = apiSessionData[dateStr];

          const minimumHoursMinutes = userData?.minimumHours
            ? parseInt(userData.minimumHours.split(" ")[0]) * 60
            : 0;
          const workedMinutes = data?.worked ? timeToMinutes(data.worked) : 0;

          // Prioritize 'working' status if present in API data
          if (data?.status === "working") {
            return styles.workingClass;
          } else if (
            !data ||
            (data.status === "completed" && !data.arrival && !data.worked)
          ) {
            return styles.absentClass;
          } else if (data.status === "completed" && data.arrival) {
            if (workedMinutes < minimumHoursMinutes) {
              return styles.low;
            } else {
              return styles.normal;
            }
          }
          return styles.fixedCell; // Default catch-all
        }}
      />
      {/* Example: Add a button to go to a specific month programmatically */}
      {/* <button onClick={() => goToDate(new Date(2025, 5, 1))}>Go to June 2025</button> */}
    </div>
  );
}
