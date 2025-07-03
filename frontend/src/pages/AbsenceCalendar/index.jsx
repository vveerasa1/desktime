import { Box } from "@mui/material";
import { useState } from "react";
import WeeklyAbsenceCalender from "../../components/WeeklyAbsenceCalender";
import DeskTimeHeader from "../../components/Dashboard/DeskTimeHeader";
const AbsenceCalender = () => {
  const [filters,setFilters] = useState({
   view:"",
   date:"" 
  })
  return (
    <Box>
      <DeskTimeHeader setFilters={setFilters} />
      <WeeklyAbsenceCalender />
    </Box>
  );
};

export default AbsenceCalender;
