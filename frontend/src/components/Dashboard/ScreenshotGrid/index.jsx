import React from "react";
import { Paper, Box, Grid, Typography, Avatar } from "@mui/material";
import { useGetScreenshotQuery } from "../../../redux/services/dashboard";
import dayjs from "dayjs";
import { useState } from "react";
import styles from './index.module.css';
import ImagePreviewModal from "../ImagePreviewModal";
import { jwtDecode } from "jwt-decode";
import CameraAltIcon from '@mui/icons-material/CameraAlt'; // Import a camera icon

// Define a color for no data background
const NO_DATA_COLOR = "#F5F5F5"; // A light grey for the dummy cards background

const ScreenshotGrid = ({ filters, employee }) => {
  const token = localStorage.getItem('token');
  let userId = null;
  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.userId || employee;
  }

  const { data: getScreenshots, isLoading: getScreenshotIsLoading } =
    useGetScreenshotQuery({ id: employee || userId, date: filters.date });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  // Dummy data for when no screenshots are available
  const dummyScreenshots = [
    { id: 1, screenshotPath: '', screenshotApp: 'Tracked app or URL'},
    { id: 2, screenshotPath: '', screenshotApp: 'Tracked app or URL' },
    { id: 3, screenshotPath: '', screenshotApp: 'Tracked app or URL' },
    { id: 4, screenshotPath: '', screenshotApp: 'Tracked app or URL' },

  ];

  return (
    <Paper className={styles.container}>
      <Box py={2} px={2}>
        <Typography variant="h6"
          sx={{ fontSize: "18px", fontWeight: '600 !important', mb: 2 }}>
          Screenshots
        </Typography>

        {(!getScreenshots?.data || getScreenshots.data.length === 0) ? (
          <Box sx={{ position: 'relative', }}>
            <Grid container spacing={4}>
              {dummyScreenshots.map((shot, idx) => (
                <Grid item size={{xs:12,md:3}} key={shot.id}> {/* Changed size to xs:12, sm:6, md:3 for better responsiveness */}
                  <Box
                    className={styles.screenshotCard}
                    sx={{
                      backgroundColor: NO_DATA_COLOR,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 180, // Fixed height for dummy cards
                      cursor: 'default', // Remove pointer cursor for dummy cards
                    }}
                  >
                    <CameraAltIcon sx={{ fontSize: 70, color: '#B0B0B0', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {shot.screenshotApp}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2, // Ensure it's above the dummy cards
                bgcolor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white background
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)', // More prominent shadow
                borderRadius: '8px',
                padding: '20px 30px',
                textAlign: 'center',
                maxWidth: '80%',
                opacity:'0.7'
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(55, 52, 52, 0.9)',
                  mb: 1,
                  fontWeight: 'bold',
                  fontSize:"18px"
                }}
              >
                No data collected
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#888',
                  fontSize:"15px"
                }}
              >
                Download and log into the TrackMe app to automatically take screenshots.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {getScreenshots?.data?.map((shot, idx) => (
              <Grid item xs={12} sm={6} md={3} key={shot.id || idx}> {/* Use xs, sm, md for responsiveness */}
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
        )}
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