// import { Box, Button, Typography } from "@mui/material";
// import styles from './index.module.css'
// import OfflineTrackingModal from "../OfflineTrackingModal";
// import { useState } from "react";

// const ActivityTimelineBar = ({
//   currentNormalizedData,
//   TRACKED_COLOR,
//   UNTRACKED_COLOR,
// }) => {
//   const [open, setOpen] = useState(false);

//   const [selectedTimeRange, setSelectedTimeRange] = useState({ start: null, end: null });
//   console.log(currentNormalizedData, "currentNormalizedData")
//   const handleOpen = (startTime, endTime) => {
//     setSelectedTimeRange({ start: startTime, end: endTime });
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedTimeRange({ start: null, end: null });

//   };
//   const processTimelineData = (data) => {
//     const processedBlocks = [];
//     let i = 0;
//     while (i < data.length) {
//       const currentBlock = data[i];
//       console.log(currentBlock, "currentBlock")

//       if (currentBlock.isTracked) {
//         // If it's a tracked block, just add it to the processed list as-is.
//         processedBlocks.push({
//           ...currentBlock,
//           type: 'tracked',
//           duration: 1, // Represents one time slot
//         });
//         i++;
//       } else {
//         // If it's an untracked block, start cumulating.
//         let j = i;
//         const cumulativeStartTime = data[j].time;
//         while (j < data.length && !data[j].isTracked) {
//           j++;
//         }
//         // The end time is the start time of the next tracked block, or the end of the day.
//         const cumulativeEndTime = j < data.length ? data[j].time : "22:00"; // Assuming 22:00 is the end of the day

//         processedBlocks.push({
//           type: 'untracked',
//           startTime: cumulativeStartTime,
//           endTime: cumulativeEndTime,
//           duration: j - i, // Number of untracked blocks
//         });
//         i = j; // Move the index to the end of the untracked block
//       }
//     }
//     return processedBlocks;
//   };

//   const processedBlocks = processTimelineData(currentNormalizedData);

//   return (
//     <Box sx={{ marginTop: -3 }}>
//       {/* --- Activity Timeline Bar Below Chart --- */}

//       <Box className={styles.wrapper}>
//         <Box className={styles.timelineContainer}>
//           {processedBlocks.map((block, index) => {
//             const blockWidth = `calc(100% / ${currentNormalizedData.length} * ${block.duration})`;
//             let backgroundColor = TRACKED_COLOR;
//             const blockStyle = {
//               flexBasis: blockWidth,
//               backgroundColor: UNTRACKED_COLOR,
//               cursor: 'pointer',
//             };
//             console.log(block, "blockblockblock")
//             if (block.status === "Pending") {
//               blockStyle.className = styles.pendingOffline; // Apply the cross-hatch class

//               backgroundColor = "#8C8C8C"; // Light blue for approved
//             } else if (block.status === "Approved") {
//               backgroundColor = "#A0D7FF"; // Dark gray for pending
//             }

//             // if (isPendingOffline) {
//             // }


//             if (block.type === 'tracked') {
//               return (
//                 <Box
//                   key={index}
//                   className={styles.timelineBlock}
//                   // style={{
//                   //   flexBasis: blockWidth,
//                   //   backgroundColor: backgroundColor || TRACKED_COLOR,
//                   // }}
//                   style={{
//                     flexBasis: blockWidth,
//                     backgroundColor: backgroundColor || TRACKED_COLOR,
//                     backgroundImage: 'linearGradient(45deg, #ccc 25%, transparent 25%, transparent 50%, #ccc 50%, #ccc 75%, transparent 75%, transparent)',
// backgroundSize: '10px 10px',

//                     // ...blockStyle
//                   }}
//                   title={`${block.time} - Tracked`}
//                 />
//               );
//             } else { // type === 'untracked'
//               return (
//                 <Box
//                   key={index}
//                   className={styles.timelineBlock}
//                   style={{
//                     flexBasis: blockWidth,
//                     backgroundColor: UNTRACKED_COLOR,
//                     cursor: 'pointer',
//                   }}
//                   title={`Untracked time: ${block.startTime} - ${block.endTime}`}
//                   onClick={() => handleOpen(block.startTime, block.endTime)}
//                 />
//               );
//             }
//           })}
//         </Box>
//       </Box>
//       <OfflineTrackingModal
//         // setFormData={setFormData} errors={errors} 
//         // handleBlur={handleBlur} 
//         open={open}
//         handleClose={handleClose}
//         //  handleChange={handleChange} formData={formData} 
//         timeSlotStart={selectedTimeRange.start}
//         timeSlotEnd={selectedTimeRange.end}
//       /> {/* Pass handleClose to the modal */}

//     </Box>
//   );
// };

// export default ActivityTimelineBar;import { Box, Button, Typography } from "@mui/material";
import { Box, Button, Typography } from "@mui/material";
import styles from './index.module.css'
import OfflineTrackingModal from "../OfflineTrackingModal";
import { useState } from "react";
import MuiToaster from "../../../MuiToaster";
// Assuming these color constants are defined elsewhere or in the parent component
const APPROVED_OFFLINE_COLOR = "#e4f0f8ff"; // Light blue for approved
const PENDING_OFFLINE_COLOR = "#E0E0E0"; // Light gray for pending (background)
const PENDING_OFFLINE_BORDER_COLOR = "#8C8C8C"; // Darker gray for the lines

const ActivityTimelineBar = ({
  currentNormalizedData,
  TRACKED_COLOR,
  UNTRACKED_COLOR,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState({ start: null, end: null });
 const [toaster, setToaster] = useState({
    open: false,
    message: "",
    severity: "success",
  });

   const handleOpenToaster = (message, severity = "success") => {
    setToaster({ open: true, message, severity });
  };

  const handleCloseToaster = () => {
    setToaster({ ...toaster, open: false });
  };
  const handleOpen = (startTime, endTime) => {
    setSelectedTimeRange({ start: startTime, end: endTime });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTimeRange({ start: null, end: null });
  };

  const processTimelineData = (data) => {
    const processedBlocks = [];
    let i = 0;
    while (i < data.length) {
      const currentBlock = data[i];

      if (currentBlock.isTracked) {
        processedBlocks.push({
          ...currentBlock,
          type: 'tracked',
          duration: 1,
          // Check for offline request within tracked blocks (if applicable)
          isOfflineRequest: currentBlock.isOfflineRequest || false,
          offlineRequestStatus: currentBlock.status || null,
        });
        i++;
      } else {
        let j = i;
        const cumulativeStartTime = data[j].time;
        let isOfflineRequest = false;
        let offlineRequestStatus = null;

        while (j < data.length && !data[j].isTracked) {
          if (data[j].isOfflineRequest) {
            isOfflineRequest = true;
            offlineRequestStatus = data[j].status;
          }
          j++;
        }

        const cumulativeEndTime = j < data.length ? data[j].time : "22:00";

        processedBlocks.push({
          type: 'untracked',
          startTime: cumulativeStartTime,
          endTime: cumulativeEndTime,
          duration: j - i,
          isOfflineRequest: isOfflineRequest,
          offlineRequestStatus: offlineRequestStatus,
        });
        i = j;
      }
    }
    return processedBlocks;
  };

  const processedBlocks = processTimelineData(currentNormalizedData);

  return (
    <Box sx={{ marginTop: -3 }}>
      <Box className={styles.wrapper}>
        <Box className={styles.timelineContainer}>
          {processedBlocks.map((block, index) => {
            const blockWidth = `calc(100% / ${currentNormalizedData.length} * ${block.duration})`;

            if (block.type === 'tracked') {
              // Tracked blocks: solid color, no special styles.
              let backgroundColor = TRACKED_COLOR;
              let blockClasses = [styles.timelineBlock];
              let blockStyles = {
                flexBasis: blockWidth,
                cursor: 'pointer',
                backgroundColor:backgroundColor,
              };
              // If for some reason a tracked block has an offline request status,
              // apply the appropriate color. This is just for robustness.
              // if (block.isOfflineRequest && block.offlineRequestStatus === "Approved") {
              //   backgroundColor = APPROVED_OFFLINE_COLOR;
              // } else if (block.isOfflineRequest && block.status === "Pending") {
              //   backgroundColor = PENDING_OFFLINE_COLOR;
              // }
              const isPendingOffline = block.status === "Pending";
              const isApprovedOffline = block.status === "Approved";

              if (isPendingOffline) {
                blockClasses.push(styles.pendingOffline);
                // Set the base color for the cross-hatch effect
                blockStyles.backgroundColor = PENDING_OFFLINE_COLOR;
              } else if (isApprovedOffline) {
                console.log(isApprovedOffline,"isApprovedOffline",APPROVED_OFFLINE_COLOR)
                // Approved offline requests have a solid light blue background
                blockStyles.backgroundColor =APPROVED_OFFLINE_COLOR
                blockClasses.push(styles.approvedOffline);
              } else {
                // Default untracked blocks are white
                blockStyles.backgroundColor = UNTRACKED_COLOR;
              }
              
              return (
                <Box
                  key={index}
                  // className={styles.timelineBlock}
                  style={{
                    flexBasis: blockWidth,
                    backgroundColor: backgroundColor,
                  }}
                  className={blockClasses.join(' ')}

                  title={`${block.time} - Tracked`}
                />
              );
            } else { // type === 'untracked'
              let blockClasses = [styles.timelineBlock];
              let blockStyles = {
                flexBasis: blockWidth,
                cursor: 'pointer',
              };

              const isPendingOffline = block.isOfflineRequest && block.offlineRequestStatus === "Pending";
              const isApprovedOffline = block.isOfflineRequest && block.offlineRequestStatus === "Approved";

              if (isPendingOffline) {
                blockClasses.push(styles.pendingOffline);
                // Set the base color for the cross-hatch effect
                blockStyles.backgroundColor = PENDING_OFFLINE_COLOR;
              } else if (isApprovedOffline) {
                // Approved offline requests have a solid light blue background
                blockStyles.backgroundColor = APPROVED_OFFLINE_COLOR;
              } else {
                // Default untracked blocks are white
                blockStyles.backgroundColor = UNTRACKED_COLOR;
              }

              return (
                <Box
                  key={index}
                  className={blockClasses.join(' ')}
                  style={blockStyles}
                  title={`Untracked time: ${block.startTime} - ${block.endTime}`}
                  onClick={() => handleOpen(block.startTime, block.endTime)}
                />
              );
            }
          })}
        </Box>
      </Box>
      <OfflineTrackingModal
        openToaster={handleOpenToaster}
        open={open}
        handleClose={handleClose}
        timeSlotStart={selectedTimeRange.start}
        timeSlotEnd={selectedTimeRange.end}
      />

      <MuiToaster
              open={toaster.open}
              message={toaster.message}
              severity={toaster.severity}
              handleClose={handleCloseToaster}
            />
    </Box>
  );
};

export default ActivityTimelineBar;