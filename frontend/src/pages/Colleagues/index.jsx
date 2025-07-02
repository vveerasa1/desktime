import {
  Box,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Paper,
  Typography,
} from "@mui/material";

import CustomTextField from "../../components/CustomTextField";

import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useEffect, useState } from "react";
import CustomSearchInput from "../../components/CustomSearchInput/index"; // adjust path as needed
import { useGetAllProfileQuery } from "../../redux/services/user";
import LoadingComponent from "../../components/ComponentLoader";
import { useNavigate } from "react-router-dom";
import ColleaguesList from "../../components/Colleagues/ColleaguesList";
import SearchIcon from "@mui/icons-material/Search";
import FilterPopover from "../../components/CustomFilter";
const Colleagues = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const { data: getProfile, isLoading } = useGetAllProfileQuery();
  const [colleaguesData, setColleaguesData] = useState([]);

  useEffect(() => {
    if (getProfile) {
      setColleaguesData(getProfile.data);
    }
  }, [getProfile]);

  // const handleSearch = (e) => {
  //   const value = e.target.value;
  //   setSearchText(value);
  //   const result = getProfile.data.filter((item) =>
  //     item.username.toLowerCase().includes(value.toLowerCase())
  //   );
  //   setFilteredData(result);
  // };

  return (
    <>
      <Box
        sx={{
          paddingTop: 5,
          paddingLeft: 5,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600} color="#333333">
            Colleagues
          </Typography>
        </Box>
        <Box  sx={{
         
          display: "flex",
          justifyContent: "space-between",
        }}>
          <CustomTextField
            // label="Password"
            name="password"
            // type={showPassword ? "text" : "password"}
            fullWidth
            startIcon={<SearchIcon />}
            placeholder={"search"}
            // endIcon={
            //   showPassword ? (
            //     <VisibilityOff
            //       onClick={togglePasswordVisibility}
            //       style={{ cursor: "pointer" }}
            //     />
            //   ) : (
            //     <Visibility
            //       onClick={togglePasswordVisibility}
            //       style={{ cursor: "pointer" }}
            //     />
            //   )
            // }
            // value={loginInfo.password}
            // handleChange={(e) => handleChange(e, "password")}
            // error={Boolean(errors.password)}
            // helperText={errors.password}
          />
          <FilterPopover/>
        </Box>
      </Box>

      <Box
        sx={{
          // padding: 5,
          paddingTop: 1,
          paddingLeft: 5,
          height: "100%",
        }}
      >
        {/* Top Control Bar */}

        {/* <Box width={200}>
          <CustomSearchInput
            value={searchText}

            // onChange={handleSearch}
          />
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
        </ToggleButtonGroup> */}
        {/* </Box> */}
        {/* Colleagues Grid */}
        <Paper
          sx={{
            padding: "10px",
            height: "100%",
          }}
        >
          <Box display="flex" gap={2} mb={3}>
            <Button
              variant="contained"
              sx={{
                borderRadius: 2,
                backgroundColor: "#E2FFE2",
                color: "black",
                width: "200px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              ACTIVE&nbsp;{" "}
              <Box
                component="span"
                bgcolor="#0FB90F"
                color="white"
                px={1}
                ml={1}
                borderRadius={1}
              >
                10
              </Box>
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{
                borderRadius: 2,
                backgroundColor: "#FFEAEA",
                color: "black",
                width: "200px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              IN-ACTIVE&nbsp;{" "}
              <Box
                component="span"
                bgcolor="#FF0000"
                color="white"
                px={1}
                ml={1}
                borderRadius={1}
              >
                10
              </Box>
            </Button>
          </Box>
          <ColleaguesList
            navigate={navigate}
            colleaguesData={colleaguesData}
            isLoading={isLoading}
          />
        </Paper>
      </Box>
    </>
  );
};

export default Colleagues;
