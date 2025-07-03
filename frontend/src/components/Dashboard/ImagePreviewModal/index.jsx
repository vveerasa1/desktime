import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import dayjs from "dayjs";
import styles from './index.module.css'
import { useGetSingleProfileQuery } from "../../../redux/services/user";
import { jwtDecode } from "jwt-decode";
const ImagePreviewModal = ({
  open,
  onClose,
  screenshots,
  currentIndex,
  setCurrentIndex,
}) => {

    const token = localStorage.getItem('token');
      let userId = null;
    
      if (token) {
        try {
          const decoded = jwtDecode(token);
          userId = decoded?.userId || decoded?.sub; 
        } catch (err) {
          console.error("Invalid token", err);
        }
      }
    
      const { data: currentUserProfile, isLoading, isError } =
        useGetSingleProfileQuery(userId, {
          skip: !userId
        });
    
      const username = currentUserProfile?.data?.username || "Guest";

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  const currentShot = screenshots[currentIndex];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box className={styles.modalHeader}>
        <Typography variant="h6">{username}</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Box className={styles.imageWrapper}>
          {/* Left Arrow */}
          <IconButton
            onClick={handlePrev}
            className={`${styles.arrowButton} ${styles.arrowLeft}`}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          {/* Image */}
          <img
            src={currentShot.screenshotPath}
            alt={currentShot.screenshotApp}
            className={styles.image}
          />

          {/* Right Arrow */}
          <IconButton
            onClick={handleNext}
            className={`${styles.arrowButton} ${styles.arrowRight}`}
          >
            <ArrowForwardIosIcon />
          </IconButton>

          {/* Details */}
          <Box className={styles.imageDetails}>
            <Typography variant="subtitle1" fontWeight="bold">
              {currentShot.screenshotApp}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {dayjs(currentShot.screenshotTime).format("HH:mm")}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewModal;
