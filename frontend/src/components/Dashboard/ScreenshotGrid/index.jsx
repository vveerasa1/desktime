import React from "react";
import { Paper, Box, Grid, Typography, Avatar } from "@mui/material";
import { useGetScreenshotQuery } from "../../../redux/services/dashboard";
import dayjs from "dayjs";
import { useState } from "react";
import styles from './index.module.css'
import ImagePreviewModal from "../ImagePreviewModal";
const ScreenshotGrid = ({ filters }) => {
  const id = "685a3e5726ac65ec09c16786";
  const date = dayjs().format("YYYY-MM-DD");
  const { data: getScreenshots, isLoading: getScreenshotIsLoading } =
    useGetScreenshotQuery({ id, date: filters.date });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };
  return (
    <Paper className={styles.container}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Screenshots
        </Typography>
        <Grid container spacing={2}>
          {getScreenshots?.data?.map((shot, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx} size={{xs:2,md:3}}>
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
