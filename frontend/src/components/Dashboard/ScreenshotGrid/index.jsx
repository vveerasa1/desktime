import React from "react";
import { Paper, Box, Grid, Typography, Avatar } from "@mui/material";
import { useGetScreenshotQuery } from "../../../redux/services/dashboard";
import dayjs from "dayjs";
import { useState } from "react";
import styles from './index.module.css'
import ImagePreviewModal from "../ImagePreviewModal";
import { jwtDecode } from "jwt-decode";
const ScreenshotGrid = ({ filters,employee }) => {
  console.log(employee,"ScreeNSHOT EMPLOYEEE")
  const token = localStorage.getItem('token')
  let userId = null
  if(token){
    const decoded = jwtDecode(token)
    userId = decoded.userId || employee
  }


  const date = dayjs().format("YYYY-MM-DD");
  const { data: getScreenshots, isLoading: getScreenshotIsLoading } =
useGetScreenshotQuery({ id: employee || userId, date: filters.date });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };
  return (
    <Paper className={styles.container}>
      <Box py={2} px={2}>
        <Typography variant="h6" gutterBottom>
          Screenshots
        </Typography>
        <Grid container spacing={4}>
          {getScreenshots?.data?.map((shot, idx) => (
            <Grid item size={{xs:2,md:3}}>
              <Box
                className={styles.screenshotCard}
                onClick={() => handleImageClick(idx)}
              >
                <img
                  src={shot.screenshotPath}
                  alt={shot.screenshotApp}
                  className={styles.screenshotImage}
                />
                <Box className={styles.screenshotFooter}>
                  <Box className={styles.appInfo}>
                    <Typography variant="body2">
                      {shot.screenshotApp}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      className={styles.timeText}
                    >
                      {dayjs(shot.screenshotTime).format("HH:mm")}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {getScreenshots?.data?.length > 0 && (
        <ImagePreviewModal
          employee={employee}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          screenshots={getScreenshots.data}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      )}
    </Paper>
  );
};

export default ScreenshotGrid;
