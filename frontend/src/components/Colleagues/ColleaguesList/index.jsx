import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  styled,
  keyframes,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LoadingComponent from "../../ComponentLoader";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import styles from "./index.module.css";
import { useDeleteProfileMutation } from "../../../redux/services/user";
import contract from "../../../assets/images/gray-pen.png";

// Keyframes for the glowing effect
const glow = keyframes`
  0% { box-shadow: 0 0 5px #a5d6a7; }
  50% { box-shadow: 0 0 10px #a5d6a7, 0 0 15px #a5d6a7; }
  100% { box-shadow: 0 0 5px #a5d6a7; }
`;

const ActiveDot = styled("div")(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  left: theme.spacing(1),
  width: 10,
  height: 10,
  backgroundColor: '#4feb3eff', // Using a lighter green
  borderRadius: "50%",
  border: `2px solid ${theme.palette.background.paper}`,
  boxSizing: "border-box",
  animation: `${glow} 2s infinite ease-in-out`, // Applying the glowing animation
}));

const InActiveDot = styled("div")(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(1),
  left: theme.spacing(1),
  width: 10,
  height: 10,
  backgroundColor: '#f81717ff', // Using a lighter green
  borderRadius: "50%",
  border: `2px solid ${theme.palette.background.paper}`,
  boxSizing: "border-box",
  animation: `${glow} 2s infinite ease-in-out`, // Applying the glowing animation
}));

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
    try {
      await deleteProfile(id);
      openToaster("Employee Deleted");
      handleMenuClose();
    } catch (error) {
      console.error("Error deleting profile:", error);
      openToaster("Failed to delete employee", "error");
    }
  };

  return (
    <Box>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          {colleaguesData?.users?.length > 0 ? (
            <Grid container spacing={4}>
              {colleaguesData.users.map((colleague) => (
                <Grid item key={colleague._id} size={{xs:12,md:3}}>
                  <Paper className={styles.card} elevation={3}>
                    {colleague.active === true ?  <ActiveDot /> : <InActiveDot/> }
                    {(userRole === "Admin" || userRole === "Owner") && (
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
                          boxShadow: "0px 0px 1.5px -1px",
                          borderColor:"red !important "
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
                minHeight: "200px",
                p: 3,
                textAlign: "center",
                color: "#666",
              }}
            >
              <img
                src={contract}
                alt="No data icon"
                style={{
                  width: "80px",
                  height: "80px",
                  marginBottom: "16px",
                  opacity: 0.6,
                }}
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