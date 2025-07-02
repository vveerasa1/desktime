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
const ColleaguesList = ({ navigate, colleaguesData, isLoading }) => {

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedColleague, setSelectedColleague] = useState(null);
  const token = localStorage.getItem('token')
  let userRole = ''

  if(token){
    let decoded = jwtDecode(token)
    userRole = decoded?.role
  }
  console.log(userRole)
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
        <Grid
          container
          spacing={3}
          sx={{
            // justifyContent: "space-between", // ensures left alignment with spacing
            alignItems: "stretch", // ensures equal height
          }}
        >
          {colleaguesData?.length > 0 &&
            colleaguesData.map((colleague, index) => (
              <Grid
                item
                // xs={12}
                // sm={6}
                // md={3}
                key={index}
                size={3}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    minHeight: "130px",
                    border: "1px solid #eee",
                    position: "relative",
                  }}
                > 
                {userRole === 'Admin' &&(
                   <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, colleague)}
                    sx={{ position: "absolute", top: 4, right: 4 }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                )}
                 

                  <Box display="flex" alignItems="center" gap={2} mb={1}>
                    <Avatar
                      alt={colleague.username}
                      src={colleague.photo}
                      sx={{ width: 48, height: 48, fontSize: 18 }}
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

                  <Box
                    width="100%"
                    borderBottom="1px solid #e0e0e0"
                    mb={1}
                  ></Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <EmailIcon fontSize="small" sx={{ color: "gray" }} />
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
