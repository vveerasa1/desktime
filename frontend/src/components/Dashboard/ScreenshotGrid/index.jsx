import React from "react";
import { Paper, Box, Grid, Typography, Avatar } from "@mui/material";
import { useGetScreenshotQuery } from "../../../redux/services/dashboard";
import dayjs from "dayjs";
import { useState } from "react";
import ImagePreviewModal from "../ImagePreviewModal";
const ScreenshotGrid = () => {
  const id = "68514f992f863e8d91756a17";
  const date = dayjs().format("YYYY-MM-DD");
  const { data: getScreenshots, isLoading: getScreenshotIsLoading } =
    useGetScreenshotQuery({ id, date });

  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (index) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };
  return (
    <Paper sx={{ padding: "10px 10px", marginTop: "15px" }}>
      <Box>
        <Typography variant="h6" gutterBottom>
          Screenshots
        </Typography>
        <Grid container spacing={2}>
          {getScreenshots &&
            getScreenshots.data.map((shot, idx) => (
              <Grid
                size={{ xs: 12, md: 3 }}
                item
                xs={12}
                sm={6}
                md={3}
                key={idx}
              >
                <Box
                  onClick={() => handleImageClick(idx)}
                  sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 2,cursor:'pointer' }}
                >
                  <img
                    src={shot.screenshotPath}
                    alt={shot.screenshotApp}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                  <Box
                    sx={{
                      p: 1,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2">
                        {shot.screenshotApp}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ fontWeight: 600 }}
                      >
                        {dayjs(shot.screenshotTime).format("HH:mm")}{" "}
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
