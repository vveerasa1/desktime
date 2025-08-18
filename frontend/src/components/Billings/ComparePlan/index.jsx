import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Fade,
  Zoom,
  Slide,
  Tooltip,
  styled,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import StarIcon from "@mui/icons-material/Star";

const ComparePlan = () => {
  const features = [
    { name: "Time Tracking", pro: true, premium: true, enterprise: true },
    { name: "Screenshots", pro: true, premium: true, enterprise: true },
    {
      name: "Productivity Calculation",
      pro: true,
      premium: true,
      enterprise: true,
    },
    { name: "Project Tracking", pro: true, premium: true, enterprise: true },
    { name: "Shift Scheduling", pro: false, premium: true, enterprise: true },
    { name: "API Access", pro: false, premium: true, enterprise: true },
    { name: "Priority Support", pro: false, premium: false, enterprise: true },
  ];

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: "center",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  }));

  const PlanHeader = ({ title, price, popular, color }) => (
    <Slide direction="down" in={true} timeout={500}>
      <StyledTableCell
        sx={{
          position: "relative ", // Ensures absolute badge is anchored
          backgroundColor: popular ? "#f5f9ff" : "transparent",
          borderLeft: popular ? `2px solid ${color}` : "none",
          borderRight: popular ? `2px solid ${color}` : "none",
          overflow: "visible", // Prevent clipping
          zIndex: popular ? 2 : 1, // Lift the entire cell above others
        }}
      >
        {/* {popular && (
          <Fade in={true} timeout={800}>
            <Box
              sx={{
                position: "absolute",
                top: -12,
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: color,
                color: "white",
                px: 2,
                py: 0.5,
                borderRadius: "12px",
                fontSize: "0.75rem",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                zIndex: 9999, // Just a number, no !important
                boxShadow: 1,
                pointerEvents: "none", // Prevent interfering with clicks
              }}
            >
              <StarIcon sx={{ fontSize: "1rem", mr: 0.5 }} />
              MOST POPULAR
            </Box>
          </Fade>
        )} */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mt: popular ? 0 : 0 }}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {popular ? "FOR GROWING TEAMS" : "ADVANCED FEATURES"}
        </Typography>
        <Box sx={{ my: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color }}>
            {price}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            per user/month
          </Typography>
        </Box>
        <Zoom in={true} timeout={600}>
          <Button
            variant={popular ? "contained" : "outlined"}
            size="small"
            sx={{
              borderRadius: "20px",
              textTransform: "none",
              backgroundColor: popular ? color : "transparent",
              color: popular ? "white" : color,
              borderColor: color,
              "&:hover": {
                backgroundColor: popular ? `${color}dd` : `${color}11`,
              },
            }}
          >
            Start Free Trial
          </Button>
        </Zoom>
      </StyledTableCell>
    </Slide>
  );

  const FeatureCell = ({ available, animated = true }) => (
    <StyledTableCell>
      {animated ? (
        <Fade in={true} timeout={800}>
          <Box>
            {available ? (
              <CheckCircleIcon color="success" />
            ) : (
              <CancelIcon  sx={{ opacity: 0.5,color:'red' }} />
            )}
          </Box>
        </Fade>
      ) : (
        <Box>
          {available ? (
            <CheckCircleIcon color="success" />
          ) : (
            <CancelIcon color="error" sx={{ opacity: 0.5 }} />
          )}
        </Box>
      )}
    </StyledTableCell>
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ mb: 4, fontWeight: "bold" }}
      >
        Compare Plans
      </Typography>

      <TableContainer
        component={Paper}
        elevation={4}
        sx={{ borderRadius: "12px", overflow: "hidden" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: "30%", textAlign: "left" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Features
                </Typography>
              </StyledTableCell>
              <PlanHeader title="Pro" price="$7" color="#2196f3" popular />
              <PlanHeader title="Premium" price="$10" color="#ff9800" />
              <PlanHeader title="Enterprise" price="Custom" color="#9c27b0" />
            </TableRow>
          </TableHead>
          <TableBody>
            {features.map((feature, index) => (
              <Fade in={true} timeout={(index + 1) * 200} key={feature.name}>
                <TableRow hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                  <StyledTableCell sx={{ textAlign: "left" }}>
                    <Tooltip title={feature.name} placement="right">
                      <Typography>{feature.name}</Typography>
                    </Tooltip>
                  </StyledTableCell>
                  <FeatureCell available={feature.pro} animated={index > 0} />
                  <FeatureCell
                    available={feature.premium}
                    animated={index > 0}
                  />
                  <FeatureCell
                    available={feature.enterprise}
                    animated={index > 0}
                  />
                </TableRow>
              </Fade>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Need help choosing the right plan?{" "}
          <Button color="primary">Contact us</Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default ComparePlan;
