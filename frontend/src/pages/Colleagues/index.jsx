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
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useEffect, useState } from "react";
import CustomSearchInput from "../../components/CustomSearchInput/index"; // adjust path as needed
import { useGetAllProfileQuery } from "../../redux/services/userService";
import LoadingComponent from "../../components/ComponentLoader";

import { useNavigate } from "react-router-dom";
import ColleaguesTable from "../../components/ColleaguesTable";
const Colleagues = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const { data: getProfile, isLoading } = useGetAllProfileQuery();
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
      <ColleaguesTable
      navigate={navigate}
      filteredData={filteredData}
      isLoading={isLoading}
      />
    </Box>
  );
};

export default Colleagues;
