import { Box, Button, Typography } from "@mui/material";
import styles from './index.module.css'
import OfflineTrackingModal from "../OfflineTrackingModal";
import { useState } from "react";

const ActivityTimelineBar = ({
  currentNormalizedData,
  TRACKED_COLOR,
  UNTRACKED_COLOR,
}) => {
  const [open, setOpen] = useState(false);
  const [formData,setFormData] = useState({
    description:"",
    projectName:"",
    taskName:"",
    startTime:"",
    endTime:""
  })
    const [errors, setErrors] = useState({});
  
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
const handleChange = (event,name) =>{
  const {value} = event.target
    setFormData((prev)=>({
      ...prev,[name]:value
    }))
   if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
} 

const handleBlur = (event, name) => {
    if (formData[name].trim() === "") {
      setErrors({
        ...errors,
        [name]: `${[name]} is required.`,
      });
    }
  };
  return (
    <Box sx={{marginTop:-3}}>
      {/* --- Activity Timeline Bar Below Chart --- */}
      <Box className={styles.wrapper} onClick={handleOpen}> {/* Add onClick here */}
        <Box className={styles.timelineContainer}>
          {currentNormalizedData.map((d, index) => (
            <Box
              key={index}
              className={styles.timelineBlock}
              style={{
                flexBasis: `calc(100% / ${currentNormalizedData.length})`,
                backgroundColor: d.isTracked ? TRACKED_COLOR : UNTRACKED_COLOR,
              }}
              title={`${d.time} - ${d.isTracked ? "Tracked" : "Untracked"}`}
            />
          ))}
        </Box>
      </Box>
      <OfflineTrackingModal setFormData={setFormData} errors={errors} handleBlur={handleBlur} open={open} handleClose={handleClose} handleChange={handleChange} formData={formData}  /> {/* Pass handleClose to the modal */}
    </Box>
  );
};

export default ActivityTimelineBar;