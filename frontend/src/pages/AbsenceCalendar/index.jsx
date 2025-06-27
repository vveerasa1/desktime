import { Box } from "@mui/material"
import WeeklyAbsenceCalender from "../../components/WeeklyAbsenceCalender"
import DeskTimeHeader from "../../components/Dashboard/DeskTimeHeader"
const AbsenceCalender = () => {
  return (
   <Box>
    <DeskTimeHeader/>
        <WeeklyAbsenceCalender/>
   </Box>
  )
}

export default AbsenceCalender
