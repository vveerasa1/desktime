import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  Button,
  Stack,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LoadingComponent from "../../ComponentLoader";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { useDeleteProfileMutation } from "../../../redux/services/user";
// import ControlPointIcon from "@mui/icons-material/ControlPoint"; // Removed as we're using an image
import contract from "../../../assets/images/gray-pen.png"; // Import the image

const ColleaguesList = ({
  navigate,
  colleaguesData,
  isLoading,
  openToaster,
}) => {
  const [deleteProfile] = useDeleteProfileMutation();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedColleague, setSelectedColleague] = useState(null);
  const token = localStorage.getItem("token");
  let userRole = "";

  if (token) {
    let decoded = jwtDecode(token);
    userRole = decoded?.role;
  }
  const handleEdit = () => {
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
  const handleDelete = async (id) => {
    console.log(id, "IDIDDIDIDI");
    try {
      await deleteProfile(id);
      openToaster("Employee Deleted");
      handleMenuClose();
    } catch (error) {
      // Catch the error to log it
      console.error("Error deleting profile:", error); // Log the actual error
      // Optionally, show an error toaster
      openToaster("Failed to delete employee", "error");
    }
  };
  return (
    <Box>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          {" "}
          {/* Use a React Fragment here to wrap conditional content */}
          {colleaguesData?.users?.length > 0 ? (
            <Grid container spacing={4}>
              {colleaguesData.users.map((colleague) => (
                <Grid item size={{ xs: 12, md: 3 }}>
                  {" "}
                  {/* Added responsive sizes */}
                  <Paper className={styles.card} elevation={1}>
                    {(userRole === "Admin" || userRole === "Owner") && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, colleague)}
                        className={styles.menuIcon}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    )}
                    {userRole === "Admin" || userRole === "Owner" ? (
                      <Link
                        style={{ textDecoration: "none", color: "inherit" }}
                        to={`/dashboard/employee=${colleague._id}`}
                      >
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
                              {colleague.role}
                            </Typography>
                          </Box>
                        </Box>
                      </Link>
                    ) : (
                      <Box className={styles.profileBox}>
                        <Avatar
                          alt={colleague.username}
                          src={colleague.photo}
                          className={styles.avatar}
                        />
                        <Box>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {colleague.username}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {colleague.role}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    )}

                    <Box className={styles.divider}></Box>

                    <Box className={styles.emailBox}>
                      <EmailIcon
                        fontSize="small"
                        className={styles.emailIcon}
                      />
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
                      PaperProps={{
                        sx: {
                          boxShadow: "0px 0px 2px -1px",
                        },
                      }}
                    >
                      <MenuItem onClick={handleEdit}>Edit</MenuItem>
                      <MenuItem
                        onClick={() => handleDelete(selectedColleague?._id)}
                      >
                        Delete
                      </MenuItem>
                    </Menu>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "200px", // Adjust height as needed
                p: 3,
                textAlign: "center",
                color: "#666",
              }}
            >
              {/* Replaced ControlPointIcon with the image */}
              <img
                src={contract}
                alt="No data icon"
                style={{
                  width: "80px",
                  height: "80px",
                  marginBottom: "16px",
                  opacity: 0.6,
                }} // Adjust size and opacity as needed
              />
              <Typography variant="h6" fontWeight="bold">
                No colleagues added yet.
              </Typography>
              <Typography variant="body1">
                Start by adding new employees to your organization.
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ColleaguesList;
