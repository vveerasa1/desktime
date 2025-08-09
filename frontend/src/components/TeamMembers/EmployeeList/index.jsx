import React from "react";
import styles from './index.module.css'
import { Paper,TableContainer,Table,TableHead,TableRow,TableCell,TableBody,Box,Avatar,Typography} from "@mui/material";
import { Link } from "react-router-dom";
Link
const EmployeeList = ({columns,userData,role,formatTime}) => {
  return (
    <>
      <TableContainer className={styles.tabContentWrapper} component={Paper}>
        <Table className={styles.teamTable}>
          <TableHead className={styles.tHead}>
            <TableRow className={styles.tHeadRow}>
              {columns.map((col, index) => (
                <TableCell className={styles.tHeadSell} key={index}>
                  <Box sx={{textAlign: col ==="Name" ? "left" :"center"}}>
                  {col}

                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {userData?.map((row, idx) => (
              <TableRow
                key={idx}
                className={styles.tBodyRow}
                sx={{
                  backgroundColor: idx % 2 === 0 ? "#f4f4f4" : "#ffffff",
                }}
              >
                <TableCell sx={{width:"380px"}} className={styles.tBodyCell}>
                  <Box  className={styles.tPersonInfo}>
                    <Box >
                      <Avatar
                        alt="User Profile"
                        src={row.user.photo}
                        className={styles.avatarImage}
                      />
                    </Box>
                    <Box >
                      {role === "Admin" || role === "Owner" ? (
                        <Link
                          className={styles.tPersonName}
                          to={`/dashboard/employee=${row.user._id}`}
                        >
                          {row.user.username}
                        </Link>
                      ) : (
                        <Typography
                          className={styles.tPersonName}
                          to={`/dashboard/employee=${row.user._id}`}
                        >
                          {row.user.username}
                        </Typography>
                      )}

                      <Typography className={styles.tPersonDept}>
                        {row.user.role}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell className={styles.tBodyCell}>
                  <Box sx={{textAlign:"center"}}>
                  {formatTime(row.productiveTime)}

                  </Box>
                </TableCell>
                <TableCell className={styles.tBodyCell}>
                  <Box sx={{textAlign:"center"}}>
                  {formatTime(row.offlineTime)}

                  </Box>
                </TableCell>
                <TableCell className={styles.tBodyCell}>
                  <Box sx={{textAlign:"center"}}>
                  {formatTime(row.deskTime)}

                  </Box>
                </TableCell>
                <TableCell className={styles.tBodyCell}>
                  <Box sx={{textAlign:"center"}}>
                  {row.arrivalTime || "-"}

                  </Box>
                </TableCell>
                <TableCell sx={{width:"150px"}}className={styles.tBodyCell}>
                  <Box sx={{textAlign:"center"}}>
                  {row.leftTime || "-"}

                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default EmployeeList;
