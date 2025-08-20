import { Box, Tooltip, styled } from "@mui/material";
import styles from './index.module.css'
import OfflineTrackingModal from "../OfflineTrackingModal";
import { useState } from "react";
import MuiToaster from "../../../MuiToaster";

const APPROVED_OFFLINE_COLOR = "#C1E4F7";
const PENDING_OFFLINE_COLOR = "#E0E0E0";
const PENDING_OFFLINE_BORDER_COLOR = "#8C8C8C";

// Create a custom styled Tooltip with white background
const WhiteTooltip = styled(Tooltip)(({ theme }) => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: '#ffffff',
    color: '#333333',
    fontSize: '12px',
    borderRadius: '6px',
    padding: '8px 12px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e0e0e0',
  },
  '& .MuiTooltip-arrow': {
    color: '#ffffff',
    '&::before': {
      border: '1px solid #e0e0e0',
    }
  },
}));

const SimpleWhiteTooltip = ({ children, ...props }) => (
  <Tooltip
    {...props}
    slotProps={{
      tooltip: {
        sx: {
          backgroundColor: '#ffffff',
          color: '#333333',
          fontSize: '12px',
          borderRadius: '6px',
          padding: '8px 12px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e0e0e0',
        }
      },
      arrow: {
        sx: {
          color: '#ffffff',
          '&::before': {
            border: '1px solid #e0e0e0',
          }
        }
      }
    }}
  >
    {children}
  </Tooltip>
);

const ActivityTimelineBar = ({
  currentNormalizedData,
  TRACKED_COLOR,
  UNTRACKED_COLOR,
  ownerId,
  employee,
  userId
}) => {
  const [open, setOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState({ start: null, end: null });
  const [toaster, setToaster] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    description: "",
    projectName: "",
    taskName: "",
    startTime: "",
    endTime: ""
  })
  const [errors, setErrors] = useState({});

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
    setFormData({
      description: "",
      projectName: "",
      taskName: "",
      startTime: "",
      endTime: "",
    })
    setErrors({})
  };

  // Function to convert time difference to hours and minutes format
  const getDurationInHoursAndMinutes = (startTime, endTime) => {
  console.log(startTime, endTime, "TIME");
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  // Calculate total minutes between start and end time
  let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  console.log(totalMinutes, "TOTAL");
  
  // For single time slots (like 09:00 - 09:00), add 15 minutes
  // For ranges (like 09:00 - 10:30), the duration is already correct
  if (startTime === endTime) {
    totalMinutes += 15;
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h${minutes > 0 ? `${minutes}m` : ''}`;
  } else {
    return `${minutes}m`;
  }
};

  const processTimelineData = (data) => {
    const processedBlocks = [];
    let i = 0;
    
    while (i < data.length) {
      const currentBlock = data[i];

      if (currentBlock.isTracked) {
        // For tracked blocks, find the continuous range but handle offline requests individually
        let j = i;
        let trackedStartTime = data[j].time;
        let trackedEndTime = data[j].time;
        let isOfflineRequest = currentBlock.isOfflineRequest || false;
        let offlineRequestStatus = currentBlock.status || null;

        // Check if we should group tracked blocks (only if they have the same offline status)
        while (j < data.length && data[j].isTracked) {
          const nextBlock = data[j];
          const nextIsOfflineRequest = nextBlock.isOfflineRequest || false;
          const nextOfflineStatus = nextBlock.status || null;
          
          // Only group if offline status is the same
          if (isOfflineRequest !== nextIsOfflineRequest || 
              offlineRequestStatus !== nextOfflineStatus) {
            break;
          }
          
          trackedEndTime = nextBlock.time;
          j++;
        }

        const duration = j - i;
        
        processedBlocks.push({
          type: 'tracked',
          startTime: trackedStartTime,
          endTime: trackedEndTime,
          duration: duration,
          isOfflineRequest: isOfflineRequest,
          offlineRequestStatus: offlineRequestStatus,
        });
        i = j;
      } else {
        // Untracked blocks processing - group consecutive untracked blocks
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
            console.log(block,"BLOV")
            const blockWidth = `calc(100% / ${currentNormalizedData.length} * ${block.duration})`;
            const durationText = getDurationInHoursAndMinutes(block.startTime, block.endTime);
            
            // Create appropriate tooltip text based on block type and offline status
            let tooltipText;
            if (block.type === 'tracked') {
              if (block.isOfflineRequest) {
                // Offline tracked time
                if (block.duration > 1) {
                  tooltipText = `Offline Time, ${durationText}`;
                } else {
                  tooltipText = `Offline Time, ${durationText}`;
                }
              } else {
                // Regular tracked time
                if (block.duration > 1) {
                  tooltipText = `Tracked Time, ${durationText}`;
                } if(block.offlineRequestStatus === "Approved"){
                  tooltipText = `Offline Time, ${durationText}`;
                } else {
                  tooltipText = `Tracked Time, ${durationText}`;
                }
              }
            } else {
              // Idle time
              tooltipText = `Idle Time, ${durationText}`;
            }

            // Add offline status to tooltip if applicable
            if (block.isOfflineRequest) {
              if (block.offlineRequestStatus === "Pending") {
                tooltipText += " - Pending Approval";
              } else if (block.offlineRequestStatus === "Approved") {
                tooltipText += " - Approved";
              }
            }

            if (block.type === 'tracked') {
              let backgroundColor = TRACKED_COLOR;
              let borderColor = 'transparent';

              const isPendingOffline = block.offlineRequestStatus === "Pending";
              const isApprovedOffline = block.offlineRequestStatus === "Approved";

              if (isPendingOffline) {
                backgroundColor = PENDING_OFFLINE_COLOR;
                borderColor = PENDING_OFFLINE_BORDER_COLOR;
              } else if (isApprovedOffline) {
                backgroundColor = APPROVED_OFFLINE_COLOR;
              }

              return (
                <SimpleWhiteTooltip 
                  key={index} 
                  title={tooltipText} 
                  arrow 
                  placement="bottom"
                >
                  <Box
                    sx={{
                      flexBasis: blockWidth,
                      cursor: 'pointer',
                      backgroundColor: backgroundColor,
                      border: `2px solid ${borderColor}`,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        border: '2px dashed #54c2f1ff',
                      }
                    }}
                  />
                </SimpleWhiteTooltip>
              );
            } else {
              let backgroundColor = UNTRACKED_COLOR;
              let borderColor = 'transparent';

              const isPendingOffline = block.isOfflineRequest && block.offlineRequestStatus === "Pending";
              const isApprovedOffline = block.isOfflineRequest && block.offlineRequestStatus === "Approved";

              if (isPendingOffline) {
                backgroundColor = PENDING_OFFLINE_COLOR;
                borderColor = PENDING_OFFLINE_BORDER_COLOR;
              } else if (isApprovedOffline) {
                backgroundColor = APPROVED_OFFLINE_COLOR;
              }

              return (
                <SimpleWhiteTooltip 
                  key={index} 
                  title={tooltipText} 
                  arrow 
                  placement="bottom"
                >
                  <Box
                    sx={{
                      flexBasis: blockWidth,
                      cursor: 'pointer',
                      backgroundColor: backgroundColor,
                      border: `2px solid ${borderColor}`,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        border: '2px dashed #9fa1a2ff',
                      }
                    }}
                    onClick={() => handleOpen(block.startTime, block.endTime)}
                  />
                </SimpleWhiteTooltip>
              );
            }
          })}
        </Box>
      </Box>
      <OfflineTrackingModal
        ownerId={ownerId}
        openToaster={handleOpenToaster}
        open={open}
        handleClose={handleClose}
        timeSlotStart={selectedTimeRange.start}
        timeSlotEnd={selectedTimeRange.end}
        errors={errors}
        setErrors={setErrors}
        formData={formData}
        setFormData={setFormData}
        employee={employee}
        userId={userId}
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