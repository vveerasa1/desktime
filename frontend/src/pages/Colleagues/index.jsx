import {
  Box,
  Grid,
  Typography,
  Paper,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { collegeData } from "./ColleaguesData";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useState } from "react";
import CustomSearchInput from "../../components/CustomSearchInput/index"; // adjust path as needed

const Colleagues = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(collegeData);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const result = collegeData.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
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
      <Grid container spacing={5}>
        {filteredData.map((colleague, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={21}
              sx={{
                borderRadius: 2,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box p={2} display={"flex"} gap={2} alignItems="center">
                <img
                  src={colleague.image}
                  alt={colleague.name}
                  style={{ width: 70, height: 70, borderRadius: "50%" }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {colleague.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Team: {colleague.team}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ paddingX: 2, paddingBottom: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Email: {colleague.mail}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Colleagues;
