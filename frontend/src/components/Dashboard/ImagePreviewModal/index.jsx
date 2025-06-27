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

const ImagePreviewModal = ({
  open,
  onClose,
  screenshots,
  currentIndex,
  setCurrentIndex,
}) => {
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  const currentShot = screenshots[currentIndex];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
        <Typography variant="h6">User</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Box sx={{ position: "relative", textAlign: "center" }}>
          {/* Left Arrow */}
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255,255,255,0.6)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          {/* Image */}
          <img
            src={currentShot.screenshotPath}
            alt={currentShot.screenshotApp}
            style={{
              maxHeight: "70vh",
              width: "auto",
              maxWidth: "100%",
              margin: "0 auto",
            }}
          />

          {/* Right Arrow */}
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255,255,255,0.6)",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>

          {/* Details */}
          <Box sx={{ mt: 2 }}>
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
