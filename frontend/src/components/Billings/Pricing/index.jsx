import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Grid,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  Chip,
  ListItemText,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WhatshotIcon from '@mui/icons-material/Whatshot';
const PricingPlans = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        Unlock a 30% productivity boost
      </Typography>
      <Typography
        variant="h6"
        align="center"
        color="text.secondary"
        sx={{ mb: 6 }}
      >
        The industry-leading automatic time tracking and management system.
      </Typography>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={3} justifyContent="center">
        {/* Pro Plan */}
        <Grid item  xs={12} md={4}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              borderRadius: "12px",
              transition: "all 0.3s ease !importnat",
              border: "1px solid #143351", // define what to animate
              "&:hover": {
                border: "1px solid white",
                boxShadow: "0px 0px 5px -1px",
                cursor: "pointer",
                transition: 0.3,
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  Pro
                </Box>
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                FOR SMALL TEAMS AND STARTUPS
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                ₹366.67
              </Typography>
              <Typography fontSize={13} color="text.secondary">
                Per user/month
              </Typography>
              <Typography fontSize={13} color="text.secondary">
                Billed annually
              </Typography>

              <Divider sx={{ mt: 2 }} />

              <Box mt={1} sx={{ textAlign: "start" }}>
                <Typography variant="subtitle1" gutterBottom>
                  Includes:
                </Typography>
                <List dense>
                  {[
                    "Document title tracking",
                    "Productivity calculations",
                    "Calendar integrations",
                  ].map((feature) => (
                    <ListItem key={feature} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ color: "green" }} />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Button
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  borderColor: "#143351",
                  color: "#143351",
                  "&:hover": {
                    backgroundColor: "#143351",
                    color: "white",
                  },
                }}
                fullWidth
                variant="outlined"
                size="large"
              >
                Start free trial
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Premium Plan (Most Popular) */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              borderRadius: "12px",
              border: "2px solid #4ea819",
              position: "relative",
              overflow: "visible", // ✅ Let badge overflow
              zIndex: 1,
              transition: "all 0.3s ease !important",
              "&:hover": {
                boxShadow: "0px 0px 15px -1px rgba(78, 168, 25, 0.5)",
                cursor: "pointer",
              },
            }}
          >
            {/* Popular badge */}
            <Box
              sx={{
                position: "absolute",
                top: -12,
                right: 73,
                backgroundColor: "#edfce3",
                color: "green",
                px: 2,
                py: 0.5,
                borderRadius: "12px",
                fontSize: "0.75rem",
                fontWeight: "bold",
                zIndex: 2, 
                boxShadow:"0px 0px 5px -1px"
              }}
            >
              <Box sx={{display:"flex"}}>
 <Box>
                <WhatshotIcon sx={{fontSize:"15px"}}/>
              </Box>
              <Box>
              MOST POPULAR

              </Box>
              </Box>
             
            </Box>

            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  Premium
                </Box>
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                FOR HYBRID AND GROWING TEAMS
              </Typography>

              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "#4ea819" }}
              >
                ₹513.33
              </Typography>
              <Typography fontSize={13} color="text.secondary">
                Per user/month
              </Typography>
              <Typography fontSize={13} color="text.secondary">
                Billed annually
              </Typography>

              <Divider sx={{ mt: 2 }} />
              <Box mt={1} sx={{ textAlign: "start" }}>
                <Typography variant="subtitle1" gutterBottom>
                  Includes:
                </Typography>
                <List dense>
                  {[
                    "Screenshots",
                    "Integrations & API",
                    "Shift scheduling",
                  ].map((feature) => (
                    <ListItem key={feature} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ color: "green" }} />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>

            <Box sx={{ p: 2 }}>
              <Button
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  backgroundColor: "#4ea819",
                  color: "white",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#3d8a14",
                  },
                }}
                fullWidth
                variant="contained"
                size="large"
              >
                Start free trial
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Enterprise Plan */}
        <Grid item  xs={12} md={4}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              borderRadius: "12px",
              color: "white",
              backgroundColor: "#143351",
              transition: "all 0.3s ease !importnat", // define what to animate
              "&:hover": {
                border: "1px solid white",
                boxShadow: "0px 0px 5px -1px",

                cursor: "pointer",
                transition: 0.3,
              },
            }}
          >
            {" "}
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  Enterprise
                </Box>
              </Typography>
              <Typography variant="subtitle2" color="" gutterBottom>
                FOR LARGE ORGANISATIONS
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Custom
              </Typography>
              <Typography fontSize={13} color="">
                200+ users
              </Typography>
              <Typography fontSize={13} color="">
                Billed annually
              </Typography>

              <Divider sx={{ mt: 2, backgroundColor: "white !important" }} />
              <Box mt={1} sx={{ textAlign: "start" }}>
                <Typography variant="subtitle1" gutterBottom>
                  Everything in Premium plus:
                </Typography>
                <List dense>
                  {[
                    "Custom API on request",
                    "Account manager",
                    "Employee training",
                  ].map((feature) => (
                    <ListItem key={feature} disableGutters>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ color: "#ace6dd" }} />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
            <Box sx={{ p: 2 }}>
              <Button
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  borderColor: "#143351",
                  backgroundColor: "white",
                  color: "#143351",
                  // "&:hover": {
                  //   backgroundColor: "#143351",
                  //   color: "white",
                  // },
                }}
                fullWidth
                variant="contained"
                size="large"
              >
                Start free trial
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PricingPlans;
