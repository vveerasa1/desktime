import {
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Button,
} from "@mui/material";
import { collegeData } from "./ColleaguesData";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useEffect, useState } from "react";
import CustomSearchInput from "../../components/CustomSearchInput/index"; // adjust path as needed
import { useGetAllProfileQuery } from "../../redux/services/user";
import LoadingComponent from "../../components/ComponentLoader";
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom'
const Colleagues = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const { data: getProfile, isLoading, error } = useGetAllProfileQuery();
  const [filteredData, setFilteredData] = useState([]);

  console.log(getProfile, "PROFILE DATAS");

  useEffect(() => {
    if (getProfile) {
      setFilteredData(getProfile.data);
    }
  }, [getProfile]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const result = collegeData.filter((item) =>
      item.username.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(result);
  };
  return (
    <Box sx={{ padding: 5 }}>
      {/* Top Control Bar */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        flexWrap="wrap"
        sx={{ marginBottom: 3 }}
      >
        <Box width={200}>
          <CustomSearchInput value={searchText} onChange={handleSearch} />
        </Box>

        <IconButton>
          <FilterListIcon />
        </IconButton>

        <ToggleButtonGroup size="small" exclusive>
          <ToggleButton value="asc">
            <ArrowUpwardIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="desc">
            <ArrowDownwardIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {/* Colleagues Grid */}
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <Grid
          container
          spacing={3}
          sx={{
            display: "flex !important",
            justifyContent: "",
          }}
        >
          {console.log(filteredData, "FILTERD DATA")}
          {filteredData &&
            filteredData.length > 0 &&
            filteredData.map((colleague, index) => (
              <Grid
                size={{ xs: 12, md: 4 }}
                item
                xs={12}
                sm={6}
                md={3} // Changed from md={3} to md={4} for 3 columns per row
                key={index}
              >
                <Paper
                  elevation={5}
                  sx={{
                    borderRadius: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    p={2}
                    display="flex"
                    gap={2}
                    alignItems="center"
                    flexDirection={'row'}
                  >
                    <Box>
                      <img
                        src={colleague.photo}
                        alt={colleague.username}
                        style={{ width: 70, height: 70, borderRadius: "50%" }}
                      />
                    </Box>

                    <Box sx={{width:"100% !important"}}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {colleague.username}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Team: {colleague.team}
                      </Typography>
                    </Box>
                    <Box sx={{
                      width:"100%",
                      display: "flex !important",
                      justifyContent:"end"

                    }} display={'flex'}  >
                      <Box>
                        <Button><AddIcon/></Button>

                      </Box>
                      <Box>
                        <Button><EditIcon/></Button>

                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ paddingX: 2, paddingBottom: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Email: {colleague.email}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
        </Grid>
      )}
    </Box>
  );
};

export default Colleagues;
