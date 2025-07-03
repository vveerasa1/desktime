import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import LoadingComponent from "../../ComponentLoader";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import styles from "./index.module.css";

const ColleaguesList = ({ navigate, colleaguesData, isLoading }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedColleague, setSelectedColleague] = useState(null);
  const token = localStorage.getItem("token");
  let userRole = "";

  if (token) {
    let decoded = jwtDecode(token);
    userRole = decoded?.role;
  }
  console.log(userRole);
  const handleEdit = () => {
    console.log("Edit", selectedColleague);
    handleMenuClose();
    navigate(`/colleagues/edit/${selectedColleague._id}`);
  };
  const handleMenuOpen = (event, colleague) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedColleague(colleague);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedColleague(null);
  };
  const handleDelete = () => {
    console.log("Delete", selectedColleague);
    handleMenuClose();
    // Add delete logic here
  };
  return (
    <Box>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <Grid container spacing={3}>
          {colleaguesData?.length > 0 &&
            colleaguesData.map((colleague, index) => (
              <Grid item key={index} size={3} className={styles.gridItem}>
                <Paper className={styles.card} elevation={1}>
                  {userRole === "Admin" && (
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, colleague)}
                      className={styles.menuIcon}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  )}

                  <Box className={styles.profileBox}>
                    <Avatar
                      alt={colleague.username}
                      src={colleague.photo}
                      className={styles.avatar}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {colleague.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {colleague.role || "Web Developer"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box className={styles.divider}></Box>

                  <Box className={styles.emailBox}>
                    <EmailIcon fontSize="small" className={styles.emailIcon} />
                    <Typography variant="body2" color="text.secondary">
                      {colleague.email}
                    </Typography>
                  </Box>

                  <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  </Menu>
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}
    </Box>
  );
};

export default ColleaguesList;
